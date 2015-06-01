import debug from 'debug'

debug.enable('lumines:*');

export default function (name) {
    return debug('lumines:' + name);
}