import {range} from './jshelpers.js'

/** Simple structure for remembering last n values */
export default class NumberHistory
{
    constructor(length) {
        this.history = range(length).map(() => 0);
    }

    add(value) {
        this.history.push(parseFloat(value) || 0);
        this.history.shift();
    }

    average() {
        return this.history.reduce((sum, value) => sum + value, 0) / this.history.length;
    }

    max() {
        return this.history.reduce((max, value) => value > max ? value : max, 0);
    }

    min() {
        return this.history.reduce((min, value) => value < min ? value : min, this.history[0]);
    }
}