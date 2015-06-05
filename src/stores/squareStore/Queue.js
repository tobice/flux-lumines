import {List} from 'immutable'

/** Queue of blocks */
export default class Queue {

    constructor(cursor) {
        this.cursor = cursor;
        this.cursor(() => new List());
    }

    getData() {
        return this.cursor();
    }

    enqueue(squares) {
        this.cursor(queue => queue.push(squares));
    }

    dequeue() {
        const squares = this.cursor().first();
        this.cursor(queue => queue.shift());
        return squares;
    }
}