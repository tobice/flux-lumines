import {List} from 'immutable'

import {range} from '../misc/jshelpers.js'
import {isOutOfRange, xToColumn, yToRow, normalizeX, normalizeY, getBlockSquareColumn, getBlockSquareRow, areOfTheSameColor} from '../game/squareHelpers.js'
import {SQUARE_SIZE, GRID_ROWS, GRID_COLUMNS} from '../game/dimensions.js'
import ImmutableDao from './ImmutableDao.js'

/** Grid with attached squares */
export default class Grid extends ImmutableDao {

    reset() {
        // Generate empty grid.
        this.cursor(() => new List(
            range(GRID_COLUMNS).map(() => new List(range(GRID_ROWS).map(() => null)))
        ));
    }

    getIn({x, y}) {
        return this.cursor().getIn([xToColumn(x), yToRow(y)]);
    }

    add(square) {
        square.x = normalizeX(square.x);
        square.y = normalizeY(square.y);
        this.cursor(grid => grid.setIn([xToColumn(square.x), yToRow(square.y)], square));
    }

    isFree({x, y}) {
        return !isOutOfRange({x, y}) && this.getIn({x, y}) == null;
    }

    isFreeBellow({x, y}) {
        return this.isFree({x: x, y: y + SQUARE_SIZE});
    }

    /**
     * Update the grid and make sure that nothing but 4 square blocks of the same color are marked
     * as monoblocks.
     */
    updateMonoblocks() {
        this.cursor(grid => grid.withMutations(grid => {

            function getSquaresInBlock({x, y}) {
                let [column, row]  = [xToColumn(x), yToRow(y)];
                return range(4)
                    .map(i => grid.getIn([column + getBlockSquareColumn(i), row + getBlockSquareRow(i)]))
                    .filter(square => square);
            }

            function createMonoBlock(monoblock, squares) {
                squares.forEach(({x, y}) =>
                    grid.updateIn([xToColumn(x), yToRow(y)], square => {
                        square.monoblock = monoblock;
                        return square;
                    }));
            }

            function removeMonoBlock(monoblock, squares) {
                squares.forEach(({x, y}) =>
                    grid.updateIn([xToColumn(x), yToRow(y)], square => {
                        // Remove all squares from the monoblock.
                        // I can remove the monoblock pointer only when it points to this
                        // very monoblock. The square might be part of another monoblock
                        // in which case I should leave it.
                        if (square.monoblock
                            && square.monoblock.x == monoblock.x
                            && square.monoblock.y == monoblock.y) {
                            square.monoblock = null;
                            square.scanned = false;
                        }
                        return square;
                    }));
            }

            // This will go through the all squares on the grid, starting top left, going column
            // after column until it finishes bottom right
            grid.flatten().filter(square => square != null).forEach(square => {
                let monoblock = {x: square.x, y: square.y};
                let squares = getSquaresInBlock(monoblock);

                if (squares.length == 4 && areOfTheSameColor(squares)) {
                    createMonoBlock(monoblock, squares);
                } else {
                    removeMonoBlock(monoblock, squares);
                }
            });
        }));
    }

    /**
     * Mark all monoblocks in the column as scanned. Return list of scanned squares.
     * @param {int} column
     * @returns {Array}
     */
    scanColumn(column) {
        let scanned = [];
        this.cursor(grid => grid.updateIn([column], squares =>
            squares.map(square => {
                if (square && square.monoblock) {
                    square.scanned = true;
                    scanned.push(square);
                }
                return square;
            })
        ));

        return scanned;
    }

    /**
     * Locate and remove all scanned squares. Squares above scanned squares are also removed from
     * the grid (they are 'detached'). Lists of removed and detached squares are returned.
     * @returns {{removed: Array, detached: Array}}
     */
    removeScannedMonoblocks() {
        let removed = [], detached = [];

        this.cursor(grid => grid.withMutations(grid => {
            // Cycle column by column, from bottom up, to identify all squares that should be
            // removed or detached in a single run.
            grid.forEach((squares, column) =>
                squares.filter(square => square).reverse().forEach(square => {
                    let row = yToRow(square.y);

                    // Remove scanned
                    if (square.scanned) {
                        removed.push(square);
                        grid.setIn([column, row], null);
                    }
                    // Detach those that have nothing bellow (the square bellow was removed)
                    else if (grid.getIn([column, row + 1]) === null) {
                        detached.push(square);
                        grid.setIn([column, row], null);
                    }
                })
            );
        }));

        return {removed, detached};
    }

    count() {
        return this.cursor().flatten().filter(square => square != null).count();
    }

    isTopReached() {
        // Load second row and look for squares
        return this.cursor().map(squares => squares.get(1)).some(square => square != null);
    }
}