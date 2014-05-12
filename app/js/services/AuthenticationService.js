app.factory("AuthenticationService", ['$location', function($location) {

	return {
		login: function(credentials) {	
	        if( credentials.username === "dispatcher" && credentials.password === "password") {
	            console.log($location);
	            $location.path('/map');
	        }
	        if( credentials.username === "ambulance" && credentials.password === "password") {
	            console.log($location);
	            $location.path('/ambulance');
	        }
		},
		logout: function() {

		}
	};
}]);