var RequestsHandler = require('./requests');

module.exports = function(app, db){
    var reqHandler = new RequestsHandler(db);
    
    app.post('/login', reqHandler.logIn);
    app.get('/stations', reqHandler.getStations);
};



