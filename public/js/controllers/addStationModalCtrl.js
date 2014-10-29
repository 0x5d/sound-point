app.controller('addStationModalCtrl', [
    '$scope',
    '$modalInstance',
    function ($scope, $modalInstance) {

        $scope.setType = function(type){
            
        };

        $scope.ok = function () {
            $modalInstance.close($scope.nameInput);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}]);

