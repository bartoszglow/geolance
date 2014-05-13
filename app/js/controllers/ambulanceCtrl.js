app.controller('ambulanceCtrl', ['$scope', '$location', '$http', 'AuthenticationService', function ($scope, $location, $http, AuthenticationService) {
	$scope.status = true;
	$scope.access = false;
	$scope.position = {};

	$scope.update = function() {
		if( $scope.status === true ) {
			$scope.timeout = setTimeout($scope.update,10000);
						
		    navigator.geolocation.getCurrentPosition(
		    	function(pos) {
		    		$scope.position.latitude  = pos.coords.latitude;
		    		$scope.position.longitude = pos.coords.longitude;
		    		$scope.position.accuracy  = pos.coords.accuracy;
		    	}
		    );

			var updateInfo = {
				'username'  : AuthenticationService.getUsername(),
        		'access' 	: $scope.access === false ? 0 : 1,
        		'latitude'	: $scope.position.latitude,
        		'longitude' : $scope.position.longitude,
        		'accuracy'	: $scope.position.accuracy
			};		    

			console.log(updateInfo);

	        $http.post('/geolance/php/update', updateInfo);
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
    };

    $scope.logout = function() {
    	AuthenticationService.logout();
	};

    window.scope = $scope;
    $scope.statusChange();
    $scope.update();
}]);