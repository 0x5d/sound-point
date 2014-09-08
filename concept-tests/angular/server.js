var http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	mongoClient = require('mongodb').MongoClient,
	app = express();

mongoClient.connect('mongodb://localhost:27017/angular',
	function(err, db){
		if(err){
			throw err;
		}
		console.log('DB up');
		http.createServer(app);
		app.use(express.static(__dirname + '/public'));
		app.use(bodyParser.json()); 
		app.listen(8888);
		console.log('Server listening on port 8888.');

		app.post('/newStation',
			function(req, res){
				console.log(req.body.newStation);
				res.status(200).send(req.body.newStation);
			}
		);
	}
);