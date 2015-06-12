import {List} from 'immutable'

import {range} from '../../misc/jshelpers.js'
import {isOutOfRange, xToColumn, yToRow, normalizeX, normalizeY, getBlockSquareColumn, getBlockSquareRow, areOfTheSameColor} from '../../misc/squareHelpers.js'
import {SQUARE_SIZE, GRID_ROWS, GRID_COLUMNS} from '../../misc/dimensions.js'
import ImmutableDao from './ImmutableDao.js'

/** Queue of blocks */
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

    updateMonoblocks() {
        this.cursor(grid => grid.withMutations(grid => {

            function getSquaresInBlock({x, y}) {
                let [column, row]  = [xToColumn(x), yToRow(y)];
                return range(4)
                    .map(i => grid.getIn([column + getBlockSquareColumn(i), row + getBlockSquareRow(i)]))
                    .filter(square => square);
            }

            function createMonoBlock(monoblock, squares) {
                console.log('Creating monoblock ' + monoblock.toString());
                squares.forEach(({x, y}) =>
                    grid.updateIn([xToColumn(x), yToRow(y)], square => {
                        square.monoblock = monoblock;
                        return square;
                    }));
            }

            function removeMonoBlock(monoblock, squares) {
                squares.forEach(({x, y}) =>
                    grid.updateIn([xToColumn(x), yToRow(y)], square => {
                        // I can remove the monoblock pointer only when it points to this
                        // very monoblock. The square might be part of another monoblock
                        // in which case I should leave it.
                        if (square.monoblock && square.monoblock.x == monoblock.x && square.monoblock.y == monoblock.y) {
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
                if (squares.length != 4) return;

                if (areOfTheSameColor(squares)) {
                    createMonoBlock(monoblock, squares);
                } else {
                    removeMonoBlock(monoblock, squares);
                }
            });
        }));
    }

    scanColumn(column) {
        let scanned = 0;
        this.cursor(grid => grid.updateIn([column], squares =>
            squares.map(square => {
                if (square && square.monoblock) {
                    square.scanned = true;
                    scanned++;
                }
                return square;
            })
        ));

        return scanned;
    }

    count() {
        return this.cursor().flatten().filter(square => square != null).count();
    }
}