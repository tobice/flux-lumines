import {GRID_COLUMNS, GRID_ROWS, GRID_WIDTH, GRID_HEIGHT, SQUARE_SIZE} from './dimensions.js'
import {LIGHT, DARK} from './consts.js'
import {range} from './jshelpers.js'

export function getBlockSquareX(i) {
    // The squares go in the clockwise direction (it simplifies rotation).
    return columnToX(i < 2 ? (i % 2) : 1 - (i % 2));
}

export function getBlockSquareY(i) {
    return rowToY(Math.floor(i / 2));
}

export function getRandomSquareColor() {
    return Math.random() > 0.5 ? LIGHT : DARK;
}

export function getRandomBlock() {
    return range(4).map(getRandomSquareColor);
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

export function normalizeX(x)  {
    return columnToX(xToColumn(x));
}

export function normalizeY(y) {
    return rowToY(yToRow(y));
}

export function isOutOfRange({x, y}) {
    return !(
        0 <= x && x < GRID_WIDTH &&
        0 <= y && y < GRID_HEIGHT);
}