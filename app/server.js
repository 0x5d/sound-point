var config = require('./config.json'),
    router = require('./router'),
    http = require('http'),
    express = require('express'),
    session = require('express-session');
    bodyParser = require('body-parser'),
    mongoClient = require('mongodb').MongoClient,
    app = express();

mongoClient.connect(config.serverAddress,
    function(err, db){
        if(err){
                throw err;
        }
        console.log('DB up.');
        http.createServer(app);
        app.use(express.static(__dirname + '/' + config.staticContentFolder));
        app.use(bodyParser.json());
        app.use(session({secret: 'soundpoint'}));
        router(app, db);
        app.listen(config.serverPort);
        console.log('Server listening on port ' + config.serverPort + '.');
    }
);