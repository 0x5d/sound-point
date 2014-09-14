window.onload = function(){
      SC.initialize({
        client_id: "d00547f88a72d9a987b70342928f1a61"
    });
};

var app = angular.module('station', []);


app.controller('bodyController', 
    [
        '$scope',
        '$http',
        '$window',
        function($scope, $http, $window){
            
            $scope.songs = [];
            $http.get('/station/' + localStorage.getItem('stationId')).
                success(
                    function(data, status){
                        setupSongs(data);
                    }
                ).
                error(
                    function(data, status){

                    }
                );
            
            function setupSongs(songIDs){
                if(songIDs.length>0){
                    var ids = songIDs[0];
                    for(var i = 1; i < songIDs.length; i++){
                        ids += "," + songIDs[i];
                    }
                    SC.get('/tracks',{ids : ids},
                        function(tracks) {
                            console.log(tracks);
                            var track;
                            for(var i = 0; i < tracks.length; i++){
                                track = ({title:tracks[i].title,
                                          artwork:tracks[i].artwork_url,
                                          usr:tracks[i].user.username,
                                          description:tracks[i].description,
                                          url:tracks[i].stream_url});
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
                console.log(song);
                SC.stream(song.url, {onfinish:
                            function(){ 
                                $scope.songs.shift();
                                $scope.$apply();
                                qmanager($scope.songs[0]);
                            }}, 
                        function(sound){
                             sound.play();
                        });
            }
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


