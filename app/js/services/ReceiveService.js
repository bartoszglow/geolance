app.factory("ReceiveService", ['$location', '$http', function($location, $http) {

	var table = [];

	receive = function() {
	    $http.post('/geolance/php/receive')
	       	.success(function(data, status, headers, config) {
	       		table = data;

		        for (var i = 0; i < table.length; i++) {
		            table[i].status = (new Date() - new Date(table[i].lastLogin)) > 60000 ? "offline" : "online"; 
		            table[i].state = table[i].status == "offline" ? "-" : table[i].state == 0 ? "bussy" : "free";
		        }

            });    
	};

	setInterval( receive, 1000);

	return {
		getData: function( properties ) {
			var temp = [];
			for (var i = 0; i < table.length; i++) {
				temp.push({});
	            for (var j = 0; j < properties.length; j++) {
	                temp[i][properties[j]] = table[i][properties[j]];
	            }
	        }
			return temp;
		}
	};
}]);