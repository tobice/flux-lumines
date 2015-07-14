import {List} from 'immutable';
import ImmutableDao from './ImmutableDao.js';
import {SQUARE_SIZE} from '../game/dimensions.js';

const speed = 12 * SQUARE_SIZE;
const gap = SQUARE_SIZE / 2;

/** Get the y position of the i-th block in the queue */
function getY(i) {
   return i * (2 * SQUARE_SIZE + gap);
}

/** Queue of blocks */
export default class Queue extends ImmutableDao {

    reset() {
        this.cursor(() => new List());
    }

    enqueue(squares) {
        const y = getY(this.cursor().count());
        this.cursor(queue => queue.push({squares, y}));
    }

    dequeue() {
        const squares = this.cursor().first().squares;
        this.cursor(queue => queue.shift());
        return squares;
    }

    update(time) {
        // Animate the queue until each block reaches its target position
        this.cursor(queue => queue.map((block, i) => {
            const y = getY(i);
            if (block.y > y) {
                block.y = Math.max(y, block.y - time * speed);
            }
            return block;
        }));
    }
}