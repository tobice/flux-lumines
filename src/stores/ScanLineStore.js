import BaseStore from './BaseStore.js'
import dimensions from '../misc/dimensions.js'
import {UPDATE} from '../misc/actions.js'
import {xToColumn} from '../misc/squareHelpers.js'

export default class ScanLineStore extends BaseStore {

    constructor(dispatcher, state, configStore) {
        super(dispatcher);

        this.cursor = state.cursor([ScanLineStore.name], {
            position: 0,
            enteredNewColumn: false,
            speed: configStore.baseScanLineSpeed
        });
    }

    handleAction({action, payload}) {
        switch (action) {
            case UPDATE:
                this.cursor(scanline => scanline.withMutations(scanline => {
                    let position = (this.position + payload.time * this.speed) % dimensions.GRID_WIDTH;
                    let enteredNewColumn = xToColumn(position) != this.column;
                    scanline.set('position', position).set('enteredNewColumn', enteredNewColumn);
                }));
                break;
        }
    }

    get position() {
        return this.cursor().get('position');
    }

    get column() {
        return xToColumn(this.position);
    }

    get enteredNewColumn() {
        return this.cursor().get('enteredNewColumn');
    }

    get speed() {
        return this.cursor().get('speed');
    }

    get scanLine() {
        return this.cursor();
    }
}