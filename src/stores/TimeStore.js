import Immutable from 'immutable'

import {PLAYING} from '../game/gameStates.js'
import {UPDATE, RESTART} from '../game/actions.js'
import BaseStore from './BaseStore.js'

export default class TimeStore extends BaseStore {

    constructor(dispatcher, state, gameStateStore) {
        super(dispatcher, [gameStateStore]);
        this.gameStateStore = gameStateStore;

        this.cursor = state.cursor([TimeStore.name], {
            elapsed: 0
        });
    }

    handleAction({action, payload}) {

        const setElapsed = (elapsed) =>
            this.cursor(store => store.set('elapsed', elapsed));

        switch (action) {
            case UPDATE:
                if (this.gameStateStore.state == PLAYING) {
                    setElapsed(this.elapsed + payload.time);
                }
                break;

            case RESTART:
                setElapsed(0);
                break;
        }
    }

    get elapsed() {
        return this.cursor().get('elapsed');
    }

    get elapsedFormat() {
        let date = new Date(this.elapsed * 1000);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    }
}