app.controller('loginCtrl', [
    '$scope',
    '$http',
    '$state',
    function ($scope, $http, $state) {
        $scope.logIn = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    $http.post('/login', {userId: response.authResponse.userID})
                        .success(
                            function (data, status) {
                                $state.go('home');
//                                $window.location.href = '/home.html';
                            }
                        )
                        .error(
                            function (data, status) {
                                if (data.err == "User not found.") {
                                    FB.api(
                                        "/me",
                                        function (response1) {
                                            if (response1 && !response1.error) {
                                                var user = {
                                                    userId: response1.id,
                                                    email: response1.email,
                                                    username: response1.first_name
                                                };
                                                $http.post('/register', user)
                                                    .success(
                                                        function(data, status){
                                                            $state.go('home');
//                                                            $window.location.href = '/home.html';
                                                        }
                                                    )
                                                    .error(
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
            {scope: 'email,user_friends'});
        };
    }]
);