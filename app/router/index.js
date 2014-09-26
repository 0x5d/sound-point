var RequestsHandler = require('./requests');

module.exports = function(app, db){
    var reqHandler = new RequestsHandler(db);
    
    app.post('/login', reqHandler.logIn);
    app.post('/newStation', reqHandler.createStation);
    app.post('/newSong', reqHandler.addSongToStation);
    app.get('/home', reqHandler.getStationsByUser);
    app.get('/station/:stationId', reqHandler.getSongs);
};



