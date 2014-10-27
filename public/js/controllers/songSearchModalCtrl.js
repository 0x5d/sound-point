app.controller('songSearchModalCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    function ($scope, $http, $modalInstance) {

        $scope.items = [];
        $scope.selected = {
        };
        
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

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
            for(var i = 0; i < $scope.items.length;i++){
                
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.selectSong = function(i){
            $scope.items[i].selected=!$scope.items[i].selected;
            console.log($scope.items);
        };
}]);
