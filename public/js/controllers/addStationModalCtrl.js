app.controller('addStationModalCtrl', [
    '$scope',
    '$modalInstance',
    function ($scope, $modalInstance) {

        $scope.station = {
            type : 'private'
        };

        $scope.setType = function(type){
            $scope.station.type = type;
        };

        $scope.ok = function () {
            $scope.station.stationName = $scope.nameInput;
            $modalInstance.close($scope.station);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}]);

