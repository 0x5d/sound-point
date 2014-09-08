var http = require('http'),
	express = require('express'),
	app = express();

http.createServer(app);
app.use(express.static(__dirname + '/public'));

app.listen(8888);
console.log('Server listening on port 8888.');