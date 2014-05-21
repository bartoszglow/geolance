app.controller('ambulanceCtrl', ['$scope', '$location', '$http', 'AuthenticationService', function ($scope, $location, $http, AuthenticationService) {
	$scope.status = true;
	$scope.access = false;

	// var worker;

	// var blobURL = URL.createObjectURL( new Blob([ '(', function(){

	// 	console.log("POWSTAŁ WOREKR");
		
		
	// 	self.addEventListener("message", function(e) {
	// 	   args = e.data;

	// 	   console.log(args);
	// 	   console.log(args.status);
	// 	   // console.log(args.navi);

	// 	   if(args.navi) {
	// 	   		console.log("wspieram?");
	// 	   }

	// 	}, false);


	// 	function doSomething() {
	// 		if( $scope.status === true ) {
	// 			console.log("WORKER doSTH");
	// 		   //  navigator.geolocation.getCurrentPosition(
	// 		   //  	function(pos) {
	// 					// var updateInfo = {
	// 					// 	'username'  : AuthenticationService.getUsername(),
	// 			  //       	'access' 	: $scope.access === false ? 0 : 1,
	// 			  //       	'latitude'	: pos.coords.latitude,
	// 			  //       	'longitude' : pos.coords.longitude,
	// 			  //       	'accuracy'	: pos.coords.accuracy
	// 			  //       };
	// 			  //       console.log('UPLOADUJE:');
	// 			  //       console.log(updateInfo);
	// 	    //     		$http.post('php/update.php', updateInfo);
	// 		   //  	}
	// 		   //  );
	// 		}
	// 	}
	// 	// setTimeout( doSomething, 3000 );
	// }.toString(), ')()' ], { type: 'application/javascript' } ) );

	// // Won't be needing this anymore
	// // URL.revokeObjectURL( blobURL );



	$scope.update = function() {
			// URL.revokeObjectURL( blobURL );
			// worker = new Worker( blobURL );
			// worker.postMessage( { 
			// 	'status': $scope.status,
			// 	'status2' :  $scope.status,
			// 	// 'navi' : navigator.geolocation
			// });
			

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
			        console.log('UPLOADUJE:');
			        console.log(updateInfo);
	        		$http.post('php/update.php', updateInfo);
					$scope.timeout = setTimeout($scope.update,5000);
					
					

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