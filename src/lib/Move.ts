import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'

import { flow, identity, pipe } from 'fp-ts/function'
import { numberFromString } from '../lib'

export interface Forward {
    readonly _tag: "Forward"
    readonly value: number
}

export interface Down {
    readonly _tag: "Down"
    readonly value: number
}

export interface Up {
    readonly _tag: "Up"
    readonly value: number
}

export type Move = Forward | Down | Up
export type MoveTag = Forward["_tag"] | Down["_tag"] | Up["_tag"]

export const moveTagFromString = (tag: string): E.Either<Error, MoveTag> => {
    switch(tag) {
        case "forward": return E.right("Forward")
        case "down":    return E.right("Down")
        case "up":      return E.right("Up")
        default:        return E.left(new Error(`Invalid move tag: '${tag}'`))
    }
}

export const moveFromString: (s: string) => E.Either<Error, Move> = flow(
    S.split(" "),
    xs => pipe(
        E.Do,
        E.bind('_tag', () => pipe(
            xs[0],
            E.fromNullable(new Error("Missing move tag")),
            E.chain(moveTagFromString)
        )),
        E.bind('value', () => pipe(
            xs[1],
            E.fromNullable(new Error("Missing move value")),
            E.chain(numberFromString)
        ))
    )
)

export const contentsToMoves = flow(
    S.trim,
    S.split('\n'),
    RA.map(moveFromString),
    E.sequenceArray
)

export type Position = {
    readonly _tag: "Position",
    readonly horizontal: number,
    readonly depth: number
}

export type PositionWithAim = {
    readonly _tag: "PositionWithAim"
    readonly horizontal: number,
    readonly depth: number
    readonly aim: number
}

export const applyMove = (m: Move) => (p: Position): Position => {
    switch(m._tag) {
        case "Forward": return {...p, horizontal: p.horizontal + m.value }
        case "Down":    return {...p, depth: p.depth + m.value }
        case "Up":      return {...p, depth: p.depth - m.value }

        // exhaustive pattern matching
        default: return identity<never>(m)
    }
}

export const applyMoveWithAim =
    (m: Move) =>
    (p: PositionWithAim): PositionWithAim => {
        switch(m._tag) {
            case "Forward": return {
                ...p,
                horizontal: p.horizontal + m.value,
                depth: p.depth + p.aim * m.value
            }
            case "Down": return { ...p, aim: p.aim + m.value }
            case "Up": return { ...p, aim: p.aim - m.value }
    
            // exhaustive pattern matching
            default: return identity<never>(m)
        }
    }

export const startPos: Position = {
    _tag: "Position",
    horizontal: 0,
    depth: 0
}

export const startPosWithAim: PositionWithAim = {
    _tag: "PositionWithAim",
    horizontal: 0,
    depth: 0,
    aim: 0
}