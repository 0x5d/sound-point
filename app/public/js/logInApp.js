var app = angular.module('logIn', []);

app.controller('bodyController',
        [
            '$scope',
            '$http',
            '$window',
            function ($scope, $http, $window) {

                $scope.logIn = function () {
                    FB.login(function (response) {
                        if (response.authResponse) {
                            //todo use generic id
                            //$http.post('/login', {userId : response.id}).
                            $http.post('/login', {userId: response.authResponse.userID}).
                                    success(
                                            function (data, status) {
                                                $window.location.href = '/home.html';
                                            }
                                    ).
                                    error(
                                            function (data, status) {
                                                if (data.err == "User not found.") {
                                                    FB.api(
                                                            "/me",
                                                            function (response1) {
                                                                if (response1 && !response1.error) {
                                                                    console.log(response1);
                                                                    $http.post('/register',
                                                                    {userId: response1.id , email: response1.email, username: response1.first_name}).
                                                                            success(
                                                                                function(data, status){
                                                                                    $window.location.href = '/home.html';
                                                                                }
                                                                            ).error(
                                                                                function (data, status) {
                                                                                    
                                                                                }
                                                                            );
                                                                }
                                                            }
                                                    );
                                                }
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


