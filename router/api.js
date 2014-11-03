var ObjectID = require('../node_modules/mongodb').BSONPure.ObjectID;

module.exports = function RequestsHandler(db){
    //POST
    this.logIn = function(req, res){
        req.session.userId = req.body.userId;
        //res.status(200).send({'login' : req.body.userId});
        var query = {
            _id : req.body.userId + ''
        };
        db.collection('users').findOne(query,
            function(err, foundUser){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(foundUser){
                    res.status(200).send({'user' : foundUser});
                }
                else{
                    res.status(404).send({err : 'User not found.'});
                }
            }
        );
    };
    
    //POST
    this.register = function(req, res){
        var user = {
            _id : req.body.userId + '',
            email : req.body.email,
            username : req.body.username,
            stations : []
        };
        db.collection('users').insert(user,
            function(err, inserted){
                if(err){
                    res.status(500).send({'error' : err});
                }
                else{
                    res.status(200).send({'inserted' : inserted});
                }
            }
        );
    };
    
    //post
    this.removeUser=function(req,res){
       db.collection('users').remove({_id : ObjectID(req.body.userId)},function(err,result){
            if(err){
                res.status(501).send({'err' : err});
            }else{
                console.log(result);
            }
       });    
   };
    
    //POST
    this.addStationToUser = function(req, res){
        var query = {_id : req.body.userId};
        var update = {'$push' : {'stations' : req.body.station}};
        
        db.collection('users').update(query, update,
            function(err, updated){
                if(err){
                    res.status(501).send({'err' : err});
                }
                else{
                    if(updated == 1){
                        query = {
                            _id : new ObjectID.createFromHexString(req.body.station._id)
                        };
                        update = {
                            '$push' : {
                                users : ObjectID.createFromHexString(req.body.userId)
                            }
                        };
                        db.collection('stations').update(query, update,
                            function(err, updated){
                                if(err){
                                    res.status(501).send({'err' : err});
                                }
                                else{
                                    if(updated == 1){
                                        
                                     res.status(200).send({'updated' : updated});
                                    }else{
                                         res.status(404).send({'error' : 'User not updated'});
                                    }
                                }
                            }
                        );
                    }
                    else{
                        res.status(404).send({'error' : 'User not updated'});
                    }
                }
            }
        );
    };
    
    //POST
    this.createStation = function(req, res){
        var station = {
            stationName : req.body.station.stationName,
            songs : [],
            type : req.body.type,
            owner: req.body.userId,
            users:[],
            invitations:[]
        };
        station.users.push(req.body.userId);
        db.collection('stations').insert(station,
            function(err, inserted){
                if(err){
                    res.status(500).send({'error' : err});
                }
                else{
                    var query = {
                        _id : req.body.userId + ''
                    };
                    var update = {
                        '$push' : {
                            stations : inserted[0]
                        }
                    };
                    db.collection('users').update(query, update,
                        function(err, updated){
                            if(err){
                                res.status(500).send({'err' : err});
                            }
                            else if(updated){
                                res.status(200).send(inserted[0]);
                            }
                            else{
                                res.status(404).send({err : 'No user found.'});
                            }
                        }
                    );
                }
            }
        );
    };
    
    //GET
    this.getStationsByUser = function(req, res){
        var query = {_id : req.params.userId + ''};
        db.collection('users').findOne(query,
            function(err, foundUser){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(foundUser){
                    var stations = foundUser.stations;
                    res.status(200).send({'stations' : stations});
                }
                else{
                    res.status(404).send({'err' : 'User not found.'});
                }
            }
        );
    };
    
    this.getStationById = function(req, res){
        var query = {_id : new ObjectID.createFromHexString(req.params.stationId)};
        db.collection('stations').findOne(query,
            function(err, foundStation){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(foundStation){
                    res.status(200).send({station : foundStation});
                }
                else{
                    res.status(404).send({'err' : 'Station not found'});
                }
            }
        );
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
    
    this.addSongToStation = function(req, res){
        var query = {
            _id : new ObjectID.createFromHexString(req.body.stationId)
        };
        var song = {
            songId : req.body.song.songId,
            title : req.body.song.title,
            artist : req.body.song.artist,
            artwork : req.body.song.artwork,
            url : req.body.song.url
        };
        if(req.body.song.votes){
            song.votes = req.body.song.votes;
        }
        var update = {
            '$push' : {
                songs : song
            }
        };
        db.collection('stations').update(query, update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated){
                    res.status(200).send({'song' : song});
                }
                else{
                    res.status(404).send({'err' : 'Song not added.'});
                }
            }
        );
    };
    
    this.addSongsToStation = function(req, res){
        var query = {
            _id : new ObjectID.createFromHexString(req.body.stationId)
        };
        var songs = req.body.songs;
        var insert = [];
        for(var i = 0; i < songs.length; i++){
            var song = {
                songId : songs[i].songId,
                title : songs[i].title,
                artist : songs[i].artist,
                artwork : songs[i].artwork,
                url : songs[i].url
            };
            insert.push(song);
        }
        var update = {
            '$push' : {
                'songs' : {
                    '$each' : insert
                }
            }
        };
        db.collection('stations').update(query, update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated){
                    res.status(200).send({'song' : song});
                }
                else{
                    res.status(404).send({'err' : 'Songs not added.'});
                }
            }
        );
    };
    
    this.voteSongUp = function(req, res){
        var query = {
            _id : new ObjectID.createFromHexString(req.body.stationId),
            'songs.songId' : req.body.songId
        };
        var update = {
            '$inc' : {
                'songs.$.votes' : 1
            }
        };
        db.collection('stations').update(query, update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated == 1){
                    res.status(200).send({'updated' : req.body.songId});
                }
                else{
                    res.status(404).send({err : 'Song not voted.'});
                }
            }
        );
    };
    
    this.invite = function(req,res){
        var push={
            stationName : req.body.stationName,
            description : req.body.desc,
            songs : [],
            _id : new ObjectID.createFromHexString(req.body.staionId) 
        };
        var query = {
            _id : req.body.userId + ''
        };
        var update = {
            '$push' : {
                notifications : push
            }
        };
        db.collection('users').update(query, update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated== 1){
                    query={_id:new ObjectID.createFromHexString(req.body.staionId)};
                    update={
                        '$push':{
                            invitations:req.body.userId
                        }
                    };
                    db.collection('stations').update(query, update,
                        function(err, updated){
                            if(err){
                                res.status(500).send({'err' : err});
                            }else if(updated){
                                res.status(200).send(push);
                                
                            }else{
                                res.status(404).send({err : 'No station found.'});
                            }
                        }
                    );
                }
                else{
                    res.status(404).send({err : 'No user found.'});
                }
            }
        );
    };
    
    this.removeSong = function(req, res){
        var query = {
            _id : new ObjectID.createFromHexString(req.params.stationId + '')
        };
        var update = {
            $pull : {
                songs : {songId : parseInt(req.params.songId)}
            }
        };
        db.collection('stations').update(query, update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated){
                    res.status(200).send({'removedSongs' : updated});
                }
                else {
                    res.status(404).send({'err' : 'Song not removed.'});
                }
            }
        );
    };
    
     this.removeStation = function(req, res){
        var query = { _id : req.params.userId };
        var update = null;
        if(req.params.type == "Invited."){
            update = {
                $pull : {
                    stations : {_id :  req.params.stationId}
                }
            };
        }else{
            update = {
                $pull : {
                    stations : {_id :   new ObjectID.createFromHexString(req.params.stationId)}
                }
            };
        }
        db.collection('users').update(query,update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated){
                    res.status(200).send({'removeStation' : "ok"});
                }
                else{
                    res.status(404).send({'err' : 'station wasn´t remove.'});
                }
            }
         );

    };
    
    this.pollInvitation = function(req, res){
        getInvitation(req,res,0);
    };
    
    var getInvitation = function(req,res,count){
        var query = { _id : req.params.userId };
        var loaded = JSON.parse(req.params.loaded);
        db.collection('users').findOne(query,
            function(err, foundUser){
                if(err){
                    res.status(500).send({'err' : err});
                    return;
                }
                else if(foundUser){
                    if( foundUser.notifications){
                        var notifications = foundUser.notifications;
                        var send = [];
                        if(loaded[0]){
                            for(var i = 0; i < loaded.length; i++){
                                for(var j = 0; j<notifications.length; j++){
                                    if(loaded[i]._id==notifications[j]._id){
                                        break;
                                    }
                                    if(j==notifications.length-1){
                                        send.push(notifications[j]);
                                    }
                                }
                            }
                        }else{
                            send = notifications;
                        }
                        if(send[0]){
                            res.status(200).send({'notifications' : send});
                        }else{
                            if(count<15){
                                count++;
                                setTimeout( function(){getInvitation(req,res,count);}, 1000);
                            }else{
                                res.status(200).send({'msg':"not found"});
                            }
                        }
                    }else{
                        if(count<15){
                            count++;
                            setTimeout( function(){getInvitation(req,res,count);}, 1000);
                        }else{
                            res.status(200).send({'msg':"not found"});
                        }
                    }
                }
                else{
                    res.status(404).send({'err' : 'User not found.'});
                    return;
                }
            }
        ); 
    };
    
    this.pollSongs = function(req, res){
        getSongs(req, res, 0);
    };
    
    var getSongs = function(req, res, count){
        var query = { _id : ObjectID.createFromHexString(req.params.stationId)};
        var projection = {_id : false, songs : true};
        var clientSongs = JSON.parse(req.params.clientSongs);
        db.collection('stations').findOne(query, projection,
            function(err, station){
                if(err){
                    res.status(500).send({'err' : err});
                    return;
                }
                else if(station){
                    if(station.songs.length != clientSongs.length){
                        res.status(200).send({'songs' : station.songs});
                    }
                    else{
                        var changes = false;
                        for(var i = 0; i < station.songs.length; i++){
                            if(station.songs[i].songId != clientSongs[i].songId){
                                changes = true;
                                break;
                            }
                        }
                        if(changes){
                            res.status(200).send({'songs' : station.songs});
                        }
                            
                        else if(count < 15){
                            setTimeout(
                                function(){
                                    count++;
                                    getSongs(req, res, count);
                                },
                                1000
                            );
                        }
                        else{
                            res.status(200).send({msg : 'No changes.'});
                        }
                    }
                }
                else{
                    res.status(404).send({msg : 'Station not found.'});
                }
            }
        );
    };
    
    this.answerInvitations = function(req,res){
        var loaded = JSON.parse(req.params.ans);
        var query = { _id : req.params.userId };
        var update = {
            $pull : {
                notifications : {_id :  new ObjectID.createFromHexString(loaded._id)}
            }
        };
        db.collection('users').update(query,update,
            function(err, updated){
                if(err){
                    res.status(500).send({'err' : err});
                }
                else if(updated){
                    if(loaded.accepted){
                        loaded._id=new  ObjectID.createFromHexString(loaded._id);
                        var update = {'$push' : {'stations' : loaded}};
                        db.collection('users').update(query, update,
                            function(err, updated){
                                if(err){
                                    res.status(500).send({'err' : err});
                                }
                                else{
                                    if(updated == 1){
                                        res.status(200).send({'updated' : updated});
                                    }
                                    else{
                                        res.status(404).send({'error' : 'User not updated'});
                                    }
                                }
                            }
                        );
                        query = {_id:loaded._id};
                        update={
                            $pull:{
                                invitations:req.params.userId
                            },
                            '$push':{
                                users:req.params.userId
                            }
                        };
                        db.collection('stations').update(query,update,
                            function(err, updated){
                                if(err){
                                    
                                }
                            }
                        );
                    }else{
                        console.log(loaded._id);
                        query = {_id:loaded._id};
                        update={
                            $pull:{
                                invitations:req.params.userId+""
                            }
                        };
                        db.collection('stations').update(query,update,
                            function(err, updated){
                                if(err){
                                    console.log(err);
                                }
                                console.log(req.params.userId + "up "+updated);
                            }
                        );
                        res.status(200).send({updated:"removed"});
                    }
                }
                else{
                    res.status(404).send({'err' : 'station wasn´t removed.'});
                }
            }
         );
    };
};


