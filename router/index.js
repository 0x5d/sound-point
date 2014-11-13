var RequestsHandler = require('./api');

module.exports = function(app, db){
    var reqHandler = new RequestsHandler(db);
    
    app.post('/register', reqHandler.register);
    app.post('/login', reqHandler.logIn);
    app.post('/newStation', reqHandler.createStation);
    app.post('/newSong', reqHandler.addSongToStation);
    app.post('/voteSong', reqHandler.voteSongUp);
    app.post('/invite', reqHandler.invite); 
    app.post('/removeUser', reqHandler.removeUser);
    app.get('/home/:userId', reqHandler.getStationsByUser);
    app.get('/station/:stationId', reqHandler.getStationById);
    app.get('/invitation/:userId/:loaded',reqHandler.pollInvitation);
    app.get('/pollStation/:stationId/:clientSongs', reqHandler.pollSongs);
    app.get('/station/removeSong/:stationId/:songId', reqHandler.removeSong);
    app.get('/removeStation/:stationId([0-9a-f]{24})/:userId', reqHandler.removeStation);
    app.get('/answer/:ans/:userId', reqHandler.answerInvitations);
    app.get('/friendRemoveStation/:userId/:stationId([0-9a-f]{24})', reqHandler.friendRemoveStation);
    app.get('/stationOwner/:stationId', reqHandler.stationOwner);
    app.post('/joinPublicStation', reqHandler.join);  
    app.get('/public/:userId', reqHandler.getPublicStationsByUser);
};



