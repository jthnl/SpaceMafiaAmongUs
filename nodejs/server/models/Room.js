const ChatSession = require('../models/ChatSession');
const Game = require('../models/Game');

module.exports = class Room {
    constructor() {
        this.roomCode = Room.generateRoomCode();
        this.chatSession = new ChatSession();
        this.game = new Game();
    }


    static generateRoomCode() {
        let roomCode = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 4; i++) {
            roomCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return roomCode;
    }

}