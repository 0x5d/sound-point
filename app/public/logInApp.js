var app = angular.module('logIn', []);

app.controller('bodyController', 
    [
        '$scope',
        '$http',
        function($scope, $http){
            $scope.logIn = function(){
                $http.post('/logIn', {userId : 666});
            };
        }
    ]
);


