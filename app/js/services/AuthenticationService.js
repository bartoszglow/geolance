app.factory("AuthenticationService", ['$location', '$http', function($location, $http) {

	var userInfo = {};

	return {
		login: function(credentials) {	
			alert(credentials.username + " " + credentials.password);

	        if( credentials.username === "dispatcher" && credentials.password === "password") {
	            console.log($location);
	            $location.path('/map');	
	        } else {
	        	$http.post('/geolance/php/login', {'username': credentials.username, 'password': credentials.password})
	        		.success(function(data, status, headers, config) {
                        if (data.username !== '') {
                        	userInfo = data;
	            			$location.path('/ambulance');	
                        }
                        else {
                            alert(data);
                            console.log(data);
                        }})
                    .error(function(data, status) { 	// called asynchronously if an error occurs
														// or server returns response with an error status.
                        alert(status);
                    });
            }
		},
		logout: function() {

		}
	};
}]);