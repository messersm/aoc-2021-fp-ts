import * as fs from 'fs/promises'

import * as E from 'fp-ts/Either'
import * as S from 'fp-ts/string'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { flow, pipe } from 'fp-ts/function'

const readTextfile =
    (name: string): TE.TaskEither<Error, string> =>
    () =>
    fs.readFile(name, "utf-8")
        .then(E.right)
        .catch(flow(E.toError, E.left))


const numberFromString = (s: string): E.Either<Error, number> => {
    const x = Number(s)
    
    switch(Number.isNaN(x)) {
        case true: return E.left(new Error(`Not a number: '${s}'`))
        case false: return E.right(x)
    }
}

const contentsToNumbers = flow(
    S.trim,
    S.split('\n'),
    RA.map(numberFromString),
    E.sequenceArray,
)

const countIncreases = flow(
    (xs: readonly number[]) => RA.zipWith(
        RA.dropLeft(1)(xs),
        xs,
        (x, y) => x - y > 0
    ),
    RA.filter(Boolean),
    RA.size
)

const main = pipe(
    process.argv,
    RA.dropLeft(2), // Ignore the ts-node command and script filename.
    RA.last,
    TE.fromOption(() => new Error("No input file provided.")),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToNumbers),
    TE.map(countIncreases),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
