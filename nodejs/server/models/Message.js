module.exports = class Message {
    constructor(username, message) {
        this.username = username;
        this.message = message;
        this.timestame = Date.now();
    }
}