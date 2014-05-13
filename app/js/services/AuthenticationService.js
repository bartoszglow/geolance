app.factory("AuthenticationService", ['$location', '$http', '$q', function($location, $http, $q) {

	var userInfo = {};

	return {
		login: function(credentials) {	
			var q = $q.defer();

	        if( credentials.username === "dispatcher" && credentials.password === "password") {
	            console.log($location);
	            $location.path('/map');	
	        } else {
	        	$http.post('/geolance/php/login', {'username': credentials.username, 'password': credentials.password})
	        		.success(function(data, status, headers, config) {
                        if (data.username !== '') {
                        	userInfo = data;
	            			$location.path('/ambulance');	
	            			q.resolve();
                        }
                        else {
                            q.reject(data.error);
                        }})
                    .error(function(data, status) { 	// called asynchronously if an error occurs
														// or server returns response with an error status.
                    });
            }

            return q.promise;
		},
		logout: function() {
	        $location.path('/');	
		},
		getUsername: function() {
			return userInfo.username;
		}
	};
}]);