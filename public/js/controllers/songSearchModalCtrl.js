app.controller('songSearchModalCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    'stationId',
    function ($scope, $http, $modalInstance, stationId) {

        $scope.items = [];
        
        $scope.search = function(text){
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
                        $scope.items.push(track);
                    }
                    $scope.$apply();
                }
            );
        };
        
        $scope.addSong = function(song){
            var postData = {
                'stationId' : stationId,
                'song' : song
            };
            $http.post('/newSong', postData).
                success(
                    function(data, status){
                    }
                ).
                error(
                    function(data, status){
                        //TODO handle error
                    }
                );
            $modalInstance.close(song);
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
}]);
