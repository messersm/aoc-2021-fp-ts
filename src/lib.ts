import * as fs from 'fs/promises'

import * as E from 'fp-ts/Either'
import * as IOE from 'fp-ts/IOEither'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import * as TE from 'fp-ts/TaskEither'

import { flow, pipe } from 'fp-ts/function'


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


export const readTextfile =
    (name: string): TE.TaskEither<Error, string> =>
    TE.tryCatch(() => fs.readFile(name, "utf-8"), E.toError)

export const getInputFilename: IOE.IOEither<Error, string> = pipe(
    process.argv,
    RA.dropLeft(2), // Ignore the ts-node command and script filename.
    RA.last,
    IOE.fromOption(() => new Error("No input file provided.")),
)
