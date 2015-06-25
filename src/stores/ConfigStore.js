import Immutable from 'immutable'

import DefaultConfig from '../game/DefaultConfig.js'
import BaseStore from './BaseStore.js'

export default class ConfigStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);
        this.cursor = state.cursor([ConfigStore.name], new DefaultConfig({}));
    }

    handleAction() {  }

    get baseBlockSpeed() {
        return this.cursor().get('baseBlockSpeed');
    }

    get baseScanLineSpeed() {
        return this.cursor().get('baseScanLineSpeed');
    }

    get baseGravity() {
        return this.cursor().get('baseGravity');
    }

    get hudScoreUpdateDuration() {
        return this.cursor().get('hudScoreUpdateDuration');
    }
}