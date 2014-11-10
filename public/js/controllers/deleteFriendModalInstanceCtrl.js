app.controller('deleteFriendModalInstanceCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    'items',
    'stationName',
    'stationType',
    'stationId',
    function ($scope, $http, $modalInstance, items, stationName, stationType, stationId) {

        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0]
        };

        $scope.ok = function () {
            
            $modalInstance.close($scope.selected.item);
            for(var i = 0; i < $scope.items.length;i++){
                if($scope.items[i].selected==true){
                    $http.get('/friendRemoveStation/'+$scope.items[i].id+'/'+stationId+'').
                        success(
                            function(data, status){
                            }
                        ).
                        error(
                            function(data, status){
                            }
                        );
                }
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.selectFriend = function(i){
            $scope.items[i].selected=!$scope.items[i].selected;
        };
}]);

