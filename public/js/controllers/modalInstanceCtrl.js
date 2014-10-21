app.controller('ModalInstanceCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    'items',
    function ($scope, $http,$modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
            console.log(localStorage.getItem('stationName'));
            for(var i = 0; i < $scope.items.length;i++){
                if($scope.items[i].selected==true){
                    var Station = {
                        stationName : localStorage.getItem('stationName'), 
                        desc : 'Invited.',
                        staionId : localStorage.getItem('stationId'),
                        userId : $scope.items[i].id
                    };
                    $http.post('/invite', Station).
                        success(
                        //$http.post('http://localhost:8888/newStation', {'newStation' : newStation}).success(
                            function(data, status){
                                console.log("done");
                            }
                        ).
                        error(
                            function(data, status){
                                console.log(data);
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
            console.log($scope.items);
        };
}]);

