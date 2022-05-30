import * as Console from 'fp-ts/Console'
import * as TE from 'fp-ts/TaskEither'

import { flow, pipe } from 'fp-ts/function'

export * from 'fp-ts/TaskEither'

/**
 * Add a side effect, which logs the value-branch of an TaskEither
 */
export const log =
    <E, A>(te: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(te, TE.chainFirstIOK(Console.log))

/**
* Add a side effect, which logs the error-branch of an TaskEither.
*/
export const logError =
    <E, A>(te: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(
        te,
        TE.swap,
        TE.chainFirstIOK(flow(String, Console.error)),
        TE.swap
    )
