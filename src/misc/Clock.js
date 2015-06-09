/** Measures elapsed time between individual next() calls */
export default class Clock
{
    constructor() {
        this.time = performance.now();
    }

    next(now) {
        now = now || performance.now();
        let elapsed = now - this.time;
        this.time = now;
        return elapsed;
    }
}