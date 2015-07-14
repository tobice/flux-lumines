import debug from '../misc/debug.js';

export default class BaseStore {

    constructor(dispatcher, stores) {
        this.dispatcher = dispatcher;
        this.stores = stores;
        this.debug = debug(this.constructor.name);

        this._dispatchToken = dispatcher.register(action => {
            if (!this.handleAction) {
                this.debug('No handleAction() method defined');
            } else {
                this.handleAction(action);
            }
        });
    }

    waitFor(stores) {
        this.dispatcher.waitFor(stores.map(store => store.dispatchToken));
    }

    get dispatchToken() {
        return this._dispatchToken;
    }
}