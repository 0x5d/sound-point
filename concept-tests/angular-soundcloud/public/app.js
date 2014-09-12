window.onload = function(){
    SC.initialize({
        client_id: "d00547f88a72d9a987b70342928f1a61"
    });
};

var app = angular.module('home', []);
app.controller('bodyController', ['$scope',
    function($scope) {
        $scope.username = 'My Nigga';
        $scope.stationName = 'niggalist';
        // $scope.submit = function(text){
        // 	alert('You wrote ' + text);
        // };
    }]
);

app.controller('songsController', ['$scope',
    function($scope) {
        
        $scope.songs = [
            {
                title : 'Zedd - Slam the Door',
                artist : 'Goliat',
                artwork : 'https://i1.sndcdn.com/artworks-000016273871-ssj0dg-large.jpg?e76cf77'
            }
        ];
        $scope.results = [];

        $scope.search = function(text) {
            SC.get('/tracks', {'q' : text},
                function(tracks){
                    for(var i = 0; i < tracks.length; i++){
                        var result = {
                            title : tracks[i].title,
                            artist : tracks[i].user.username,
                            artwork : tracks[i].artwork_url
                        };
                        $scope.results[i] = result;
                    }
                    $scope.$apply();
                    console.log(tracks);
                }
            );
//            var newStation = {stationName: 'new one', description: 'This is new as fuck.'};
//            $http.post('http://localhost:8888/newStation', {'newStation': newStation}).success(
//                function(data, status) {
//                    $scope.stations.push(data);
//                }
//            );
        };
    }]
);