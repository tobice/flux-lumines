import {GRID_COLUMNS, SQUARE_SIZE} from './dimensions.js'
import {LIGHT, DARK} from './consts.js'
import {range} from './jshelpers.js'

export function generateBlock() {
    return {
        column: GRID_COLUMNS / 2 - 1,
        y: rowToY(0),
        speed: 0,
        squares: range(4).map(randomSquareColor),
        dropped: false
    };
}

export function blockSquareColumn(i) {
    // The squares go in the clockwise direction (it simplifies rotation).
    return i < 2 ? (i % 2) : 1 - (i % 2);
}

export function blockSquareRow(i) {
    return Math.floor(i / 2);
}

export function randomSquareColor() {
    return Math.random() > 0.5 ? LIGHT : DARK;
}

export function columnToX(column) {
    return column * SQUARE_SIZE;
}

export function rowToY(row) {
    return row * SQUARE_SIZE;
}

export function xToColumn(x) {
    return Math.floor(x / SQUARE_SIZE);
}

export function yToRow(y) {
    return Math.floor(y / SQUARE_SIZE);
}