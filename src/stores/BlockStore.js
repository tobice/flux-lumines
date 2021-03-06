import {List} from 'immutable';

import BaseStore from './BaseStore.js';
import Block from '../daos/Block.js';
import Queue from '../daos/Queue.js';
import {PLAYING} from '../game/gameStates.js';
import {RESTART, REFILL_QUEUE, UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from '../game/actions.js';
import {SQUARE_SIZE} from '../game/dimensions.js';

export default class BlockStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.block = new Block(state.cursor(['BlockStore', 'block'], {}));
        this.queue = new Queue(state.cursor(['BlockStore', 'queue'], {}));

        this.decomposedSquares = new List();
    }

    handleAction({action, payload}) {
        let {configStore, gameStateStore, gravityStore, squareStore} = this.stores;

        const move = distance => {
            let x = this.block.x + distance;
            // Make sure there is space from both sides
            if (squareStore.isFree({x: x, y: this.block.y + SQUARE_SIZE}) &&
                squareStore.isFree({x: x + SQUARE_SIZE, y: this.block.y + SQUARE_SIZE})) {
                this.block.move(x);
            }
        };

        const resetBlock = () => {
            this.waitFor([gravityStore]);
            let speed = configStore.baseBlockSpeed + gravityStore.gravity / 50;
            let squares = this.queue.dequeue();
            this.block.reset(speed, squares);
        };

        const willCollide = () => {
            return !this.block.getFieldsBellow().every(field => squareStore.isFree(field));
        };

        const decompose = () => {
            this.decomposedSquares = this.block.decomposeToSquares();
            resetBlock();
        };

        const update = (time, gravity) => {
            this.waitFor([gravityStore]);
            this.decomposedSquares = new List();
            const {block, queue} = this;

            if (block.dropped) {
                // If the block is dropped, it's probably moving fast, making huge leaps between
                // the frames. When reaching the conflicting position (there is something
                // bellow), it could be already in the half of the next row. To avoid any
                // flickering, I can't afford to render the block on this position. Therefore I
                // have to first update and if I find conflict, I have to immediately
                // attach the block to the grid on it's correct normalized coordinates.
                block.update(time, gravity);
                if (willCollide()) {
                    decompose();
                }
            } else if (block.willEnterNewRow(time) && willCollide()) {
                // However, if the block is not dropped, it is desirable to keep the block in a
                // conflicting position for a while to allow user to make few more moves.
                // Therefore I will check for collisions only in the moment when the block would
                // actually reach the next row (and would possibly overlap existing squares).
                decompose();
            } else {
                block.update(time, gravity);
            }


            queue.update(time);
        };

        // Allow certain actions only when the game is on
        if (gameStateStore.state !== PLAYING && [RESTART, REFILL_QUEUE].indexOf(action) === -1) {
            return;
        }

        switch (action) {
            case RESTART:
                resetBlock();
                this.queue.reset();
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
                move(-SQUARE_SIZE);
                break;

            case MOVE_RIGHT:
                move(SQUARE_SIZE);
                break;

            case UPDATE:
                update(payload.time, gravityStore.gravity);
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
