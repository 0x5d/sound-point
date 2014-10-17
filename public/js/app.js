var app = angular.module('sound-point', ['ui.router'])
    .config(['$urlRouterProvider', '$stateProvider',
        function($urlRouterProvider, $stateProvider){
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                .state('home', {
                    url : '/home',
                    templateUrl : '../views/home.html',
                    controller : '../js/controllers/homeCtrl.js'
                })
                .state('login', {
                    url : '/',
                    templateUrl : '../views/login.html',
                    controller : 'loginCtrl'
                });
        }]
    );


