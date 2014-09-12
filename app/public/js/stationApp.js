var app = angular.module('station', []);

app.controller('bodyController', 
    [
        '$scope',
        '$http',
        '$window',
        function($scope, $http, $window){
            
            $scope.songs = [];
            
            $scope.logIn = function(){
                $http.get('/station', {stationId : localStorage.getItem('stationId')}).
                    success(
                        function(data, status){
                            setupSongs(data.songs);
                        }
                    ).
                    error(
                        function(data, status){
                            
                        }
                    );
            };
            
            function setupSongs(songs){
                for(var i = 0; i < songs.length; i++){
                    $scope.songs.push(songs[i]);
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


