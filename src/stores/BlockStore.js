import Immutable from 'immutable'

import BaseStore from './BaseStore.js'
import {GRID_COLUMNS, SQUARE_SIZE, GRID_COLUMNS} from '../misc/dimensions.js'
import {UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from '../misc/actions.js'
import {generateBlock, rowToY, yToRow} from '../misc/squareHelpers.js'

/** Store for the falling block controlled by the player */
export default class BlockStore extends BaseStore {

    constructor(dispatcher, state, configStore, gravityStore) {
        super(dispatcher, [gravityStore]);
        this.configStore = configStore;
        this.gravityStore = gravityStore;

        this.blockCursor = state.cursor([BlockStore.name, 'block'], generateBlock());

        // Set default speed
        // TODO: find a better way, it will be the same when creating new block
        this.blockCursor(block =>
            block.set('speed', this.configStore.baseBlockSpeed + this.gravityStore.gravity / 50));
    }

    handleAction({action, payload}) {

        /** Rotate the block by shifting the squares */
        const rotate = shift =>
            this.blockCursor(block => block.update('squares', squares =>
                squares.map((_, i) => squares.get((i - shift) % 4))
            ));

        /** Horizontally move the block, if allowed */
        const move = distance => {
            const column = this.blockCursor().get('column') + distance;
            if (column >= 0 && column <= GRID_COLUMNS - 2) {
                this.blockCursor(block => block.set('column', column));
            }
        };

        /** Update the block position. Increase speed using gravity only when dropped */
        const update = () =>
            this.blockCursor(block => block
                .update('y', y => y + block.get('speed') * payload.time)
                .update('speed', speed =>
                    speed + this.gravityStore.gravity * payload.time * block.get('dropped')));

        /** Drop the block if not dropped already. Increase the speed and "let it fall" */
        const drop = () =>
            this.blockCursor(block => block.get('dropped') ? block : block
                .set('dropped', true)
                .update('y', y => rowToY(yToRow(y))) // reset the y position to current row
                .update('speed', speed => speed * 40));

        switch (action) {
            case ROTATE_LEFT:
                rotate(-1);
                break;

            case ROTATE_RIGHT:
                rotate(1);
                break;

            case MOVE_LEFT:
                move(-1);
                break;

            case MOVE_RIGHT:
                move(1);
                break;

            case UPDATE:
                update();
                break;

            case DROP:
                drop();
                break;
        }
    }

    get block() {
        return this.blockCursor();
    }
}