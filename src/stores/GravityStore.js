import Immutable from 'immutable'

import {RESTART, UPDATE} from '../game/actions.js'
import BaseStore from './BaseStore.js'

/** Current game gravity. Pretty much determines game speed. Increases over time */
export default class GravityStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.cursor = state.cursor([GravityStore.name], {
            gravity: 0
        });
    }

    handleAction({action}) {
        let {configStore} = this.stores;

        switch (action) {
            case RESTART:
                this.cursor(store => store.set('gravity', configStore.baseGravity));
                break;

            case UPDATE:
                // TODO: increase over time
                break;
        }
    }

    get gravity() {
        return this.cursor().get('gravity');
    }
}