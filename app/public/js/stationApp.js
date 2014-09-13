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
                console.log(songIDs);
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
                                track = ({title:tracks[i].title})
                                $scope.songs.push(track);
                            }
                            $scope.$apply();
                        }
                    );
                }
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


