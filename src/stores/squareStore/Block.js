import Immutable from 'immutable'

import {GRID_COLUMNS} from '../../misc/dimensions.js'
import {range} from '../../misc/jshelpers.js'
import {rowToY, yToRow, randomSquareColor} from '../../misc/squareHelpers.js'

export default class Block {
    constructor(cursor) {
        this.cursor = cursor;
    }

    getData() {
        return this.cursor();
    }

    reset(speed, squares) {
        this.cursor(() => Immutable.fromJS({
            column: GRID_COLUMNS / 2 - 1,
            y: rowToY(0),
            speed: speed || 0,
            squares: squares || [0, 0, 0, 0],
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

    move(column) {
        this.setProperty('column', column);
    }

    drop() {
        this.cursor(block => block.get('dropped') ? block : block
            .set('dropped', true)
            .update('y', y => rowToY(yToRow(y))) // reset the y position to current row
            .update('speed', speed => speed * 40));
    }

    update(time, gravity) {
        this.cursor(block => block
            .update('y', y => y + block.get('speed') * time)
            .update('speed', speed =>
                speed + gravity * time * block.get('dropped')));
    }

    get column() {
        return this.cursor().get('column');
    }

    set column(column) {
        this.move(column);
    }

    get y() {
        return this.cursor().get('y');
    }
}