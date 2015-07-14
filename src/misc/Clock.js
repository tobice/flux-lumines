/** Measures elapsed time between individual next() calls */
export default class Clock
{
    constructor() {
        this.time = performance.now();
    }

    next(customNow) {
        const now = customNow || performance.now();
        const elapsed = now - this.time;
        this.time = now;
        return elapsed;
    }
}