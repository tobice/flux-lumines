import Immutable from 'immutable'

import {WELCOME, OVER, PAUSED, PLAYING} from '../game/gameStates.js'
import {UPDATE, RESTART, PAUSE} from '../game/actions.js'
import BaseStore from './BaseStore.js'

/** Current game state */
export default class GameStateStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.cursor = state.cursor([GameStateStore.name], {
            state: WELCOME
        });
    }

    handleAction({action}) {

        const setState = (state) =>
            this.cursor(store => store.set('state', state));

        switch (action) {
            case UPDATE:
                break;

            case PAUSE:
                switch (this.state) {
                    case PLAYING: setState(PAUSED); break;
                    case PAUSED: setState(PLAYING); break;
                }
                break;

            case RESTART:
                setState(PLAYING);
                break;
        }
    }

    get state() {
        return this.cursor().get('state');
    }
}
