import BaseStore from './BaseStore.js';
import {UPDATE, RESTART} from '../game/actions.js';
import {OVER} from '../game/gameStates.js';

export default class ScoreStore extends BaseStore {

    constructor(dispatcher, state, stores) {
        super(dispatcher, stores);

        this.cursor = state.cursor([ScoreStore.name], {
            score: 0,
            hudScore: 0,
            speed: 0
        });
    }

    handleAction({action, payload}) {
        const {configStore, squareStore, gameStateStore} = this.stores;

        // Private methods
        const setScore = (score) => this.cursor(store => store.set('score', score));
        const setSpeed = (speed) => this.cursor(store => store.set('speed', speed));
        const setHudScore = (score) => this.cursor(store => store.set('hudScore', score));

        const countScore = (squares) => squares.length * squares.length;

        switch (action) {
            case RESTART:
                setScore(0);
                setHudScore(0);
                setSpeed(0);
                break;

            case UPDATE:
                this.waitFor([squareStore]);
                if (squareStore.removedSquares.length > 0) {
                    setScore(this.score + countScore(squareStore.removedSquares));
                    setSpeed((this.score - this.hudScore) / configStore.hudScoreUpdateDuration);
                }

                // Increase the hud score until it catches up with the real score
                if (this.hudScore < this.score) {
                    setHudScore(Math.min(this.hudScore + payload.time * this.speed, this.score));
                }

                // Remember the high score
                if (gameStateStore.state === OVER) {
                    if (this.score > (Number(localStorage.highScore) || 0)) {
                        localStorage.highScore = this.score;
                    }
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

    get highScore() {
        return Math.max(Number(localStorage.highScore) || 0, this.hudScore);
    }
}
