const Message = require('./Message');

module.exports = class ChatSession {
    constructor() {
        this.messageList = [];
    }


    newMessage(_id, message) {
        this.messageList.push(new Message(_id, message));
    }

}