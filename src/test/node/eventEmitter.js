const events = require("events");

function createEmitter(onOpen, onClose) {

    const emit = new events.EventEmitter();
    emit.once('open', onOpen); // Register for eventOne
    emit.once('close', onClose); // Register for eventOne
    return emit
}

function opened(emitter) {
    emitter.emit('open');
}
function closed(emitter) {
    emitter.emit('close');
}

let emitter = createEmitter(
    () => console.log("Opened!"), () => console.log("Closed!")
);
opened(emitter);
closed(emitter);

module.exports.createEmitter = createEmitter;
module.exports.opened = opened;
module.exports.closed = closed;