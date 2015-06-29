import {List} from 'immutable'

import {range} from '../misc/jshelpers.js'
import {GRID_ROWS, GRID_COLUMNS, SQUARE_SIZE} from '../game/dimensions.js'
import ImmutableDao from './ImmutableDao.js'

export default class DetachedSquares extends ImmutableDao {

    reset() {
        this.cursor(() => new List());
    }

    add(square) {
        this.cursor(squares => squares.push(square));
    }

    update(time, gravity) {
        this.cursor(squares => squares.map(square => {
            // y shouldn't be change by more than SQUARE_SIZE to avoid square skipping
            square.y += Math.min(square.speed * time, SQUARE_SIZE);
            square.speed += gravity * time;
            return square;
        }));

    }

    forEach(cb) {
        this.cursor()
            .sort((a, b) => a.y > b.y ? -1 : b.y > a.y ? 1 : 0)
            .forEach(cb)
    }

    filter(cb) {
        this.cursor(squares => squares.filter(cb));
    }
}