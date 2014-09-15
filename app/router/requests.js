
module.exports = function RequestsHandler(db){
    this.logIn = function(req, res){
        req.session.userId = req.body.userId;
        res.status(200).send({'login' : req.body.userId});
    };
    
    this.getStations = function(req, res){
        var stationsInfo = [
                {
                    stationId : 0,
                    stationName : 'Chilling',
                    description : 'SWAG'
                },
                {
                    stationId : 1,
                    stationName : 'Estación de estudio',
                    description : 'Focus.'
                }
        ];
        res.send(stationsInfo);
    };
    
    this.getSongs = function(req, res){
        var songs = null;
        var status = 404;
        if(req.params.stationId == 0){
            status = 200;
            songs = [
                32476280,
                31216220
            ];
        }
        else if(req.params.stationId == 1){
            status = 200;
            songs = [
                31216220,
                32476280
            ];
        }
        res.status(status).send(songs);
    };
};


