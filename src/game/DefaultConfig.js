import {Record} from 'immutable'

export default Record({
    baseGravity: 150,
    baseBlockSpeed: 5, // to be adjusted by current gravity
    baseScanLineSpeed: 50,
    hudScoreUpdateDuration: 0.3
});