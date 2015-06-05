import debug from '../misc/debug.js'

export default class BaseStore {

    constructor(dispatcher, waitFor) {
        this.dispatcher = dispatcher;
        this.debug = debug(this.constructor.name);

        this._dispatchToken = dispatcher.register(action => {
            // Force the order in which the action is handled by individual stores
            if (waitFor && waitFor.length)  {
                dispatcher.waitFor(waitFor.map(store => store.dispatchToken));
            }

            if (!this.handleAction) {
                this.debug('No handleAction() method defined');
            } else {
                this.handleAction(action);
            }
        });
    }

    get dispatchToken() {
        return this._dispatchToken;
    }
}