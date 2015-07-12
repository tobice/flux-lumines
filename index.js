import Lumines from './src/Lumines.js'

let config = {
    baseGravity: 120
};
const lumines = new Lumines(document.getElementById('lumines'), config);
lumines.start();

document.getElementById('stop').onclick = () => {
    lumines.stop();
};
document.getElementById('start').onclick = () => {
    lumines.start();
};
