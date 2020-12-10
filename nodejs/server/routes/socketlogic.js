/**
 * socketlogic.js
 * 
 * Manage Socket IO Functionality
 * 
 */

const Room = require('../models/Room');

const GAME_STATE_PENDING = 0;
const GAME_STATE_TEAMBUILD = 1;
const GAME_STATE_TEAMVOTE = 2;
const GAME_STATE_QUEST = 3;
const GAME_STATE_END = 4;

let roomCollection = [];    // TODO: Save to database for persistence

module.exports = function (io, socket) {

    /**
     * whoAmI - returns user information and statistics
     */
    socket.on('whoAmI', () => {
        data = {
            "_id": socket.request.user._id,
            "username": socket.request.user.username,
            "email": socket.request.user.email,
            "name": socket.request.user.name
        }
        stats = {
            "gamesplayed": socket.request.user.gamesplayed,
            "wins": socket.request.user.wins,
            "losses": socket.request.user.wins
        }
        socket.emit('accountUserInfo', data);
        socket.emit('accountUserStats', stats);
    });

    // ===== ACCOUNT PAGE =================================================== //

    // ACCOUNT PAGE - create room
    socket.on('createGame', () => {
        console.log("createGame");
        let user = socket.request.user;
        let room = new Room(user._id);                              // Create new Room
        room.playerManager.addPlayer(user);                         // Add self to userlist in Room
        room.playerManager.getPlayer(user._id).roomCreator = true;
        roomCollection.push(room);                                  // Push room to DB (temporary array)
        socket.emit('roomCode', room.roomCode);                     // Send roomCode to user
    });

    // ACCOUNT PAGE - join room
    socket.on('joinGame', (code) => {
        console.log("joinGame:" + code);
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        if (room) {
            room.playerManager.addPlayer(socket.request.user);                  // Add self to userlist in Room
            socket.emit('roomCode', room.roomCode);                             // Send roomCode to user
            io.to(room.roomCode).emit('playerListUpdate', room.userlist);       // notify subscribers
        } else {
            // TODO: Error handling
        }
    });

    // ===== ROOM PAGE ====================================================== //

    // ===== USERLIST PAGE ================================================== //

    // GAME_STATE_PENDING 
    socket.on('playerListInit', (gameCode) => {
        console.log("playerListInit: " + socket.request.user.username + ":" + gameCode);
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        socket.join(room.roomCode);
        sendPlayerList(room, socket.request.user);
    });

    socket.on('playerListReady', (gameCode) => {
        console.log("playerListReady: " + socket.request.user.username + ":" + gameCode);
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let toggle = room.playerManager.getPlayer(socket.request.user._id).gameReady
        room.playerManager.getPlayer(socket.request.user._id).gameReady = !toggle;
        sendPlayerList(room, socket.request.user);
    });

    socket.on('playerListStart', (gameCode) => {
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let toggle = room.playerManager.getPlayer(socket.request.user._id).gameReady
        room.playerManager.getPlayer(socket.request.user._id).gameReady = !toggle;
        room.gameManager.nextGameState();
        sendPlayerList(room, socket.request.user);
    })

    // STANDARD REPLIES
    function sendPlayerList(room, user) {
        console.log("sendPlayerList: " + room.gameManager.state + ":" + JSON.stringify(room.playerManager.playerList, null, 1));
        io.in(room.roomCode).emit('playerListUpdate', {
            gameState: room.gameManager.state,
            playerList: room.playerManager.playerList,
        });
    }


    // ===== CHAT COMPONENT ================================================= //

    // NOTE CHECK ROOM ORDER WHEN INIT ******* ** ** ** *****

    socket.on('newMessage', (code, data) => {

        console.log("newMessage");
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        if (room) {
            room.chatManager.newMessage(player, data);
            io.to(room.roomCode).emit('updateMessage', {
                messageList: room.chatManager.messageList,
                playerList: room.playerManager.playerList
            });
            socket.emit('updateMessage', {
                messageList: room.chatManager.messageList,
                playerList: room.playerManager.playerList
            });
        } else {
            // TODO: Error Handling
        }
    });


    socket.on('roomMessageList', (code) => {
        console.log("roomMessageList");
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        if (room) {
            socket.emit('updateMessage', {
                messageList: room.chatManager.messageList,
                playerList: room.playerManager.playerList
            });
        } else {
            // TODO: Error Handling
        }
    });

    // ===== GAME COMPONENT ================================================= //

    // GAME_STATE_PENDING 
    socket.on('gameInit', (gameCode) => {
        console.log("gameInit: " + socket.request.user.username + ":" + gameCode);
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        socket.join(room.roomCode);
        sendGameUpdate(room, socket.request.user);
    });

    socket.on('pick', (gameCode, pick_id) => {
        console.log("pick.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);

        if (player.is_captain) {
            console.log("captain picked:" + pick_id);
            let picksLeft = room.gameManager.game.add_player_to_team(pick_id);
            console.log("picks left: " + picksLeft);
            if (picksLeft == 0) {
                console.log("pick - next state");
                room.gameManager.nextGameState();
            }
            sendPlayerList(room, socket.request.user);
            sendGameUpdate(room, socket.request.user);
        } else {
            //send error
        }
    });

    socket.on('approve', (gameCode) => {
        console.log("approve.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        let allVoted = room.gameManager.game.vote_for_team(player, true);
        if (allVoted) {
            room.gameManager.nextGameState();
        }
        sendPlayerList(room, socket.request.user);
        sendGameUpdate(room, socket.request.user);
    });

    socket.on('reject', (gameCode) => {
        console.log("reject.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        let allVoted = room.gameManager.game.vote_for_team(player, false);
        if (allVoted) {
            room.gameManager.nextGameState();
        }
        sendPlayerList(room, socket.request.user);
        sendGameUpdate(room, socket.request.user);
    });

    socket.on('success', (gameCode) => {
        console.log("success.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        let allVoted = room.gameManager.game.current_quest.vote_for_quest(player, true);
        if (allVoted) {
            room.gameManager.nextGameState();
        }
        sendPlayerList(room, socket.request.user);
        sendGameUpdate(room, socket.request.user);
    });

    socket.on('fail', (gameCode) => {
        console.log("fail.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        let allVoted = room.gameManager.game.current_quest.vote_for_quest(player, false);
        if (allVoted) {
            room.gameManager.nextGameState();
        }
        sendPlayerList(room, socket.request.user);
        sendGameUpdate(room, socket.request.user);
    });

    // STANDARD REPLIES
    function sendGameUpdate(room, user) {
        console.log("sendGame: " + room.gameManager.state);
        io.in(room.roomCode).emit('gameUpdate', {
            gameState: room.gameManager.state,
            playerList: room.playerManager.playerList,
            // gameHistory: room.gameManager.?            // Not implemented yet
        });
    }

};

