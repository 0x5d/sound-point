var app = angular.module('home', []);
app.controller('bodyController', ['$scope',
    function($scope){
        $scope.username = 'My Nigga';
        // $scope.submit = function(text){
        // 	alert('You wrote ' + text);
        // };
    }]
);

//app.config(['$routeProvider',
//    function($routeProvider) {
//        $routeProvider.
//                when('/', {
//                    templateUrl: './index.html',
//                    controller: 'homeApp'
//                }).
//                otherwise({
//                    redirectTo: '/'
//                });
//    }]);

app.controller('stationsController', [
    '$scope',
    '$http',
    '$window',
    function($scope, $http, $window){
        $http.get('http://localhost:8888/home').success(
            function(data, status){
                    $scope.stations = data;
                    setupData();
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
                $http.post('http://localhost:8888/newStation', {'newStation' : newStation}).success(
                    function(data, status){
                            $scope.stations.push(data);
                    }
                );
            };
	}]
);