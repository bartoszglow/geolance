var app = angular.module('app', ['ngRoute', 'google-maps']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'loginCtrl',
                templateUrl: 'views/login.html'
            })
        .when('/map',
            {
                controller: 'mapCtrl',
                templateUrl: 'views/hospital/map.html'
            })
        .when('/list',
            {
                controller: 'listCtrl',
                templateUrl: 'views/hospital/list.html'
            })
        .when('/ambulance',
            {
                controller: 'ambulanceCtrl',
                templateUrl: 'views/ambulance/ambulance.html'
            })
        .otherwise({ redirectTo: '/' });
}]);