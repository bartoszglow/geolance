app.controller('mapCtrl', ['$scope', 'ReceiveService', function ($scope, ReceiveService) {

    var properties = [
        "username",
        "state",
        "status",
        "latitude",
        "longitude"
    ];

	var rendererOptions = {
	    draggable: true,
	    suppressMarkers: true
	};

	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	var directionsService = new google.maps.DirectionsService();
	var map;
	var marker;				// touch event marker
	var objects;			// table of ambulances
	var poznan = new google.maps.LatLng(52.411629, 16.933938);

	function initialize() { 

		setInterval( function() {
		    objects = ReceiveService.getData( properties );
		    for (var i = 0; i < objects.length; i++) {
		        placeAmbulance(i, new google.maps.LatLng(objects[i].latitude, objects[i].longitude));
		    }
		}, 5000);

		var mapOptions = {
		    zoom: 13,
		    center: poznan
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		directionsDisplay.setMap(map);
		// directionsDisplay.setPanel(document.getElementById('directionsPanel'));

		google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		    // computeTotalDistance(directionsDisplay.getDirections());
		});

		google.maps.event.addListener(map, 'click', function(event) {
		   	placeMarker(event.latLng);
			calcRoute();
		});
	}

	function placeAmbulance(i, location) {
		if(objects[i].marker) {
			if(objects[i].marker.position.A == location.A && objects[i].marker.position.k == location.k) {
				return false;
			}
			objects[i].marker.setMap(null);
			objects[i].marker = null;
		}
		objects[i].marker = new google.maps.Marker({
		    position: location, 
		    map: map
		});
		// console.log(objects[i].marker);
	}

	function placeMarker(location) {
		if(marker) {
			marker.setMap(null);
			marker = null;
		}
		marker = new google.maps.Marker({
		    position: location, 
		    map: map,
		    draggable: true,
		    animation: google.maps.Animation.BOUNCE
		});
	}

	function calcRoute() {
		var best = {};
		var calc = 0;

		for (var i = 0; i < objects.length; i++) {
			var request = {
			    origin: objects[i].marker.position,
			    destination: marker.position,
			    travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(response, status) {
			    if (status == google.maps.DirectionsStatus.OK) {
		  			calc++;
			        var myroute = response.routes[0];
			        var distance = 0;
			        for (var i = 0; i < myroute.legs.length; i++) {
					    distance += myroute.legs[i].distance.value;
					}

		  			console.log(distance + " < " + best.distance);
		  			if(distance < best.distance || !best.distance) {
		  				best.distance = distance;
		  				best.route = response;
		  				directionsDisplay.setDirections(best.route);
		  			}
			    }
		  	});
		}


		// computeTotalDistance(temp_route);




			// directionsService.route(request, function(response, status) {
			//     if (status == google.maps.DirectionsStatus.OK) {
			//         directionsDisplay.setDirections(response);
			//     }
		 //  	});
		
	}

	function computeTotalDistance(result) {
		var total = 0;
		var myroute = result.routes[0];
		for (var i = 0; i < myroute.legs.length; i++) {
		    total += myroute.legs[i].distance.value;
		}
		total = total / 1000.0;
		document.getElementById('total').innerHTML = total + ' km';
		return total;
	}

	google.maps.event.addDomListener(window, 'load', initialize);










	



}]);


