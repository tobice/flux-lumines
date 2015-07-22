import {RESTART, UPDATE} from '../game/actions.js';
import {PLAYING} from '../game/gameStates.js';
import BaseStore from './BaseStore.js';

/** Current game gravity. Pretty much determines game speed. Increases over time */
export default class GravityStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.cursor = state.cursor(['GravityStore'], {
            gravity: 0
        });
    }

    handleAction({action, payload}) {
        const {configStore, gameStateStore} = this.stores;

        switch (action) {
            case RESTART:
                this.cursor(store => store.set('gravity', configStore.baseGravity));
                break;

            case UPDATE:
                if (gameStateStore.state === PLAYING) {
                    // The gravity will increase linearly by the base gravity every two minutes
                    // (i. e. after two minutes of playing the gravity will be twice as strong).
                    this.cursor(store => store.update('gravity', gravity =>
                        gravity + (payload.time * configStore.baseGravity) / 60 / 2));
                }
                break;
        }
    }

    get gravity() {
        return this.cursor().get('gravity');
    }
}