let uuid = require('uuid');

module.exports = class Message {
    constructor(_id, message) {
        this._mid = uuid.v4();
        this._id = _id;
        this.message = message;
        this.timestamp = Date.now();
    }
}