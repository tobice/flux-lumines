import {Map, List} from 'immutable'

import ImmutableDao from './ImmutableDao.js'
import {GRID_COLUMNS, SQUARE_SIZE} from '../game/dimensions.js'
import {range} from '../misc/jshelpers.js'
import {getBlockSquareX, getBlockSquareY, columnToX, rowToY, yToRow, randomSquareColor, normalizeY} from '../game/squareHelpers.js'

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
            .update('y', y => normalizeY(y))
            .update('speed', speed => speed * 40));
    }

    update(time, gravity) {
        this.cursor(block => block
            .update('y', y => this.nextY(time))
            .update('speed', speed =>
                speed + gravity * time * block.get('dropped')));
    }

    willEnterNewRow(time) {
        return yToRow(this.y) != yToRow(this.nextY(time));
    }

    nextY(time) {
        // y shouldn't change by more than SQUARE_SIZE to avoid square skipping
        return this.y + Math.min(this.speed * time, SQUARE_SIZE);
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

    get dropped() {
        return this.cursor().get('dropped');
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
            y: normalizeY(y) + getBlockSquareY(i),
            color: color,
            speed: this.speed / 3,
            scanned: false,
            monoblock: null
        }));
    }
}