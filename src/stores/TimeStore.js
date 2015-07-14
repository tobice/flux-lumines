import {PLAYING} from '../game/gameStates.js';
import {UPDATE, RESTART} from '../game/actions.js';
import BaseStore from './BaseStore.js';

export default class TimeStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.cursor = state.cursor([TimeStore.name], {
            elapsed: 0
        });
    }

    handleAction({action, payload}) {
        const {gameStateStore} = this.stores;

        const setElapsed = (elapsed) =>
            this.cursor(store => store.set('elapsed', elapsed));

        switch (action) {
            case RESTART:
                setElapsed(0);
                break;

            case UPDATE:
                if (gameStateStore.state === PLAYING) {
                    setElapsed(this.elapsed + payload.time);
                }
                break;
        }
    }

    get elapsed() {
        return this.cursor().get('elapsed');
    }

    get elapsedFormat() {
        let date = new Date(this.elapsed * 1000);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, '$1');
    }

    get color() {
        let colors = ['blue', 'red', 'green', 'orange', 'yellow', 'teal'];
        // Change the color scheme every 60 seconds
        return colors[(Math.floor(this.elapsed / 60) % colors.length)];
    }
}