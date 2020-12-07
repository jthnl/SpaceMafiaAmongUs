/**
 * socketlogic.js
 * 
 * Manage Socket IO Functionality
 * 
 */

const Room = require('../models/Room');

let roomCollection = [];    // TODO: Save to database

module.exports = function (io, socket) {

    // ===== ACCOUNT PAGE =================================================== //

    // ACCOUNT PAGE - whoami
    socket.on('whoAmI', () => {
        data = {
            "username": socket.request.user.username,
            "email": socket.request.user.email,
            "name": socket.request.user.name
        }
        socket.emit('accountUserInfo', data);
        // TODO: get user statistics here
        socket.emit('accountUserStats', "not implemented yet");
    });

    // ACCOUNT PAGE - create game
    socket.on('createGame', () => {
        console.log("createGame");
        let newRoom = new Room();                       // Create new Room
        newRoom.addPlayer(socket.request.user);         // Add self to Player list in Room
        socket.join(newRoom.roomCode);                  // Join Socket IO Room
        roomCollection.push(newRoom);                   // Push room to DB (temporary array)
        socket.emit('roomCode', newRoom.roomCode);      // Send room to user
    });

    // ACCOUNT PAGE - join game
    socket.on('joinGame', (code) => {
        console.log("joinGame:" + code);
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        console.log(room);
        if (room) {
            room.addPlayer(socket.request.user);
            socket.join(room.roomCode);
            socket.emit('roomCode', room.roomCode);
            io.to(room.roomCode).emit('roomUpdate', room);
            io.to(room.roomCode).emit('playerListUpdate', room.playerList);
        } else {
            // TODO: Error handling
        }
    });

    // ===== ROOM PAGE ====================================================== //

    socket.on('roomSetup', (code) => {
        console.log("roomSetup");
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        console.log(room);
        if (room) {
            //room.addPlayer(socket.request.user);
            //socket.join(room.roomCode);
            socket.emit('roomUpdate', room);
            io.to(room.roomCode).emit('playerListUpdate', room.playerList);
            //io.to(room.roomCode).emit("roomUpdate", room);     // TODO: decompose Room to components for efficiency
        } else {
            // TODO: Error handling
        }
    });

    socket.on('roomPlayerList', (gameCode)=>{
        console.log("roomPlayerList CALLED");
        let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
        
        console.log("roomPlayerList CALLED2:" + room);
        socket.emit('playerListUpdate', room.playerList);
        // let room = roomCollection.find(({ roomCode }) => roomCode === socket.room);
        // socket.emit('playerListUpdate', room.playerList);
    })






};


