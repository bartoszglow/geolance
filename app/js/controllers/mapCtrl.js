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
	    suppressMarkers: true,
	    polylineOptions: {strokeColor:'#c0392b'}
	};

	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	var directionsService = new google.maps.DirectionsService();
	var map;
	var marker;				// touch event marker
	var objects;			// table of ambulances
	var poznan = new google.maps.LatLng(52.411629, 16.933938);

	var featureOpts = [
    	{
		    featureType: 'road',
		    elementType: 'all',
		    stylers: [
		        { color: '#1abc9c' },
		        { saturation: 60 },
		        { lightness: -20 },
        		{ visibility: 'simplified' },
	      	]
    	},
    	{
		    featureType: 'road',
		    elementType: 'labels',
		    stylers: [
        		{ visibility: 'off' },
	      	]
    	},
    	{
		    featureType: 'landscape',
		    elementType: 'labels',
		    stylers: [
        		{ visibility: 'off' },
	      	]
    	},
    	{
		    featureType: 'landscape',
		    stylers: [
		        { color: '#ecf0f1' },
	      	]
    	},
  	];

	function initialize() { 

		setInterval( function() {
		    objects = ReceiveService.getData( properties );
		    for (var i = 0; i < objects.length; i++) {
		        placeAmbulance(i, new google.maps.LatLng(objects[i].latitude, objects[i].longitude));
		    }
		}, 2000);

		var styledMapOptions = {
		    name: 'Custom Style'
		};

		var MY_MAPTYPE_ID = 'custom_style';
		
		var mapOptions = {
		    zoom: 13,
		    center: poznan,
		    mapTypeControlOptions: {
		      	mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		    },
		    mapTypeId: MY_MAPTYPE_ID
		};

	  	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

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
		objects[i].marker = objects[i].status == "offline" ? null : new google.maps.Marker({
		    position: location, 
		    map: map,
      		icon: objects[i].state == "free" ? 'images/spotlight-poi-green.png' : 'images/spotlight-poi-blue.png',
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
      		icon: 'images/spotlight-poi.png',
		    draggable: true,
		    animation: google.maps.Animation.BOUNCE
		});
	}

	function calcRoute() {
		var best = {};
		var calc = 0;

		for (var i = 0; i < objects.length; i++) {
			if(objects[i].marker) {
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


