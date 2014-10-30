app.controller('songSearchModalCtrl', [
    '$scope',
    '$modalInstance',
    function ($scope, $modalInstance) {

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
            $modalInstance.close(song);
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
}]);
