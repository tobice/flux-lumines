import BaseStore from './BaseStore.js'
import dimensions from '../misc/dimensions.js'
import {UPDATE} from '../misc/actions.js'

export default class ScanLineStore extends BaseStore {

    constructor(dispatcher, state, configStore) {
        super(dispatcher);

        this.cursor = state.cursor([ScanLineStore.name], {
            position: 0,
            speed: configStore.baseScanLineSpeed
        });
    }

    handleAction({action, payload}) {
        switch (action) {
            case UPDATE:
                this.cursor(store => store.set('position',
                    (this.position + payload.time * this.speed) % dimensions.GRID_WIDTH
                ));
                break;
        }
    }

    get position() {
        return this.cursor().get('position');
    }

    get speed() {
        return this.cursor().get('speed');
    }

    get scanLine() {
        return this.cursor();
    }
}