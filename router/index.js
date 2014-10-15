var RequestsHandler = require('./api');

module.exports = function(app, db){
    var reqHandler = new RequestsHandler(db);
    
    app.post('/register', reqHandler.register);
    app.post('/login', reqHandler.logIn);
    app.post('/newStation', reqHandler.createStation);
    app.post('/newSong', reqHandler.addSongToStation);
    app.post('/invite', reqHandler.invite);    
    app.get('/home/:userId', reqHandler.getStationsByUser);
    app.get('/station/:stationId', reqHandler.getStationById);
    app.get('/invitation/:userId/:loaded',reqHandler.pollInvitation);
    app.get('/pollStation/:stationId/:clientSongs', reqHandler.pollSongs);
    app.get('/station/removeSong/:stationId/:songId', reqHandler.removeSong);
    app.get('/removeStation/:stationId/:userId/:type', reqHandler.removeStation);
    app.get('/answer/:stationId/:ans/:userId', reqHandler.answerInvitations);
};



