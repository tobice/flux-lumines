import {List} from 'immutable'

import BaseStore from './BaseStore.js'
import Block from '../daos/Block.js'
import Queue from '../daos/Queue.js'
import {PLAYING} from '../game/gameStates.js'
import {RESTART, REFILL_QUEUE, UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from '../game/actions.js'
import {SQUARE_SIZE} from '../game/dimensions.js'

export default class BlockStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.block = new Block(state.cursor([BlockStore.name, 'block'], {}));
        this.queue = new Queue(state.cursor([BlockStore.name, 'queue'], {}));

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

        const update = (time, gravity) => {
            this.waitFor([gravityStore]);
            this.decomposedSquares = new List();
            const {block, queue} = this;

            block.update(time, gravity);
            if (!block.getFieldsBellow().every(field => squareStore.isFree(field))) {
                this.decomposedSquares = block.decomposeToSquares();
                resetBlock();
            }

            queue.update(time);
        };

        // Allow certain actions only when the game is on
        if (gameStateStore.state != PLAYING &&
            [RESTART, REFILL_QUEUE].indexOf(action) == -1) return;

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
