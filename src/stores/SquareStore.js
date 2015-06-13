import Immutable from 'immutable'

import BaseStore from './BaseStore.js'
import {GRID_COLUMNS, SQUARE_SIZE, GRID_HEIGHT} from '../game/dimensions.js'
import {RESTART, INIT_QUEUE, REFILL_QUEUE, UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from '../game/actions.js'
import {PLAYING} from '../game/gameStates.js'
import {generateBlock, columnToX, rowToY, yToRow} from '../game/squareHelpers.js'
import Block from './squareStore/Block.js'
import Queue from './squareStore/Queue.js'
import Grid from './squareStore/Grid.js'
import DetachedSquares from './squareStore/DetachedSquares.js'


export default class SquareStore extends BaseStore {

    constructor(dispatcher, state, configStore, gameStateStore, gravityStore, scanLineStore) {
        super(dispatcher, [gameStateStore, gravityStore, scanLineStore]);
        this.configStore = configStore;
        this.gameStateStore = gameStateStore;
        this.gravityStore = gravityStore;
        this.scanLineStore = scanLineStore;

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
            const {block, grid, detachedSquares, scanLineStore} = this;
            let dirty = false;

            // Update falling detached squares. Those that hit something, add to the grid.
            detachedSquares.update(time, gravity);
            detachedSquares.forEach(square => {
                if (!grid.isFreeBellow(square)) {
                    grid.add(square);
                    dirty = true;
                }
            });
            detachedSquares.filter(square => grid.isFree(square)); // remove those added to grid

            // Update the falling block. If it hits something, add it to the grid
            block.update(time, gravity);
            if (!block.getFieldsBellow().every(field => grid.isFree(field))) {
                block.decomposeToSquares().reverse().forEach(square => {
                    grid.isFreeBellow(square) ? detachedSquares.add(square) : grid.add(square);
                });
                resetBlock();
                dirty = true;
            }

            // If we entered a new column, mark the column as scanned
            if (scanLineStore.enteredNewColumn) {
                let scanned = grid.scanColumn(scanLineStore.column);

                // If no squares were scanned, we are no longer extending the area of scanned
                // monoblocks, and we should remove all that has been scanned until now.
                if (scanned.length == 0) {
                    let {removed, detached} = grid.removeScannedMonoblocks();
                    detached.forEach(square => detachedSquares.add(square));

                    if (removed.length > 0) {
                        dirty = true;
                    }
                }
            }

            // If changes to grid have been made, update the monoblocks on the grid
            if (dirty) {
                grid.updateMonoblocks();
            }
        };

        if (this.gameStateStore.state != PLAYING &&
            [RESTART, INIT_QUEUE, REFILL_QUEUE].indexOf(action) == -1) return;

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