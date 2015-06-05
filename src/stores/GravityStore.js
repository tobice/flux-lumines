import Immutable from 'immutable'

import BaseStore from './BaseStore.js'

/** Current game gravity. Pretty much determines game speed. Increases over time */
export default class GravityStore extends BaseStore {

    constructor(dispatcher, state, configStore) {
        super(dispatcher);

        this.cursor = state.cursor([GravityStore.name], {
            gravity: configStore.baseGravity
        });
    }

    handleAction() {
        // TODO: increase over time
    }

    get gravity() {
        return this.cursor().get('gravity');
    }
}