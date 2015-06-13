import BaseStore from './BaseStore.js'
import dimensions from '../game/dimensions.js'
import {UPDATE} from '../game/actions.js'
import {PLAYING} from '../game/gameStates.js'
import {xToColumn} from '../game/squareHelpers.js'

export default class ScanLineStore extends BaseStore {

    constructor(dispatcher, state, configStore, gameStateStore) {
        super(dispatcher, [gameStateStore]);
        this.gameStateStore = gameStateStore;

        this.cursor = state.cursor([ScanLineStore.name], {
            position: 0,
            enteredNewColumn: false,
            speed: configStore.baseScanLineSpeed
        });
    }

    handleAction({action, payload}) {
        if (this.gameStateStore.state != PLAYING) return;

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