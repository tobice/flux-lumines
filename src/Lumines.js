import React from 'react'
import {Dispatcher} from 'flux'

import styles from './styles.less'

import debug from './misc/debug.js'
import State from './misc/State.js'
import GameInterface from './components/GameInterface.js'
import ConfigStore from './stores/ConfigStore.js'
import GravityStore from './stores/GravityStore.js'
import ScanLineStore from './stores/ScanLineStore.js'
import SquareStore from './stores/SquareStore.js'
import {range, measureTime} from './misc/jshelpers.js'
import {getRandomBlock} from './misc/squareHelpers.js'
import Clock from './misc/Clock.js'
import NumberHistory from './misc/NumberHistory.js'

import {RESTART, UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP, INIT_QUEUE, REFILL_QUEUE} from './misc/actions.js'
import {KEY_A, KEY_D, KEY_UP, KEY_LEFT, KEY_RIGHT, KEY_DOWN} from './misc/consts.js'

export default class Lumines {

    constructor(mountpoint) {
        this.mountpoint = mountpoint;
        this.state = new State();
        this.dispatcher = new Dispatcher();

        this.configStore = new ConfigStore(this.dispatcher, this.state);
        this.gravityStore = new GravityStore(this.dispatcher, this.state, this.configStore);
        this.scanLineStore = new ScanLineStore(this.dispatcher, this.state, this.configStore);
        this.squareStore = new SquareStore(this.dispatcher, this.state, this.configStore, this.gravityStore);

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
            }
        }, false);

        // Init game
        this.dispatch(RESTART);
        this.dispatch(INIT_QUEUE, range(5).map(getRandomBlock));

        // Main game loop
        const FPS = 15;
        const clock = new Clock();

        const update = (time) => {
            const elapsed = clock.next(time) / 1000;
            this.fpsHistory.add(1 / elapsed);

            this.updateTimeHistory.add(measureTime(() => {
                // To keep the flux cycle and the stores completely deterministic, we have to do any
                // random stuff (like generating new blocks in this case) outside.
                if (this.squareStore.getQueue().count() < 4) {
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
        React.render(<GameInterface
            scanLine={this.scanLineStore.scanLine}
            block={this.squareStore.getBlock()}
            queue={this.squareStore.getQueue()}
            detachedSquares={this.squareStore.getDetachedSquares()}
            grid={this.squareStore.getGrid()}
            debug={{
                fps: this.fpsHistory.average(), fpsMin: this.fpsHistory.min(),
                update: this.updateTimeHistory.average(), updateMax: this.updateTimeHistory.max(),
                render: this.renderTimeHistory.average(), renderMax: this.renderTimeHistory.max()
            }}  />, this.mountpoint);
    }
}