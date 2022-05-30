import * as fs from 'fs/promises'

import * as E from 'fp-ts/Either'
import * as IOE from 'fp-ts/IOEither'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import * as TE from './lib/TaskEither'

import { flow, pipe } from 'fp-ts/function'
import { Endomorphism } from 'fp-ts/lib/Endomorphism'


export const numberFromString = (s: string): E.Either<Error, number> => {
    const x = Number(s)
    
    switch(Number.isNaN(x)) {
        case true: return E.left(new Error(`Not a number: '${s}'`))
        case false: return E.right(x)
    }
}


export const contentsToNumbers = flow(
    S.trim,
    S.split('\n'),
    RA.map(numberFromString),
    E.sequenceArray,
)

export const countIncreases = flow(
    (xs: readonly number[]) => RA.zipWith(
        RA.dropLeft(1)(xs),
        xs,
        (x, y) => x - y > 0
    ),
    RA.filter(Boolean),
    RA.size
)

/**
 * Return the input filename provided to the node runtime.
 */
export const getInputFilename: IOE.IOEither<Error, string> = () => pipe(
    process.argv,
    RA.dropLeft(2), // Ignore the ts-node command and script filename.
    RA.last,
    E.fromOption(() => new Error("No input file provided."))
)

/**
 * Try to asynchronously read the file specified by `name` as text file.
 */
export const readTextfile =
    (name: string): TE.TaskEither<Error, string> =>
    TE.tryCatch(() => fs.readFile(name, "utf-8"), E.toError)


export const zip3 =
    <C>(cs: readonly C[]) =>
    <B>(bs: readonly B[]) =>
    <A>(as: readonly A[]): readonly [A, B, C][] => {
        const items = [as, bs, cs]
        const length = Math.min(...items.map(x => x.length))

        let result: [A, B, C][] = []
        for (let i=0; i<length; i++)
            result.push([as[i], bs[i], cs[i]])

        return result
    }


export const getMain =
    <A>(parse: (s: string) => E.Either<Error, A>) =>
    <B>(compute: (a: A) => B) => pipe(
        TE.fromIOEither(getInputFilename),
        TE.chain(readTextfile),
        TE.chainEitherK(parse),
        TE.map(compute),
        TE.log,
        TE.logError
)