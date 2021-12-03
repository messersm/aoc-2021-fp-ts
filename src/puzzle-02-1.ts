import * as E from 'fp-ts/Either'
import * as Endo from 'fp-ts/Endomorphism'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import * as SG from 'fp-ts/Semigroup'
import * as TE from 'fp-ts/TaskEither'

import { flow, identity, pipe } from 'fp-ts/function'

import {
    numberFromString,
    getInputFilename,
    readTextfile,
} from './lib'


interface Forward {
    readonly _tag: "Forward"
    readonly value: number
}

interface Down {
    readonly _tag: "Down"
    readonly value: number
}

interface Up {
    readonly _tag: "Up"
    readonly value: number
}

type MoveTag = Forward["_tag"] | Down["_tag"] | Up["_tag"]

type Move = Forward | Down | Up

const moveTagFromString = (tag: string): E.Either<Error, MoveTag> => {
    switch(tag) {
        case "forward": return E.right("Forward")
        case "down":    return E.right("Down")
        case "up":      return E.right("Up")
        default:        return E.left(new Error(`Invalid move tag: '${tag}'`))
    }
}

const moveFromString: (s: string) => E.Either<Error, Move> = flow(
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

const contentsToMoves = flow(
    S.trim,
    S.split('\n'),
    RA.map(moveFromString),
    E.sequenceArray
)


type Position = {
    readonly _tag: "Position",
    readonly horizontal: number,
    readonly depth: number
}

const applyMove = (m: Move) => (p: Position): Position => {
    switch(m._tag) {
        case "Forward": return {...p, horizontal: p.horizontal + m.value }
        case "Down":    return {...p, depth: p.depth + m.value }
        case "Up":      return {...p, depth: p.depth - m.value }

        // exhaustive pattern matching
        default: return identity<never>(m)
    }
}

const startPos: Position = {
    _tag: "Position",
    horizontal: 0,
    depth: 0
}

const applyAllMoves = SG.concatAll(Endo.getSemigroup<Position>())(identity)

const main = pipe(
    TE.fromIOEither(getInputFilename),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToMoves),
    TE.map(RA.map(applyMove)),
    TE.map(applyAllMoves),
    TE.map(f => f(startPos)),
    TE.map(({depth, horizontal}) => depth * horizontal),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
