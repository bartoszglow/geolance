app.factory("ReceiveService", ['$location', '$http', function($location, $http) {

	var table = [];

	receive = function() {
	    $http.post('/geolance/php/receive')
	       	.success(function(data, status, headers, config) {
	       		table = data;
            });    
	};

	setInterval( receive, 1000);

	return {
		getData: function() {
			return table;
		}
		
	};
}]);