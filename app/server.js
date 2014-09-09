var config = require('./config.json'),
        http = require('http'),
	express = require('express'),
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
		app.listen(config.serverPort);
		console.log('Server listening on port ' + config.serverPort + '.');

		app.post('/newStation',
			function(req, res){
				console.log(req.body.newStation);
				res.status(200).send(req.body.newStation);
			}
		);
	}
);