app.controller('searchStationsModalCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    'items',
    /*'stationName',
    'stationType',
    'stationId',
    'stationInvites', , stationName, stationType, stationId, invites*/
    function ($scope, $http, $modalInstance, items) {
        $scope.publicStations = [];
        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0]
        };
        $scope.friendsStations=[];
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
            $scope.addStation = function (station) {
            
               $modalInstance.close(station);
            
        };
        $scope.selectFriend = function(i){
            $scope.items[i].selected=!$scope.items[i].selected;
           for(var i = 0; i < $scope.items.length;i++){
                if($scope.items[i].selected==true){
                 
                   $http.get('/public/' + $scope.items[i].id).
                                    success(
                                        function(data, status){
                                            $scope.publicStations = data.stations;                                             
                                        }
                                    ).
                                    error(
                                        function(data, status){   
                                        }
                                    );
        };
        }
            }
}]);

