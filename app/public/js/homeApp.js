var app = angular.module('home', []);
app.controller('bodyController', ['$scope',
    function($scope){
        $scope.username = 'Juan';
    }]
);

app.controller('stationsController', [
    '$scope',
    '$http',
    '$window',
    function($scope, $http, $window){
        $scope.stations = [];
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
                
        $scope.createNew = function(){
            //do stuff.
            var newStation = {stationName : 'new one', description : 'This is new as fuck.'};
            $http.post('/newStation', {'newStation' : newStation}).
                success(
                //$http.post('http://localhost:8888/newStation', {'newStation' : newStation}).success(
                    function(data, status){
                            $scope.stations.push(data);
                    }
                );
            };
	}
    ]
);