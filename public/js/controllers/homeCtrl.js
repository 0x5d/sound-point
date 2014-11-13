app.controller('homeCtrl', [
    '$scope',
    '$http',
    '$state',
    '$modal',
    '$timeout',
    '$window',
    function($scope, $http, $state, $modal, $timeout,$window){
        $scope.username = "";
        $scope.userId;
        $scope.stations = [];
        $scope.invitations =[];
        function fbinit(){
            try{
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
            }catch(err)
            {
                
            }
        }
        fbinit();
        
        

        $window.fbAsyncInit = function() {
            FB.init({
                appId: '690519131028878',
                xfbml: true,
                version: 'v2.0',
                status: true
            });

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
            fbinit();
        };
        
        function setupData(){
            $scope.stationsMap = [];
            for(var i = 0; i < $scope.stations.length; i++){
                console.log($scope.stations[i]);
                $scope.stationsMap[$scope.stations[i].stationName] = $scope.stations[i];
            }
        }

        //cargar estacion

        $scope.goToStation = function(id, stationName, type){

            $state.go('station', {stationId : id, 'stationName' : stationName, 'type' : type, user:$scope.userId});
            
        };
        
        $scope.addNewStation = function(){
            var modalInstance = $modal.open({
                templateUrl : 'addStationModal.html',
                controller : 'addStationModalCtrl'
            });
            modalInstance.result.then(function (station) {
                if(station.stationName){
                    $http.post('/newStation', {station : station, userId : $scope.userId}).
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

        $scope.logout= function(){
            FB.logout(function(response) {
            window.location.replace('/index.html');
            });
         };  

        $scope.addPublicStation = function(){
            
           /*station*/
            FB.api(
                "/me/friends?fields=id,name,picture",
                function (response) {
                    if (response && !response.error) {
                        var friends = []; 
                        response.data.forEach(function(friend) {
                            var obj ={
                                name:friend.name,
                                id:friend.id,
                                picture:friend.picture,
                                selected:false
                            };
                            friends.push(obj);
                        });
                     var modalInstance = $modal.open({
                templateUrl : 'searchStationsModal.html',
                controller : 'searchStationsModalCtrl',
                 resolve: {
                                items: function () {
                                    return friends;
                                }
                                }
                        });

            modalInstance.result.then(function (station) {
                
            
                    $http.post('/joinPublicStation', {station : station, userId : $scope.userId}).
                        success(
                            function(data, status){
                                $scope.stations.push(data);
                            }
                        ).
                        error(
                            function(data, status){
                                console.error(data.err);
                            }
                        );
                }
            ,
            function () {
            });
                    }
                }
                );
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
                    $http.get('/removeStation/' + station._id+'/'+ $scope.userId ).
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
        $scope.addPublicStation = function(){
            
           /*station*/
            FB.api(
                "/me/friends?fields=id,name,picture",
                function (response) {
                    if (response && !response.error) {
                        var friends = []; 
                        response.data.forEach(function(friend) {
                            var obj ={
                                name:friend.name,
                                id:friend.id,
                                picture:friend.picture,
                                selected:false
                            };
                            friends.push(obj);
                        });
                     var modalInstance = $modal.open({
                templateUrl : 'searchStationsModal.html',
                controller : 'searchStationsModalCtrl',
                 resolve: {
                                items: function () {
                                    return friends;
                                }
                                }
                        });

            modalInstance.result.then(function (station) {
                    $http.post('/joinPublicStation', {station : station, userId : $scope.userId}).
                        success(
                            function(data, status){
                                $scope.stations.push(data);
                            }
                        ).
                        error(
                            function(data, status){
                                console.error(data.err);
                            }
                        );
                }
            ,
            function () {
            });
                    }
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
                        if(data.updated!="removed"){
                            delete send.accepted;
                            $scope.stations.push(send);
                        }
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


