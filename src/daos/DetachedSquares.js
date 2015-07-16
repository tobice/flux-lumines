import {List} from 'immutable';

import {SQUARE_SIZE} from '../game/dimensions.js';
import ImmutableDao from './ImmutableDao.js';

export default class DetachedSquares extends ImmutableDao {

    reset() {
        this.cursor(() => new List());
    }

    add(square) {
        this.cursor(squares => squares.push(square));
    }

    update(time, gravity) {
        this.cursor(squares => squares.map(square =>
            square
                // y shouldn't be changed by more than SQUARE_SIZE to avoid square skipping
                .update('y', y => y + Math.min(square.get('speed') * time, SQUARE_SIZE))
                .update('speed', speed => speed + gravity * time)
        ));
    }

    forEach(cb) {
        this.cursor()
            .sort((a, b) => a.y > b.y ? -1 : b.y > a.y ? 1 : 0)
            .forEach(cb);
    }

    filter(cb) {
        this.cursor(squares => squares.filter(cb));
    }
}