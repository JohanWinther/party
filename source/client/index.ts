import Communicator from './communication';

console.log("Screen client");

const com = new Communicator(3000);

com.addEventListener('ui_state', (e: CustomEvent) => {
    console.log(e.detail.state);
    if (e.detail.state === 10) {
        location.href = '/g';
    }
});