var app = angular.module('logIn', []);

app.controller('bodyController', 
    [
        '$scope',
        '$http',
        '$window',
        function($scope, $http, $window){
            
            $scope.logIn = function(){
               FB.login(function(response) {
                    if (response.authResponse) {
                        //todo use generic id
                        //$http.post('/login', {userId : response.id}).
                        $http.post('/login', {userId : 1234}).
                            success(
                                function(data, status){
                                    $window.location.href = '/home.html';
                                }
                            ).
                            error(
                                function(data, status){
                                }
                            );
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
            },
            {scope: 'email'});

                /*
                */
            };
        }
    ]
);


