import * as Endo from 'fp-ts/Endomorphism'
import * as M from 'fp-ts/Monoid'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { pipe } from 'fp-ts/function'

import { getInputFilename, readTextfile } from './lib'
import { applyMoveWithAim, contentsToMoves, startPosWithAim } from './lib/Move'


const main = pipe(
    TE.fromIOEither(getInputFilename),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToMoves),
    TE.map(RA.map(applyMoveWithAim)),
    TE.map(M.concatAll(Endo.getMonoid())),
    TE.map(f => f(startPosWithAim)),
    TE.map(({depth, horizontal}) => depth * horizontal),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
