import Immutable from 'immutable'

import BaseStore from './BaseStore.js'
import {GRID_COLUMNS, SQUARE_SIZE, GRID_HEIGHT} from '../misc/dimensions.js'
import {RESTART, INIT_QUEUE, REFILL_QUEUE, UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from '../misc/actions.js'
import {generateBlock, columnToX, rowToY, yToRow} from '../misc/squareHelpers.js'
import Block from './squareStore/Block.js'
import Queue from './squareStore/Queue.js'
import Grid from './squareStore/Grid.js'
import DetachedSquares from './squareStore/DetachedSquares.js'

export default class SquareStore extends BaseStore {

    constructor(dispatcher, state, configStore, gravityStore) {
        super(dispatcher, [gravityStore]);
        this.configStore = configStore;
        this.gravityStore = gravityStore;

        this.block = new Block(state.cursor([SquareStore.name, 'block'], {}));
        this.queue = new Queue(state.cursor([SquareStore.name, 'queue'], {}));
        this.grid = new Grid(state.cursor([SquareStore.name, 'grid'], {}));
        this.detachedSquares = new DetachedSquares(state.cursor([SquareStore.name, 'detachedSquares'], {}));
    }

    handleAction({action, payload}) {

        /** Horizontally move the block, if allowed */
        const move = distance => {
            const x = this.block.x + distance;
            // Make sure there is space from both sides
            if (this.grid.isFree({x: x, y: this.block.y + SQUARE_SIZE}) &&
                this.grid.isFree({x: x + SQUARE_SIZE, y: this.block.y + SQUARE_SIZE})) {
                this.block.move(x);
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
            const {block, grid, detachedSquares} = this;

            block.update(time, gravity);
            if (!block.getFieldsBellow().every(field => grid.isFree(field))) {
                block.decomposeToSquares().forEach(square => detachedSquares.add(square));
                resetBlock();
            }

            detachedSquares.update(time, gravity);
            detachedSquares.forEach(square => {
                if (!grid.isFreeBellow(square)) {
                    grid.add(square);
                }
            });
            detachedSquares.filter(square => grid.isFree(square));

            if (grid.count() > 0) {
                console.log(grid.count());
            }
        };

        switch (action) {
            case RESTART:
                this.block.reset();
                this.queue.reset();
                this.grid.reset();
                this.detachedSquares.reset();
                break;

            case INIT_QUEUE:
                payload.forEach(this.queue.enqueue.bind(this.queue));
                resetBlock();
                break;

            case REFILL_QUEUE:
                this.queue.enqueue(payload);
                break;

            case ROTATE_LEFT:
                /*
                for (let i = 0; i < 16; i++) {
                    this.detachedSquares.add(new Immutable.Map({
                        color: true,
                        column: i,
                        row: 0,
                        x: columnToX(i),
                        y: rowToY(0),
                        speed: 0
                    }));
                }
                */
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

    getDetachedSquares() {
        return this.detachedSquares.getData();
    }

    getGrid() {
        return this.grid.getData();
    }
}