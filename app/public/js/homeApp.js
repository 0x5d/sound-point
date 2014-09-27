var app = angular.module('home', []);

app.controller('stationsController', [
    '$scope',
    '$http',
    '$window',
    function($scope, $http, $window){
        $scope.username = 'Juan';
        $scope.stations = [];
        $scope.showCreateStation = true;
        $http.get('/home').
            success(
            //$http.get('http://localhost:8888/home').success(
                function(data, status){
                    $scope.stations = data.stations;
                    setupData();
                }
            ).
            error(
                function(data, status){
                    console.log('Server returned with status ' + status + ': ' + data);
                }
            );
            
//		$scope.stations = [
//			{
//				stationName : 'My niggas\' station, yo',
//				description : 'SWAG'
//			},
//			{
//				stationName : 'Gentlemen',
//				description : 'Style only'
//			}
//		];
                
        function setupData(){
            $scope.stationsMap = [];
            for(var i = 0; i < $scope.stations.length; i++){
                $scope.stationsMap[$scope.stations[i].stationName] = $scope.stations[i];
            }
        }

        $scope.goToStation = function(id){
//            alert(id);
            localStorage.setItem('stationId', id);
            $window.location.href = '/station.html';
        };
        
        
        $scope.showCreate = function(){
            $scope.showCreateStation = !$scope.showCreateStation;
        };
        
        $scope.createNewStation = function(){
            //do stuff.
            if($scope.stationName != ''){
                var newStation = {'stationName' : $scope.newStationName, desc : 'Fresh.'};
                $http.post('/newStation', newStation).
                    success(
                    //$http.post('http://localhost:8888/newStation', {'newStation' : newStation}).success(
                        function(data, status){
                            $scope.stations.push(data);
                        }
                    ).
                    error(
                        function(data, status){
                            console.log(data);
                        }
                    );
                }
            };
	}
    ]
);