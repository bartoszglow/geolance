app.controller('loginCtrl', ['$scope', 'AuthenticationService', '$q', function ($scope, AuthenticationService, $q) {
    $scope.credentials = { username: "", password: "" };
    $scope.error = "jestfdsfsd";

    $('.alert').hide();
    window.scope = $scope;

    $scope.login = function() {
        $scope.promise = AuthenticationService.login($scope.credentials);
        $scope.promise.then(
        	function() {},
        	function( err ) { 
        		$scope.error = err;
        		$scope.showError();
        	}
        );

    };

    $scope.showError = function() {
    	$('.alert').show();
    	setInterval( function() {
    		$('.alert').hide();
    	}, 3000 );
    };
}]);