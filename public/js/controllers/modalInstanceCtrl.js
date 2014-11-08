app.controller('modalInstanceCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    'items',
    'stationName',
    'stationType',
    'stationId',
    'stationInvites',
    function ($scope, $http, $modalInstance, items, stationName, stationType, stationId, invites) {

        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
            for(var i = 0; i < $scope.items.length;i++){
                if($scope.items[i].selected==true){
                    var Station = {
                        stationName : stationName,
                        type : stationType,
                        staionId : stationId,
                        userId : $scope.items[i].id
                    };
                    invites.push($scope.items[i].id);
                    $http.post('/invite', Station).
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

