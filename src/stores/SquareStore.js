import BaseStore from './BaseStore.js';
import {RESTART, UPDATE} from '../game/actions.js';
import {PLAYING} from '../game/gameStates.js';
import Grid from '../daos/Grid.js';
import DetachedSquares from '../daos/DetachedSquares.js';

export default class SquareStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.grid = new Grid(state.cursor(['SquareStore', 'grid'], {}));
        this.detachedSquares = new DetachedSquares(state.cursor(['SquareStore', 'detachedSquares'], {}));

        // To be temporary exposed during a cycle.
        this.removedSquares = [];
    }

    handleAction({action, payload}) {
        let {gameStateStore, gravityStore, scanLineStore, blockStore} = this.stores;

        const update = (time, gravity) => {
            this.waitFor([gravityStore, scanLineStore, blockStore]);
            const {grid, detachedSquares} = this;
            let dirty = false;
            this.removedSquares = [];

            // Update falling detached squares. Those that hit something, add to the grid.
            detachedSquares.update(time, gravity);
            detachedSquares.forEach(square => {
                if (!grid.isFreeBellow(square)) {
                    grid.add(square);
                    dirty = true;
                }
            });
            detachedSquares.filter(square => grid.isFree(square)); // remove those added to grid

            // Check the falling block. If it hit something and got decomposed, add to the grid
            if (blockStore.decomposedSquares.count() > 0) {
                blockStore.decomposedSquares.reverse().forEach(square =>
                    grid.isFreeBellow(square) ? detachedSquares.add(square) : grid.add(square)
                );
                dirty = true;
            }

            // If we entered a new column, mark the column as scanned
            if (scanLineStore.enteredNewColumn) {
                let scanned = grid.scanColumn(scanLineStore.column);

                // If no squares were scanned, we are no longer extending the area of scanned
                // monoblocks, and we should remove all that has been scanned until now.
                if (scanned.length === 0) {
                    let {removed, detached} = grid.removeScannedMonoblocks();
                    detached.forEach(square => detachedSquares.add(square));

                    if (removed.length > 0) {
                        dirty = true;
                        this.removedSquares = removed;
                    }
                }
            }

            // If any changes have been made to the grid, update the monoblocks
            if (dirty) {
                grid.updateMonoblocks();
            }
        };


        switch (action) {
            case RESTART:
                this.grid.reset();
                this.detachedSquares.reset();
                break;

            case UPDATE:
                if (gameStateStore.state === PLAYING) {
                    update(payload.time, gravityStore.gravity);
                }
                break;
        }
    }

    isFree({x, y}) {
        return this.grid.isFree({x, y});
    }

    isFreeBellow({x, y}) {
        return this.grid.isFreeBellow({x, y});
    }

    getDetachedSquares() {
        return this.detachedSquares.getData();
    }

    getGrid() {
        return this.grid.getData();
    }

    isGridTopReached() {
        return this.grid.isTopReached();
    }
}