import * as TE from 'fp-ts/TaskEither'

import { pipe } from 'fp-ts/function'
import {
    contentsToNumbers,
    countIncreases,
    getInputFilename,
    readTextfile
} from './lib'


const main = pipe(
    TE.fromIOEither(getInputFilename),
    TE.chain(readTextfile),
    TE.chainEitherK(contentsToNumbers),
    TE.map(countIncreases),
    TE.map(console.log),
    TE.mapLeft(e => console.error(e.message))
)

main()
