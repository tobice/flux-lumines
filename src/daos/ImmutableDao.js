export default class ImmutableDao {
    constructor(cursor) {
        this.cursor = cursor;
        this.reset();
    }

    reset() { }

    getData() {
        return this.cursor();
    }
}
