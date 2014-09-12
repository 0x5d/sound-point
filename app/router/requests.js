
module.exports = function RequestsHandler(db){
    this.logIn = function(req, res){
        req.session.userId = req.body.userId;
        res.status(200).send({'login' : req.body.userId});
    };
    
    this.getStations = function(req, res){
        var stationsInfo = [
                {
                    stationId : 0,
                    stationName : 'My niggas\' station, yo',
                    description : 'SWAG'
                },
                {
                    stationId : 1,
                    stationName : 'Gentlemen',
                    description : 'Style only'
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
            songs = [
                32476280,
                31216220
            ];
        }
        res.status(status).send(songs);
    };
};


