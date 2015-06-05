import Immutable from 'immutable'

import BaseStore from './BaseStore.js'
import {GRID_COLUMNS, SQUARE_SIZE, GRID_HEIGHT} from '../misc/dimensions.js'
import {INIT_QUEUE, REFILL_QUEUE, UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from '../misc/actions.js'
import {generateBlock, rowToY, yToRow} from '../misc/squareHelpers.js'
import Block from './squareStore/Block.js'
import Queue from './squareStore/Queue.js'

export default class SquareStore extends BaseStore {

    constructor(dispatcher, state, configStore, gravityStore) {
        super(dispatcher, [gravityStore]);
        this.configStore = configStore;
        this.gravityStore = gravityStore;

        this.block = new Block(state.cursor([SquareStore.name, 'block'], {}));
        this.queue = new Queue(state.cursor([SquareStore.name, 'queue'], {}));
    }

    handleAction({action, payload}) {

        /** Horizontally move the block, if allowed */
        const move = distance => {
            const column = this.block.column + distance;
            if (column >= 0 && column <= GRID_COLUMNS - 2) {
                this.block.column = column;
            }
        };

        /** Pop new block from the queue and add it to the top of the grid */
        const resetBlock = () => {
            const speed = this.configStore.baseBlockSpeed + this.gravityStore.gravity / 50;
            const squares = this.queue.dequeue();
            this.block.reset(speed, squares);
        };

        /** Main update function, called in every tick */
        const update = (time, gravity) => {
            this.block.update(time, gravity);
            if (this.block.y > GRID_HEIGHT) {
                resetBlock();
            }
        };

        switch (action) {
            case INIT_QUEUE:
                payload.forEach(this.queue.enqueue.bind(this.queue));
                resetBlock();
                break;

            case REFILL_QUEUE:
                this.queue.enqueue(payload);
                break;

            case ROTATE_LEFT:
                this.block.rotate(-1);
                break;

            case ROTATE_RIGHT:
                this.block.rotate(1);
                break;

            case MOVE_LEFT:
                move(-1);
                break;

            case MOVE_RIGHT:
                move(1);
                break;

            case UPDATE:
                update(payload.time, this.gravityStore.gravity);
                break;

            case DROP:
                this.block.drop();
                break;
        }
    }

    getBlock() {
        return this.block.getData();
    }

    getQueue() {
        return this.queue.getData();
    }
}