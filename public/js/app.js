var app = angular.module('sound-point', ['ui.router', 'ui.bootstrap'])
    .run(['$window',
        function($window){
            $window.fbAsyncInit = function() {
                FB.init({
                    appId: '690519131028878',
                    xfbml: true,
                    version: 'v2.0',
                    status: true
                });
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
        }
    ])
    .config(['$urlRouterProvider', '$stateProvider',
        function($urlRouterProvider, $stateProvider){
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                .state('home', {
                    url : '/home',
                    templateUrl : '../views/home.html',
                    controller : 'homeCtrl'
                })
                .state('login', {
                    url : '/',
                    templateUrl : '../views/login.html',
                    controller : 'loginCtrl'
                })
                .state('station', {
                    url : '/station',
                    templateUrl : '../views/station.html',
                    controller : 'stationCtrl'
                });
        }]
    );


