var app = angular.module('home', ['ui.bootstrap']);

app.controller('stationsController', [
    '$scope',
    '$http',
    '$window',
    '$modal',
    '$log',
    function($scope, $http, $window, $modal, $log){
        $scope.username ;
        $scope.userId;
        $scope.stations = [];
        $scope.showCreateStation = true;
        window.fbAsyncInit = function() {
            FB.init({
                appId: '690519131028878',
                xfbml: true,
                version: 'v2.0',
                status: true
            });
             FB.getLoginStatus(
                function(response1) {
                    if (response1 && !response1.error) {
                        FB.api(
                        "/me",
                        function (response) {
                            $http.get('/home/' + response.id).
                                success(
                                //$http.get('http://localhost:8888/home').success(
                                    function(data, status){
                                        $scope.username = response.first_name;
                                        $scope.userId=response.id;
                                        console.log($scope.username);
                                        $scope.stations = data.stations;
                                        setupData();
                                    }
                                ).
                                error(
                                    function(data, status){
                                        console.log('Server returned with status ' + status + ': ' + data);
                                    }
                                );
                        });
                    }
                }
            );
        };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
       
      
        /*$http.get('/home').
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
            );*/
            
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

        $scope.goToStation = function(id, stationName){
//            alert(id);
            localStorage.setItem('stationId', id);
            localStorage.setItem('stationName', stationName);
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
                            console.log(data._id);
                        }
                    ).
                    error(
                        function(data, status){
                            console.log(data);
                        }
                    );
                }
            };
            
          
            $scope.removeStation  = function (station) {

                var modalInstance = $modal.open({
                  templateUrl: 'myModalContent.html',
                  controller: 'ModalInstanceCtrl'
                });

                modalInstance.result.then(function (deleted) {
                  if(deleted){
                       var btn = $(this);
                        btn.button('loading');
                        $http.get('/removeStation/' + station._id+'/'+ $scope.userId).
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
                                console.log('Server returned with status ' + status + ': ' + data);
                            }
                        );
                  }
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
            };
            
	}
    ]
);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
