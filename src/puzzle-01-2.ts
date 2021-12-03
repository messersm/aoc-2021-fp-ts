import * as M from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { flow, pipe } from 'fp-ts/function'
import {
    contentsToNumbers,
    countIncreases,
    getInputFilename,
    readTextfile,
    zip3
} from './lib'


const sliding = (xs: readonly number[]) => zip3
    (RA.dropLeft(2)(xs))
    (RA.dropLeft(1)(xs))
    (xs)


const main = pipe(
    TE.fromIOEither(getInputFilename),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToNumbers),
    TE.map(flow(
        sliding,
        RA.map(M.concatAll(N.MonoidSum)),
        countIncreases
    )),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
