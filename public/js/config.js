angular.module('mean').config(['$routeProvider', '$locationProvider',
    function($routeProvider,$locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $routeProvider.
       
        when('/home', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }
]);
