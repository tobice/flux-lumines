import {Map, List} from 'immutable'

import ImmutableDao from './ImmutableDao.js'
import {GRID_COLUMNS, SQUARE_SIZE} from '../game/dimensions.js'
import {range} from '../misc/jshelpers.js'
import {getBlockSquareX, getBlockSquareY, columnToX, rowToY, yToRow, randomSquareColor} from '../game/squareHelpers.js'

export default class Block extends ImmutableDao {

    reset(speed, squares) {
        this.cursor(() => new Map({
            x: columnToX(GRID_COLUMNS / 2 - 1),
            y: rowToY(0),
            speed: speed || 0,
            squares: new List(squares || [0, 0, 0, 0]),
            dropped: false
        }));
    }

    setProperty(property, value) {
        this.cursor(block => block.set(property, value));
    }

    rotate(shift) {
        this.cursor(block => block.update('squares', squares =>
            squares.map((_, i) => squares.get((i - shift) % 4))
        ));
    }

    move(x) {
        this.setProperty('x', x);
    }

    drop() {
        this.cursor(block => block.get('dropped') ? block : block
            .set('dropped', true)
            .update('y', y => rowToY(yToRow(y))) // reset the y position to current row
            .update('speed', speed => speed * 40));
    }

    update(time, gravity) {
        this.cursor(block => block
            // y shouldn't be change by more than SQUARE_SIZE to avoid square skipping
            .update('y', y => y + Math.min(block.get('speed') * time, SQUARE_SIZE))
            .update('speed', speed =>
                speed + gravity * time * block.get('dropped')));
    }

    get x() {
        return this.cursor().get('x');
    }

    get y() {
        return this.cursor().get('y');
    }

    get speed() {
        return this.cursor().get('speed');
    }

    getFieldsBellow() {
        return new List([
            {x: this.x, y: this.y + 2 * SQUARE_SIZE},
            {x: this.x + SQUARE_SIZE, y: this.y + 2 * SQUARE_SIZE}
        ]);
    }

    decomposeToSquares() {
        const {x, y} = this;
        return this.cursor().get('squares').map((color, i) => ({
            x: x + getBlockSquareX(i),
            y: y + getBlockSquareY(i),
            color: color,
            speed: this.speed / 3,
            scanned: false,
            monoblock: null
        }));
    }
}