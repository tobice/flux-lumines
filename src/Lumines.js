import React from 'react'
import {Dispatcher} from 'flux'

import styles from './styles.less'

import debug from './misc/debug.js'
import State from './misc/State.js'
import GameInterface from './components/GameInterface.js'
import ConfigStore from './stores/ConfigStore.js'
import GravityStore from './stores/GravityStore.js'
import GameStateStore from './stores/GameStateStore.js'
import ScanLineStore from './stores/ScanLineStore.js'
import BlockStore from './stores/BlockStore.js'
import SquareStore from './stores/SquareStore.js'
import TimeStore from './stores/TimeStore.js'
import ScoreStore from './stores/ScoreStore.js'
import {range, measureTime} from './misc/jshelpers.js'
import {getRandomBlock} from './game/squareHelpers.js'
import Clock from './misc/Clock.js'
import NumberHistory from './misc/NumberHistory.js'

import {RESTART, PAUSE,UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP, INIT_QUEUE, REFILL_QUEUE} from './game/actions.js'
import {KEY_A, KEY_D, KEY_UP, KEY_LEFT, KEY_RIGHT, KEY_DOWN, KEY_ESC, KEY_R} from './game/consts.js'

export default class Lumines {

    constructor(mountpoint) {
        this.mountpoint = mountpoint;
        this.state = new State();
        this.dispatcher = new Dispatcher();
        this.stores = {};

        // TODO: load config from constructor
        let {dispatcher, state, stores} = this;

        stores.configStore = new ConfigStore(dispatcher, state, stores);
        stores.gameStateStore = new GameStateStore(dispatcher, state, stores);
        stores.timeStore = new TimeStore(dispatcher, state, stores);
        stores.gravityStore = new GravityStore(dispatcher, state, stores);
        stores.scanLineStore = new ScanLineStore(dispatcher, state, stores);
        stores.blockStore = new BlockStore(dispatcher, state, stores);
        stores.squareStore = new SquareStore(dispatcher, state, stores);
        stores.scoreStore = new ScoreStore(dispatcher, state, stores);

        this.fpsHistory = new NumberHistory(10);
        this.updateTimeHistory = new NumberHistory(10);
        this.renderTimeHistory = new NumberHistory(10);
        this.debug = debug('Game');
    }

    start() {
        // Listen to key strokes
        window.addEventListener('keydown', e => {
            switch(e.keyCode) {
                case KEY_A:
                    this.dispatch(ROTATE_LEFT);
                    break;

                case KEY_UP:
                case KEY_D:
                    this.dispatch(ROTATE_RIGHT);
                    break;

                case KEY_LEFT:
                    this.dispatch(MOVE_LEFT);
                    break;

                case KEY_RIGHT:
                    this.dispatch(MOVE_RIGHT);
                    break;

                case KEY_DOWN:
                    this.dispatch(DROP);
                    break;

                case KEY_ESC:
                    this.dispatch(PAUSE);
                    break;

                case KEY_R:
                    this.dispatch(RESTART);
                    break;
            }
        }, false);

        // Init game
        this.dispatch(INIT_QUEUE, range(5).map(getRandomBlock));

        // Main game loop
        const clock = new Clock();
        const update = (time) => {
            let elapsed = clock.next(time) / 1000;
            this.fpsHistory.add(1 / elapsed);

            this.updateTimeHistory.add(measureTime(() => {
                // To keep the flux cycle and the stores completely deterministic, we have to do any
                // random stuff (like generating new blocks in this case) outside.
                if (this.stores.blockStore.getQueue().count() < 4) {
                    this.dispatch(REFILL_QUEUE, getRandomBlock());
                }

                this.dispatch(UPDATE, {time: elapsed});
            }));

            this.renderTimeHistory.add(measureTime(() => this.render()));

            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    dispatch(action, payload) {
        if (action != UPDATE) {
            this.debug('Dispatched ' + action);
        }

        this.dispatcher.dispatch({action, payload})
    }

    render() {
        let {scanLineStore, gameStateStore, squareStore, blockStore, timeStore, scoreStore} = this.stores;
        let {fpsHistory, updateTimeHistory, renderTimeHistory} = this;

        React.render(<GameInterface
            scanLine={scanLineStore.scanLine}
            state={gameStateStore.state}
            block={blockStore.getBlock()}
            queue={blockStore.getQueue()}
            detachedSquares={squareStore.getDetachedSquares()}
            grid={squareStore.getGrid()}
            hud={{
                elapsed: timeStore.elapsedFormat,
                score: scoreStore.hudScore
            }}
            debug={{
                fps: fpsHistory.average(), fpsMin: fpsHistory.min(),
                update: updateTimeHistory.average(), updateMax: updateTimeHistory.max(),
                render: renderTimeHistory.average(), renderMax: renderTimeHistory.max()
            }} />, this.mountpoint);
    }
}