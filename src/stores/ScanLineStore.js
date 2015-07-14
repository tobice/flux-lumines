import {Map} from 'immutable';

import BaseStore from './BaseStore.js';
import dimensions from '../game/dimensions.js';
import {UPDATE, RESTART} from '../game/actions.js';
import {PLAYING} from '../game/gameStates.js';
import {xToColumn} from '../game/squareHelpers.js';

export default class ScanLineStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.cursor = state.cursor([ScanLineStore.name], {
            position: 0,
            enteredNewColumn: false,
            speed: 0
        });
    }

    handleAction({action, payload}) {
        let {configStore, gameStateStore} = this.stores;

        switch (action) {

            case RESTART:
                this.cursor(() => new Map({
                    position: 0,
                    enteredNewColumn: false,
                    speed: configStore.baseScanLineSpeed
                }));
                break;

            case UPDATE:
                if (gameStateStore.state !== PLAYING) {
                    return;
                }

                this.cursor(scanline => scanline.withMutations(scanline => {
                    let position = (this.position + payload.time * this.speed) % dimensions.GRID_WIDTH;
                    let enteredNewColumn = xToColumn(position) !== this.column;
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