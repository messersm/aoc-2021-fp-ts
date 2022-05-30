import { flow, apply } from 'fp-ts/function'
import { getMain } from './lib'
import { applyMoveWithAim, contentsToMoves, startPosWithAim, concatWith} from './lib/Move'

const compute = flow(
    concatWith(applyMoveWithAim),
    apply(startPosWithAim),
    ({depth, horizontal}) => depth * horizontal
)

const main = getMain(contentsToMoves)(compute)

main()
