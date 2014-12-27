var app = angular.module('shard', ['ui.router', 'ui.bootstrap'])
//    .run(['$window',
//        function($window){
//            $window.fbAsyncInit = function() {
//                FB.init({
//                    appId: '690519131028878',
//                    xfbml: true,
//                    version: 'v2.0',
//                    status: true
//                });
//            };
//
//            (function(d, s, id) {
//                var js, fjs = d.getElementsByTagName(s)[0];
//                if (d.getElementById(id)) {
//                    return;
//                }
//                js = d.createElement(s);
//                js.id = id;
//                js.src = "//connect.facebook.net/en_US/sdk.js";
//                fjs.parentNode.insertBefore(js, fjs);
//            }(document, 'script', 'facebook-jssdk'));
//        }
//    ])
    .config(['$urlRouterProvider', '$stateProvider',
        function($urlRouterProvider, $stateProvider){
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                .state('login', {
                    url : '/',
                    templateUrl : '../views/landing/landing.html',
                    controller : 'loginCtrl'
                })
                .state('about', {
                    url : '/about',
                    templateUrl : '../views/landing/about.html'
                });
        }]
    );


