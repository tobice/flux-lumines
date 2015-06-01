export default class BaseStore {

    constructor(dispatcher, actionSubscribe) {
        this._dispatchToken = dispatcher.register(actionSubscribe);
    }

    get dispatchToken() {
        return this._dispatchToken;
    }
}