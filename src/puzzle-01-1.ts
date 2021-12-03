import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { flow, pipe } from 'fp-ts/function'
import { contentsToNumbers, getInputFilename, readTextfile } from './lib'

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
    TE.fromIOEither(getInputFilename),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToNumbers),
    TE.map(countIncreases),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
