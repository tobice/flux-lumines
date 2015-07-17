import {List} from 'immutable';

import {range} from '../misc/jshelpers.js';
import {isOutOfRange, xToColumn, yToRow, normalizeX, normalizeY, getBlockSquareColumn, getBlockSquareRow, areOfTheSameColor} from '../game/squareHelpers.js';
import {SQUARE_SIZE, GRID_ROWS, GRID_COLUMNS} from '../game/dimensions.js';
import ImmutableDao from './ImmutableDao.js';
import Monoblock from '../game/Monoblock.js';

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
        const normalizedSquare = square
            .set('x', normalizeX(square.x))
            .set('y', normalizeY(square.y));
        this.cursor(grid => grid.setIn([
            xToColumn(normalizedSquare.x),
            yToRow(normalizedSquare.y)], normalizedSquare));
    }

    isFree({x, y}) {
        return !isOutOfRange({x, y}) && this.getIn({x, y}) === null;
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
                const [column, row] = [xToColumn(x), yToRow(y)];
                return range(4)
                    .map(i => grid.getIn([column + getBlockSquareColumn(i), row + getBlockSquareRow(i)]))
                    .filter(square => square);
            }

            function createMonoBlock(monoblock, squares) {
                squares.forEach(({x, y}) =>
                    grid.updateIn([xToColumn(x), yToRow(y)], square =>
                        square.set('monoblock', monoblock)));
            }

            function removeMonoBlock(monoblock, squares) {
                squares.forEach(({x, y}) =>
                    grid.updateIn([xToColumn(x), yToRow(y)], square =>
                        // Remove all squares from the monoblock.
                        // I can remove the monoblock pointer only when it points to this
                        // very monoblock. The square might be part of another monoblock
                        // in which case I should leave it.
                        square.monoblock && square.monoblock.equals(monoblock) ?
                            square.set('monoblock', null).set('scanned', false) : square
                    ));
            }

            // This will go through the all squares on the grid, starting top left, going column
            // after column until it finishes bottom right. Notice, that flatten() won't change
            // the grid even though we're inside withMutations(). Only limited set of operations
            // may be used mutatively.
            grid.flatten(1).filter(square => square !== null).forEach(square => {
                const monoblock = new Monoblock(square);
                const squares = getSquaresInBlock(monoblock);

                if (squares.length === 4 && areOfTheSameColor(squares)) {
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
        const scanned = [];
        const grid = this.cursor().update(grid => grid.updateIn([column], squares =>
            squares.map(square =>
                square && square.monoblock ?
                    scanned.push(square) && square.set('scanned', true) : square
            )
        ));

        // The Map#map() always returns a new reference even when no values changed. To avoid
        // redundant updates of the UI, we check for changes manually.
        if (scanned.length > 0) {
            this.cursor(() => grid);
        }

        return scanned;
    }

    /**
     * Locate and remove all scanned squares. Squares above scanned squares are also removed from
     * the grid (they are 'detached'). Lists of removed and detached squares are returned.
     * @returns {{removed: Array, detached: Array}}
     */
    removeScannedMonoblocks() {
        const removed = [], detached = [];

        // Cycle column by column, from the bottom up, to identify all squares that should be
        // removed or detached. We can do it in a single run.
        this.cursor().forEach((squares, column) =>
            squares.reverse().forEach(square => {
                if (!square) {
                    return;
                }

                const row = yToRow(square.y);
                if (square.scanned) {
                    // Remove scanned
                    removed.push(square);
                    this.cursor(grid => grid.setIn([column, row], null));
                } else if (this.cursor().getIn([column, row + 1]) === null) {
                    // Detach those that have nothing bellow (the square bellow was removed)
                    detached.push(square);
                    this.cursor(grid => grid.setIn([column, row], null));
                }
            })
        );

        return {removed, detached};
    }

    count() {
        return this.cursor().flatten(1).filter(square => square !== null).count();
    }

    isTopReached() {
        // Load second row and look for squares
        return this.cursor().map(squares => squares.get(1)).some(square => square !== null);
    }
}