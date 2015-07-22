import DefaultConfig from '../game/DefaultConfig.js';
import BaseStore from './BaseStore.js';

export default class ConfigStore extends BaseStore {

    constructor(dispatcher, state, stores, config) {
        super(dispatcher, stores);
        this.cursor = state.cursor(['ConfigStore'], new DefaultConfig(config));
    }

    handleAction() { }

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