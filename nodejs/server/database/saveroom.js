
// import modules for deserialization
const Room = require('../models/Room');
const PlayerManager = require('../models/PlayerManager');
const ChatManager = require('../models/ChatManager');
const GameManager = require('../gameboard/GameManager');
const Game = require('../gameboard/Game');
const Quest = require('../gameboard/Quest');
const Player = require('../models/Player');

// run autosave - run updateDatabase every AUTO_SAVE_INTERVAL seconds
exports.autosave = function autosave(socketdata, dbs) {
    if (process.env.AUTO_SAVE_ENABLED) {
        autoSaveConsoleMessage();
        // autosave every AUTO_SAVE_INTERVAL seconds
        setInterval(function () {
            localLog("autosave");
            updateDatabase(socketdata(), dbs)
        }, process.env.AUTO_SAVE_INTERVAL);
    }
}

function autoSaveConsoleMessage(){
    localLog("============================================================");
    localLog("             STARTING AUTOSAVE FUNCTIONALITY                ");
    localLog(" program will save roomCollection every " + process.env.AUTO_SAVE_INTERVAL + " ms");
    localLog(" change functionality in ./server/globalvar.env:            ");
    localLog(" AUTO_SAVE_ENABLED: enable/disable autosave                 ");
    localLog(" AUTO_SAVE_LOGGING: enable/disable logging                  ");
    localLog("============================================================");
}

/**
 * Read the stored room collection from database and set roomCollection.
 * The object from the database will have to be deserialized.
 */
exports.readsave = function readsave(dataSet, dbs) {
    if (process.env.AUTO_SAVE_ENABLED) {
        localLog("Loading games from database");
        // find room collection with current date
        dbs.findOne({ date: getDateNoTime() }, function (err, result) {
            if (err) {
                // mongo error
                localLog("Unable to load rooms from database:" + err);
            }
            if (result !== null) {
                dataSet(deserializeObjectToArray(result));
            } else {
                localLog("no rooms in database");
            }
        });
    }
}

/**
 * Function that deserializes the roomCollection object from the database and
 * deserializes the entire collection recursively.
 *  
 * Future TODO: deserialization should probably be stored in their individual 
 * classes. It probably shouldn't be stored as one entire object in the database
 * in the first place. Sorry for the bad-deadline-induced code practices.
 */
function deserializeObjectToArray(data) {
    let setArray = [];
    // deserialize each generic object in the sokcetData array 
    for (let i = 0; i < data.socketData.length; i++) {
        let room = Object.assign(new Room, data.socketData[i]);
        room.playerManager = Object.assign(new PlayerManager, room.playerManager);
        for (let i = 0; i < room.playerManager.playerList.length; i++) {
            room.playerManager.playerList[i] = Object.assign(new Player, room.playerManager.playerList[i]);
        }
        room.chatManager = Object.assign(new ChatManager, room.chatManager);
        room.gameManager = Object.assign(new GameManager, room.gameManager);
        room.gameManager.playerManager = room.playerManager;
        room.gameManager.game = Object.assign(new Game, room.gameManager.game);
        room.gameManager.game.playerManager = room.playerManager;
        room.gameManager.game.current_quest = Object.assign(new Quest, room.gameManager.game.current_quest);

        for (let k = 0; k < room.gameManager.game.current_quest.quest_players.length; k++) {
            room.gameManager.game.current_quest.quest_players[k] = room.gameManager.playerManager.getPlayer(room.gameManager.game.current_quest.quest_players[k]._id);
        }

        for (let i = 0; i < room.gameManager.game.quests.length; i++) {
            room.gameManager.game.quests[i] = Object.assign(new Quest, room.gameManager.game.quests[i]);
            for (let k = 0; k < room.gameManager.game.quests[i].quest_players.length; k++) {
                room.gameManager.game.quests[i].quest_players[k] = room.gameManager.playerManager.getPlayer(room.gameManager.game.quests[i].quest_players[k]._id);
            }
        }
        setArray.push(room);
    }
    return setArray;
}

// push roomCollection to the database with current date 
function updateDatabase(socketdata, dbs) {
    if (socketdata.length > 0) {
        dbs.updateOne({ date: getDateNoTime() }, { $set: { socketData: socketdata } }, { upsert: true }, (err, doc) => {
            if (err) {
                localLog("autosaving not working" + err);
            } else {
                localLog("autosave");
            }
        });
    }
}

// helper function to get the current date without time
function getDateNoTime() {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

function localLog(data){
    if(process.env.AUTO_SAVE_LOGGING){
        console.log(data);
    }
}