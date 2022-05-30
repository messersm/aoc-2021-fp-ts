import * as M from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'

import { flow } from 'fp-ts/function'
import {
    contentsToNumbers,
    countIncreases,
    getMain,
    zip3
} from './lib'

const sliding = (xs: readonly number[]) => zip3
    (RA.dropLeft(2)(xs))
    (RA.dropLeft(1)(xs))
    (xs)

const compute = flow(
    sliding,
    RA.map(M.concatAll(N.MonoidSum)),
    countIncreases
)

const main = getMain(contentsToNumbers)(compute)

main()
