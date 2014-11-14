app.controller('searchStationsModalCtrl', [
    '$scope',
    '$http',
    '$modalInstance',
    'items',
    'stations',
    function ($scope, $http, $modalInstance, items,stations) {
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
                                       var count=0;
                                        var j=0;
                                        var k=0;
                                       
                                        while(j<data.stations.length){
                                         while(k<stations.length){    
                                       console.log(data.stations[k]._id);
                                       console.log(stations[k]._id);
                                          if(data.stations[j]._id==stations[k]._id){                                              
                                           break;   
                                          }else if(k==(stations.length-1)){
                                             $scope.publicStations[count]= data.stations[j];
                                             count++;
                                          }
                                          k++;
                                        }
                                        k=0;
                                        j++;
                                            //$scope.publicStations = data.stations;                                             
                                        
                                        }
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
