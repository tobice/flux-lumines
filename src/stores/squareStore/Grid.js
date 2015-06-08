import {List} from 'immutable'

import {range} from '../../misc/jshelpers.js'
import {isOutOfRange, xToColumn, yToRow, normalizeX, normalizeY} from '../../misc/squareHelpers.js'
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

    count() {
        return this.cursor().flatten().filter(square => square != null).count();
    }
}