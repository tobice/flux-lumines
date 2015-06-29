import {List} from 'immutable'
import ImmutableDao from './ImmutableDao.js'

/** Queue of blocks */
export default class Queue extends ImmutableDao {

    reset() {
        this.cursor(() => new List());
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