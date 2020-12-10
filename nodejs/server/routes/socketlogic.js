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

    // whoAmI - returns user information and statistics
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

    // ********************************************************************** //
    // ***** ACCOUNT PAGE *************************************************** //
    // ********************************************************************** //

    // createGame - creates a new Room object and returns the roomCode
    socket.on('createGame', () => {
        console.log("createGame: " + socket.request.user.username);
        let user = socket.request.user;
        let room = new Room(user._id);                              // create new Room
        room.playerManager.addPlayer(user);                         // add self to Room's playerlist
        room.playerManager.getPlayer(user._id).roomCreator = true;
        roomCollection.push(room);                                  // push room to DB (temporary array)
        socket.emit('roomCode', room.roomCode);                     // send roomCode to user
    });

    // joinGame - join room using gameCode
    socket.on('joinGame', (code) => {
        console.log("joinGame: " + code);
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        if (room) {
            if (room.gameManager.gameActive === false) {
                // accept join room request
                room.playerManager.addPlayer(socket.request.user);                  // add self to Room's playerlist
                socket.emit('roomCode', room.roomCode);                             // send roomCode to user
                io.to(room.roomCode).emit('playerListUpdate', room.userlist);       // notify subscribers
            } else {
                // unable to join because game is in progress
                socket.emit('accountErrorMessage', 'game is in progress');
            }
        } else {
            // unable to find room
            socket.emit('accountErrorMessage', 'unable to join room');
        }
    });

    // ********************************************************************** //
    // ***** ROOM PAGE ****************************************************** //
    // ********************************************************************** //

    // ***** PLAYERLIST COMPONENT ******************************************* //

    // initialize playerlist component when user enters room
    socket.on('playerListInit', (gameCode) => {
        console.log("playerListInit: " + gameCode + ":" + socket.request.user.username);
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        socket.join(room.roomCode);
        sendPlayerList(room);
    });

    // toggle player's game ready state
    socket.on('playerListReady', (gameCode) => {
        console.log("playerListReady: " + gameCode + ":" + socket.request.user.username);
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let toggle = room.playerManager.getPlayer(socket.request.user._id).gameReady
        room.playerManager.getPlayer(socket.request.user._id).gameReady = !toggle;
        sendPlayerList(room);
    });

    // room's creator starts game
    socket.on('playerListStart', (gameCode) => {
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        if (player.roomCreator && room.playerManager.playersReady()) {
            player.gameReady = true;
            room.gameManager.nextGameState();
            sendGameUpdate(room);
        }
        sendPlayerList(room);
    })

    // standardized playerlist-component reply
    function sendPlayerList(room) {
        console.log("sendPlayerList: " + room.gameManager.state + ":");
        console.log(JSON.stringify(room.playerManager.playerList, null, 1));    // DEBUG PRINTING
        io.in(room.roomCode).emit('playerListUpdate', {
            gameState: room.gameManager.state,
            playerList: room.playerManager.playerList,
        });
    }


    // ***** CHAT COMPONENT ************************************************* //

    // initialize chat component when user enters room
    socket.on('chatComponentInit', (code) => {
        console.log("chatComponentInit");
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        socket.join(room.roomCode);
        sendChatComponent(room);
    });

    // player sends new message
    socket.on('newMessage', (code, data) => {
        console.log("newMessage");
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        room.chatManager.newMessage(player, data);
        sendChatComponent(room);
    });

    // standardized chat-component reply
    function sendChatComponent(room) {
        io.in(room.roomCode).emit('messageUpdate', {
            messageList: room.chatManager.messageList,
            playerList: room.playerManager.playerList
        });
    }


    // ***** GAME COMPONENT ************************************************* //

    // initialize game component when user enters room
    socket.on('gameInit', (gameCode) => {
        console.log("gameInit: " + socket.request.user.username + ":" + gameCode);
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        socket.join(room.roomCode);
        sendGameUpdate(room);
    });

    // captain picks players for the quest, STATE = GAME_STATE_TEAMBUILD
    socket.on('pick', (gameCode, pick_id) => {
        console.log("pick.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);

        if (player.is_captain && room.gameManager.getState() === GAME_STATE_TEAMBUILD) {
            console.log("captain picked:" + pick_id);
            let picksLeft = room.gameManager.addPlayerToTeam(pick_id);

            console.log("picks left: " + picksLeft);
            if (picksLeft == 0) {
                room.gameManager.nextGameState();
            }
            sendPlayerList(room);
            sendGameUpdate(room);
        } else {
            //send error
        }
    });

    // players approves the quest, STATE = GAME_STATE_TEAMVOTE
    socket.on('approve', (gameCode) => {
        console.log("approve");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        if (room.gameManager.getState() === GAME_STATE_TEAMVOTE) {
            let allVoted = room.gameManager.voteForTeam(player, true);
            if (allVoted) {
                room.gameManager.nextGameState();
            }
            sendPlayerList(room);
            sendGameUpdate(room);
        }
    });

    // players rejects the quest, STATE = GAME_STATE_TEAMVOTE
    socket.on('reject', (gameCode) => {
        console.log("reject");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        if (room.gameManager.getState() === GAME_STATE_TEAMVOTE) {
            let allVoted = room.gameManager.voteForTeam(player, false);
            if (allVoted) {
                room.gameManager.nextGameState();
            }
            sendPlayerList(room);
            sendGameUpdate(room);
        }
    });

    // quest member succeeds the quest
    socket.on('success', (gameCode) => {
        console.log("success.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        if (room.gameManager.getState() === GAME_STATE_QUEST) {
            let allVoted = room.gameManager.voteForQuest(player, true);
            if (allVoted) {
                room.gameManager.nextGameState();
            }
            sendPlayerList(room);
            sendGameUpdate(room);
        }
    });

    // quest member fails the quest
    socket.on('fail', (gameCode) => {
        console.log("fail.");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        let player = room.playerManager.getPlayer(socket.request.user._id);
        if (room.gameManager.getState() === GAME_STATE_QUEST) {
            let allVoted = room.gameManager.voteForQuest(player, false);
            if (allVoted) {
                room.gameManager.nextGameState();
            }
            sendPlayerList(room);
            sendGameUpdate(room);
        }
    });

    // standardized game-component reply
    function sendGameUpdate(room) {
        console.log("sendGame: " + room.gameManager.state);
        io.in(room.roomCode).emit('gameUpdate', {
            gameState: room.gameManager.state,
            playerList: room.playerManager.playerList,
            // gameHistory: room.gameManager.?            // Not implemented yet
        });
    }

};


