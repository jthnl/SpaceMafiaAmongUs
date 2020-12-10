/**
 * ChatManager manages a list of Message objects
 * Message Object - represents a single message
 */

const uuid = require('uuid');

module.exports = class ChatManager {

    constructor() {
        this.messageList = [];
    }    
    
    // creates a new message object with player object's _id.
    newMessage(player, message) {
        this.messageList.push(new Message(player._id, message));
    }
}

class Message {
    constructor(_id, message) {
        this._mid = uuid.v4();          // Message object's unique id
        this._id = _id;                 // sender's user id 
        this.message = message;         
        this.timestamp = Date.now();
    }
}