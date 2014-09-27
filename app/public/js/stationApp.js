window.onload = function(){
      SC.initialize({
        client_id: "d00547f88a72d9a987b70342928f1a61"
    });
};

var app = angular.module('station', []);

var currentTrack;
app.controller('bodyController', 
    [
        '$scope',
        '$http',
        '$window',
        function($scope, $http, $window){
            
            $scope.songs = [];
            $scope.results = [];
            $http.get('/station/' + localStorage.getItem('stationId')).
                success(
                    function(data, status){
                        if(data.station.songs){
                            setupSongs(data.station.songs);
                        }
                    }
                ).
                error(
                    function(data, status){
                        console.log(data);
                    }
                );
            
            function setupSongs(songs){
                if(songs.length > 0){
                    var ids = songs[0].songId;
                    for(var i = 1; i < songs.length; i++){
                        ids += "," + songs[i].songId;
                    }
                    SC.get('/tracks',{ids : ids},
                        function(tracks) {
                            var track;
                            for(var i = 0; i < tracks.length; i++){
                                track = {
                                    title:tracks[i].title,
                                    artwork:tracks[i].artwork_url,
                                    usr:tracks[i].user.username,
                                    description:tracks[i].description,
                                    songId : tracks[i].id,
                                    url:tracks[i].stream_url
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
            }
            function qmanager(song){
                SC.stream(song.url, {onfinish:
                            function(){
                                $scope.songs.shift();
                                $scope.$apply();
                                qmanager($scope.songs[0]);
                            }}, 
                        function(sound){
                            currentTrack = sound;
                            sound.play();
                        });
            }
            
           $scope.next = function (){
               currentTrack.stop();
               $scope.songs.shift();
               SC.stream($scope.songs[0].url, {onfinish:
                            function(){ 
                                $scope.songs.shift();
                                $scope.$apply();
                                qmanager($scope.songs[0]);
                            }}, 
                        function(sound){
                            currentTrack = sound;
                            sound.play();
                        });
           };
           
            $scope.search = function(text) {
                SC.get('/tracks', {'q' : text},
                    function(tracks){
                        for(var i = 0; i < tracks.length; i++){
                            var track = {
                                title : tracks[i].title,
                                artwork : tracks[i].artwork_url,
                                usr : tracks[i].user.username,
                                description : tracks[i].description,
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
                var song = {
                    songId : $scope.results[i].songId,
                    songName : $scope.results[i].title,
                    artist : $scope.results[i].usr,
                    thumbnail : $scope.results[i].artwork
                };
                var postData = {
                    stationId : localStorage.getItem('stationId'),
                    'song' : song
                };
                $http.post('/newSong', postData).
                    success(
                        function(data, status){
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
        }
    ]
);
app.controller('songsController', 
    [
        '$scope',
        '$http',
        '$window',
        function($scope, $http, $window){
            
        }
    ]
);


