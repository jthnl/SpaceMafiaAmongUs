module.exports = class ChatSession {
    constructor() {
        this.messageList = [];
    }


    newMessage(newMessage) {
        this.messageList.push(newMessage);
    }

}