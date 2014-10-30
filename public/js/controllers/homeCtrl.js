app.controller('homeCtrl', [
    '$scope',
    '$http',
    '$state',
    '$modal',
    '$timeout',
    function($scope, $http, $state, $modal, $timeout){
        $scope.username = "";
        $scope.userId;
        $scope.stations = [];
        $scope.invitations =[];
        
        FB.getLoginStatus(
            function(response1) {
                if (response1 && !response1.error) {
                    FB.api(
                    "/me",
                    function (response) {
                        if(response.id){
                            $http.get('/home/' + response.id).
                                success(
                                    function(data, status){
                                        $scope.username = response.first_name;
                                        usr = $scope.userId=response.id;
                                        poller();
                                        $scope.stations = data.stations;
                                        setupData();
                                    }
                                ).
                                error(
                                    function(data, status){
                                    }
                                );
                        }
                        else{
                            $state.go('login');
                        }
                    });
                }
            }
        );
                
        function setupData(){
            $scope.stationsMap = [];
            for(var i = 0; i < $scope.stations.length; i++){
                $scope.stationsMap[$scope.stations[i].stationName] = $scope.stations[i];
            }
        }

        $scope.goToStation = function(id, stationName, type){
            console.log(type);
            $state.go('station', {stationId : id, 'stationName' : stationName, 'type' : type});
        };
        
        $scope.addNewStation = function(){
            var modalInstance = $modal.open({
                templateUrl: 'addStationModal.html',
                controller: 'addStationModalCtrl'
            });
            modalInstance.result.then(function (station) {
                if(station.stationName){
                    console.log(station.stationName + ' ' + station.type);
                    $http.post('/newStation', station).
                        success(
                            function(data, status){
                                $scope.stations.push(data);
                            }
                        ).
                        error(
                            function(data, status){
                            }
                        );
                }
            },
            function () {
            });
        };
          
        $scope.removeStation  = function (station) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalRemoveStationInstanceCtrl'
            });

            modalInstance.result.then(function (deleted) {
              if(deleted){
                    var btn = $(this);
                    btn.button('loading');
                    $http.get('/removeStation/' + station._id+'/'+ $scope.userId +'/'+station.description).
                    success(
                        function (data,status){ 
                            var index = $scope.stations.indexOf(station);
                            if(index>-1){
                                $scope.stations.splice(index, 1);
                            }
                        }
                    ).
                    error(
                        function(data, status){
                        }
                    );
              }
            },
            function () {
            });
        };
            
        var poller = function() {
            var loaded = $scope.invitations ;
            $http.get('/invitation/'+$scope.userId+'/'+JSON.stringify(loaded)).
                success(
                    function(data,status) {
                        if(data.notifications){
                            for(var i = 0; i < data.notifications.length; i++){
                                $scope.invitations.push(data.notifications[i]);
                            }
                        }
                        $timeout(poller, 1000);
                    }
                );
        };
        
        $scope.answerInvitation = function(i, accepted){
            var ainv =[];
            var send = $scope.invitations[i];
            send.accepted = accepted;
            for (var j=0;j<$scope.invitations.length;j++){
                if(i!=j){
                    ainv.push($scope.invitations[j]);
                }
            }
            delete send.$$hashKey;
            $scope.invitations = ainv;
            $http.get('/answer/'+ JSON.stringify(send) +'/'+ $scope.userId).
                success(
                    function(data, status){
                        delete send.accepted;
                        $scope.stations.push(send);
                        console.log(data);
                        console.log($scope.stations);
                        console.log(send);
                    }
                ).
                error(
                    function(data, status){
                    }
                );
            
        };
    }]
);



app.controller('ModalRemoveStationInstanceCtrl', function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


