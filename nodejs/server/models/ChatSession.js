const uuid = require('uuid');

module.exports = class ChatSession {
    constructor() {
        this.messageList = [];
    }

    newMessage(_id, message) {
        this.messageList.push(new Message(_id, message));
    }
}

class Message {
    constructor(_id, message) {
        this._mid = uuid.v4();
        this._id = _id;
        this.message = message;
        this.timestamp = Date.now();
    }
}