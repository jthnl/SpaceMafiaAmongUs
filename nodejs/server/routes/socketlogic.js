/**
 * socketlogic.js
 * 
 * Manage Socket IO Functionality
 * 
 */

module.exports = function (io, socket) {


    // whoami
    socket.on('whoAmI', () => {
        data = {
            "username" : socket.request.user.username,
            "email" : socket.request.user.email,
            "name" : socket.request.user.name
        }
        socket.emit('whoAmI', data);
    });

    // when socket recieves "helloServer" from client, capitalize message and send it back to client
    socket.on('helloServer', (data) => {
        console.log(socket.request.user);
        console.log("user says: " + data);
        data = data.toUpperCase();
        socket.emit('helloClient', "You said: " + data);
    });

    // when socket recieves "helloServer" from client, capitalize message and send it back to client
    socket.on('bye', (data) => {
        console.log("user says: " + data);
        // TODO: remove user from active clients
    });
    // -- END OF SOCKET IO TESTS

};


