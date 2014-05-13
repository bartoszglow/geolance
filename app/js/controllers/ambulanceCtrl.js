app.controller('ambulanceCtrl', ['$scope', '$location', '$http', 'AuthenticationService', function ($scope, $location, $http, AuthenticationService) {
	$scope.status = true;
	$scope.access = false;

	$scope.update = function() {
		if( $scope.status === true ) {
		    navigator.geolocation.getCurrentPosition(
		    	function(pos) {
					var updateInfo = {
						'username'  : AuthenticationService.getUsername(),
			        	'access' 	: $scope.access === false ? 0 : 1,
			        	'latitude'	: pos.coords.latitude,
			        	'longitude' : pos.coords.longitude,
			        	'accuracy'	: pos.coords.accuracy
			        };
	        		$http.post('/geolance/php/update', updateInfo);
					$scope.timeout = setTimeout($scope.update,3000);
		    	}
		    );
		}
	};

	// ONLINE / OFFLINE
    $scope.statusChange = function() {
    	$scope.status = $('#status:checked')[0] ? true : false;		// change status online/offline
		$( '.toogled' ).toggleClass( 'hidden' ); 					// hide/show others switches
		window.clearTimeout($scope.timeout);						// clear timeout after change
		$scope.update();											// start new timeout
    };

    // FREE / BUSY
    $scope.accessChange = function() {
    	$scope.access = $('#access:checked')[0] ? true : false;	
		window.clearTimeout($scope.timeout);						// clear timeout after change
		$scope.update();											// start new timeout
    };

    $scope.logout = function() {
    	AuthenticationService.logout();
	};

    window.scope = $scope;
    $scope.statusChange();
    $scope.update();
}]);