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
        let newRoom = new Room();
        socket.join(newRoom.roomCode);      // Join Socket IO Room
        roomCollection.push(newRoom);       // Push room to DB (temporary array)
        socket.emit('accountCreateGame', newRoom);
    });

    // ACCOUNT PAGE - join game
    socket.on('joinGame', (code) => {  
        console.log("joinGame" + code);
        let room = roomCollection.find( ({roomCode}) => roomCode === code);
        if(room){
            socket.join(room.roomCode);
            socket.emit('accountJoinGame', room);
            // notify that player joined
            // io.to.room(room.roomCode).emit();
        } else {
            // TODO: Error handling
        }
    });

    // ===== ROOM PAGE ====================================================== //


    




};


