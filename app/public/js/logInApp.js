var app = angular.module('logIn', []);

app.controller('bodyController', 
    [
        '$scope',
        '$http',
        '$window',
        function($scope, $http, $window){
            $scope.logIn = function(){
                $http.post('/logIn', {userId : 666}).
                    success(
                        function(data, status){
                            $window.location.href = '/home.html';
                        }
                    ).
                    error(
                        function(data, status){
                            
                        }
                    );
            };
        }
    ]
);


