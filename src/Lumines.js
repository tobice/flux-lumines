import React from 'react'
import {Dispatcher} from 'flux'

import styles from './styles.less'

import debug from './misc/debug.js'
import State from './misc/State.js'
import GameInterface from './components/GameInterface.js'
import ConfigStore from './stores/ConfigStore.js'
import GravityStore from './stores/GravityStore.js'
import ScanLineStore from './stores/ScanLineStore.js'
import BlockStore from './stores/BlockStore.js'
import {UPDATE, ROTATE_LEFT, ROTATE_RIGHT, MOVE_LEFT, MOVE_RIGHT, DROP} from './misc/actions.js'
import {KEY_A, KEY_D, KEY_UP, KEY_LEFT, KEY_RIGHT, KEY_DOWN} from './misc/consts.js'

export default class Lumines {

    constructor(mountpoint) {
        this.mountpoint = mountpoint;
        this.state = new State();
        this.dispatcher = new Dispatcher();

        this.configStore = new ConfigStore(this.dispatcher, this.state);
        this.gravityStore = new GravityStore(this.dispatcher, this.state, this.configStore);
        this.scanLineStore = new ScanLineStore(this.dispatcher, this.state, this.configStore);
        this.blockStore = new BlockStore(this.dispatcher, this.state, this.configStore, this.gravityStore);
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
                    this.dispatch(DROP)
                    break;
            }
            this.render();
        }, false);

        // Main game loop
        let time = performance.now();
        setInterval(() => {
            this.dispatch(UPDATE, {time: (performance.now() - time) / 1000});
            this.render();
            time = performance.now();
        }, 1000/60);
    }

    dispatch(action, payload) {
        if (action != UPDATE) {
            debug('Dispatcher')(action);
        }

        this.dispatcher.dispatch({action, payload})
    }

    render() {
        React.render(<GameInterface
            scanLine={this.scanLineStore.scanLine}
            block={this.blockStore.block} />, this.mountpoint);
    }
}