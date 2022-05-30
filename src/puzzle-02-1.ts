import { flow, apply } from 'fp-ts/function'

import { getMain } from './lib'
import { applyMove, concatWith, contentsToMoves, startPos } from './lib/Move'

const compute = flow(
    concatWith(applyMove),
    apply(startPos),
    ({depth, horizontal}) => depth * horizontal
)

const main = getMain(contentsToMoves)(compute)

main()
