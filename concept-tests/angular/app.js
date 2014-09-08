var app = angular.module('home', []);
app.controller('bodyController', ['$scope',
	function($scope){
		$scope.userName = 'My Nigga';
		// $scope.submit = function(text){
		// 	alert('You wrote ' + text);
		// };
	}]
);

app.controller('stationsController', ['$scope',
	function($scope){
		$scope.stations = [
			{
				stationName : 'My niggas\' station, yo',
				description : 'SWAG'
			},
			{
				stationName : 'Gentlemen',
				description : 'Style only'
			}
		];

		$scope.createNew = function(){
			//do stuff.
			$scope.stations.push({stationName : 'new one', description : 'This is new as fuck.'});
		};
	}]
);