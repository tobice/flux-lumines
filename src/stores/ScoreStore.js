import BaseStore from './BaseStore.js'
import {UPDATE, RESTART} from '../game/actions.js'

export default class ScoreStore extends BaseStore {

    constructor(dispatcher, state, configStore, squareStore) {
        super(dispatcher, [squareStore]);
        this.squareStore = squareStore;
        this.configStore = configStore;

        this.cursor = state.cursor([ScoreStore.name], {
            score: 0,
            hudScore: 0,
            speed: 0
        });
    }

    handleAction({action, payload}) {

        // Private methods

        const setScore = (score) => this.cursor(store => store.set('score', score));
        const setSpeed = (speed) => this.cursor(store => store.set('speed', speed));
        const setHudScore = (score) => this.cursor(store => store.set('hudScore', score));

        const countScore = (squares) => squares.length * squares.length;

        switch (action) {
            case RESTART:
                setScore(0);
                setHudScore(0);
                break;
            case UPDATE:
                if (this.squareStore.removedSquares.length > 0) {
                    setScore(this.score + countScore(this.squareStore.removedSquares));
                    setSpeed((this.score - this.hudScore) / this.configStore.hudScoreUpdateDuration);
                }

                // Increase the hud score until it catches up with the real score
                if (this.hudScore < this.score) {
                    setHudScore(Math.min(this.hudScore + payload.time * this.speed, this.score));
                }
                break;
        }
    }

    get score() {
        return this.cursor().get('score');
    }

    get speed() {
        return this.cursor().get('speed');
    }

    get hudScore() {
        return Math.round(this.cursor().get('hudScore'));
    }
}
