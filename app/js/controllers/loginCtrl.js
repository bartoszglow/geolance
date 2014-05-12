app.controller('loginCtrl', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {
    $scope.credentials = { username: "", password: "" };

    $scope.login = function() {
        AuthenticationService.login($scope.credentials);
    };

    window.scope = $scope;
}]);