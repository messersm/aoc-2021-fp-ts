import * as Endo from 'fp-ts/Endomorphism'
import * as M from 'fp-ts/Monoid'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { pipe } from 'fp-ts/function'

import { getInputFilename, readTextfile } from './lib'
import { applyMove, contentsToMoves, startPos } from './lib/Move'


const main = pipe(
    TE.fromIOEither(getInputFilename),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToMoves),
    TE.map(RA.map(applyMove)),
    TE.map(M.concatAll(Endo.getMonoid())),
    TE.map(f => f(startPos)),
    TE.map(({depth, horizontal}) => depth * horizontal),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
