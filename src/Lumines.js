import React from 'react'
import {Dispatcher} from 'flux'

import styles from './styles.less'

import debug from './misc/debug.js'
import State from './misc/State.js'
import GameInterface from './components/GameInterface.js'
import ScanLineStore from './stores/ScanLineStore.js'
import {UPDATE} from './misc/actions.js'

debug = debug('Game');

export default class Lumines {

    constructor(mountpoint) {
        this.mountpoint = mountpoint;
        this.state = new State();
        this.dispatcher = new Dispatcher();

        this.scanLineStore = new ScanLineStore(this.dispatcher, this.state);
    }

    start() {
        let time = performance.now();
        setInterval(() => {
            this.dispatch(UPDATE, {time: performance.now() - time});
            this.render();
            time = performance.now();
        }, 1000/60);
    }

    dispatch(action, payload) {
        this.dispatcher.dispatch({action, payload})
    }

    render() {
        React.render(<GameInterface
            scanLine={this.scanLineStore.scanLine} />, this.mountpoint);
    }
}