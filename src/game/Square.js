import {Record} from 'immutable';
import {LIGHT} from './consts.js';

// noinspection Eslint
export default Record({
    x: 0,
    y: 0,
    color: LIGHT,
    speed: 0,
    scanned: false,
    monoblock: null
});
