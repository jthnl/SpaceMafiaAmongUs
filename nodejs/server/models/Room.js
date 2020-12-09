const PlayerManager = require('./PlayerManager');
const ChatSession = require('../models/ChatSession');
const GameManager = require('../gameboard/GameManager');

module.exports = class Room {
    constructor(creatorID) {
        this.creatorID = creatorID;
        this.roomCode = Room.generateRoomCode();
        this.playerManager = new PlayerManager();
        this.gameManager = new GameManager(this.playerManager);
        this.chatSession = new ChatSession(this.playerManager);
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