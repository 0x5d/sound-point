window.onload = function(){
      SC.initialize({
        client_id: "d00547f88a72d9a987b70342928f1a61"
    });
};

var currentTrack;
app.controller('stationCtrl', [
    '$scope',
    '$http',
    '$timeout',
    '$stateParams',
    function($scope, $http, $timeout, $stateParams){

        $scope.songs = [];
        $scope.results = [];
        $http.get('/station/' + $stateParams.stationId)//localStorage.getItem('stationId')).
            .success(
                function(data, status){
                    if(data.station.songs){
                       // setTimeout(setupSongs(data.station.songs), 100000);
                        setupSongs(data.station.songs);
                        pollSongs();
                    }
                }
            )
            .error(
                function(data, status){
                }
            );

        function setupSongs(songs){
            if(songs.length > 0){
                var ids = songs[0].songId;
                for(var i = 1; i < songs.length; i++){
                    ids += "," + songs[i].songId;
                }
                    getTracks(ids);

            }
        }

        function getTracks(ids){
           SC.get('/tracks',{ids : ids},
                    function(tracks) {
                        if(tracks.errors){
                            getTracks(ids);
                            return;
                        }
                        var track;
                        for(var i = 0; i < tracks.length; i++){
                            track = {
                                title : tracks[i].title,
                                artwork : tracks[i].artwork_url,
                                artist : tracks[i].user.username,
                                description:tracks[i].description,
                                songId : tracks[i].id,
                                url : tracks[i].stream_url
                            };
                            $scope.songs.push(track);
                        }
                        $scope.$apply();
                        qmanager($scope.songs[0]);
                        /*
                        SC.stream($scope.songs[0].url, function(sound){
                            sound.play();
                        });
                        $scope.songs.shift();
                        $scope.$apply();*/
                        //soundcloud.getPlayer("myPlayer");
                    }
                ); 
        }

        function qmanager(song){
            if(song.url){
                SC.stream(song.url, {onfinish:
                    function(){
                        var finishedSong = $scope.songs.shift();
                        $scope.$apply();
                        currentTrack = null;
                        qmanager($scope.songs[0]);
                        removeSong($stateParams.stationId /**localStorage.getItem('stationId')**/, finishedSong.songId);   
                    }}, 
                    function(sound){
                        currentTrack = sound;
                        sound.play();
                    }
                );
            }else if($scope.songs[0]){
                var lastSong = $scope.songs.shift();
                removeSong($stateParams.stationId /**localStorage.getItem('stationId')**/, lastSong.songId);
            }
        }

        $scope.next = function (){
            if($scope.songs[0]){
                currentTrack.stop();
                var lastSong = $scope.songs.shift();
                removeSong($stateParams.stationId /**localStorage.getItem('stationId')**/, lastSong.songId);
            }
            if($scope.songs[0]){
                SC.stream($scope.songs[0].url, {onfinish:
                     function(){ 
                             var finishedSong = $scope.songs.shift();
                             $scope.$apply();
                             qmanager($scope.songs[0]);
                             removeSong($stateParams.stationId /**localStorage.getItem('stationId')**/, finishedSong.songId);                            
                         }}, 
                     function(sound){
                         currentTrack = sound;
                         sound.play();
                     }
                 );
            }
        };

        function removeSong(stationId, songId){
           $http.get('/station/removeSong/'
                + stationId
                + '/' + songId).
                success(
                    function(data, status){

                    }
                ).
                error(
                    function(data, status){
                    }
                );
        }

        $scope.search = function(text) {
            SC.get('/tracks', {'q' : text},
                function(tracks){
                    for(var i = 0; i < tracks.length; i++){
                        var track = {
                            title : tracks[i].title,
                            artwork : tracks[i].artwork_url,
                            artist : tracks[i].user.username,
                            songId : tracks[i].id,
                            url : tracks[i].stream_url
                        };
                        $scope.results.push(track);
                    }
                    $scope.$apply();
                }
            );
        };

        $scope.addSong = function(i){
            console.log($scope.results[i].url)
            var song = {
                songId : $scope.results[i].songId,
                title : $scope.results[i].title,
                artist : $scope.results[i].artist,
                artwork : $scope.results[i].artwork,
                url: $scope.results[i].url
            };
            var postData = {
                stationId : $stateParams.stationId /**localStorage.getItem('stationId')**/,
                'song' : song
            };
            $http.post('/newSong', postData).
                success(
                    function(data, status){
                        console.log(data);
                        if(!$scope.songs[0]){
                            qmanager(data.song);
                        }
                        $scope.songs.push(data.song);
                    }
                ).
                error(
                    function(data, status){
                        //TODO handle error
                    }
                );
            //$scope.songs.push($scope.results[i]);
            $scope.results = [];
            //$scope.$apply();
        };

        $scope.isPlaying = false;

        $scope.pause= function(){
            currentTrack.pause();
            $scope.isPlaying = true;
        }; 

        $scope.play = function(){
            currentTrack.play();
            $scope.isPlaying = false;
        };

        var pollSongs = function(){
            if($scope.songs){
                var currentSongs = [];
                for(var i = 0; i < $scope.songs.length; i++){
                    currentSongs.push({songId : $scope.songs[i].songId});
                }
                $http.get('/pollStation/'
                    + $stateParams.stationId /**localStorage.getItem('stationId')**/
                    + '/' + JSON.stringify(currentSongs)).
                success(
                    function(data, status){
                        if(data.songs){
                            $scope.songs = [];
                            $scope.songs = data.songs;
                        }
                        $timeout(pollSongs, 1000);
                    }
                ).error(
                    function(data, status){
                        $timeout(pollSongs, 1000);
                    }
                );
            }
            else{
                $timeout(pollSongs, 1000);
            }
        };
    }]
);


