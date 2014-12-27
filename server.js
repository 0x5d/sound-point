#!/bin/env node
var config = require('./config.json'),
    router = require('./router'),
    http = require('http'),
    express = require('express'),
    session = require('express-session');
    bodyParser = require('body-parser'),
    mongoClient = require('mongodb').MongoClient;

var soundPoint = function(){
	
	var self = this;

	self.setupVariables = function() {

        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || config.serverPort;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };

        // default to a 'localhost' configuration:
        self.connection_string = '127.0.0.1:27017/nodejs';
        // if OPENSHIFT env variables are present, use the available connection info:
        if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
          self.connection_string = 'admin' + ":" +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
          process.env.OPENSHIFT_APP_NAME;
        }
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();
        // Create the express server and routes.
    };

    self.start = function(){
        mongoClient.connect('mongodb://'+ self.connection_string,
            function(err, db){
                if(err){
                        throw err;
                }
                console.log('DB up.');

                self.app = express();
                http.createServer(self.app);
                self.app.use(express.static(__dirname + '/' + config.staticContentFolder));
                self.app.use(bodyParser.json());
                self.app.use(session({secret: 'soundpoint'}));
                router(self.app, db);
                self.app.listen(self.port, self.ipaddress, function() {
                    console.log('%s: Node server started on %s:%d ...',
                    Date(Date.now() ), self.ipaddress, self.port);
                });
                console.log('Server listening on port ' + self.port + '.');
            }
        );
    };
};

var sp = new soundPoint();
sp.initialize();
sp.start();
