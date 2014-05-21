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
	var marker;		// touch event marker
	var objects;			// table of ambulances
	var old_objects;
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

	google.maps.event.addDomListener(window, 'load', function() { setTimeout(initialize,500); });
	function initialize() { 

		setInterval( function() {
			old_objects = objects ? objects : ReceiveService.getData( properties );
		    objects = ReceiveService.getData( properties );
		    for (var i = 0; i < objects.length; i++) {
		        placeAmbulance(i, new google.maps.LatLng(objects[i].latitude, objects[i].longitude));
		    }
		    calcRoute();
		}, 5000);

		var styledMapOptions = {
		    name: 'Custom Style'
		};

		var MY_MAPTYPE_ID = 'custom_style';
		
		var mapOptions = {
		    zoom: 13,
		    center: poznan,
		    // mapTypeControlOptions: {
		    //   	mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		    // },
		    mapTypeId: MY_MAPTYPE_ID, 
	        zoomControlOptions: {
	        	style: 'SMALL'
	        },
	        mapTypeControlOptions: {
	        	position: 'BOTTOM_CENTER'
	        },
	        streetViewControlOptions: {
	        	position: 'BOTTOM_CENTER'
	        }
		};

	  	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

		directionsDisplay.setMap(map);
		// directionsDisplay.setPanel(document.getElementById('directionsPanel'));

		// google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {    
		// 	calcRoute();
		// });

		google.maps.event.addListener(map, 'click', function(event) {
		   	placeMarker(event.latLng);
		});

		var input = (document.getElementById('search-input'));

		var searchBox = new google.maps.places.SearchBox(input);

		google.maps.event.addListener(searchBox, 'places_changed', function() {
		    var places = searchBox.getPlaces();
		  
		    placeMarker(places[0].geometry.location);
		});

	}

	function placeAmbulance(i, location) {
		objects[i].marker = objects[i].status == "offline" ? undefined : new google.maps.Marker({
		    position: location, 
		    map: map,
      		icon: objects[i].state == "free" ? 'images/spotlight-poi-green.png' : 'images/spotlight-poi-blue.png',
		});
		setTimeout(function(){
			if(old_objects[i].marker) {
				old_objects[i].marker.setMap(null);
				old_objects[i].marker = undefined;
			}
		},50);
		
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
		google.maps.event.addListener(marker, 'click', function(event) {
		   	marker.setMap(null);
		   	marker = null;
		});
		calcRoute();
	}

	function calcRoute() {
		var best = {};
		var calc = 0;

		for (var i = 0; i < objects.length; i++) {
			if(objects[i].marker && marker) {
				var request = {
				    origin: objects[i].marker.position,
				    destination: marker.position,
				    travelMode: google.maps.TravelMode.DRIVING
				};
				directionsService.route(request, function(response, status) {
				    if (status == google.maps.DirectionsStatus.OK) {
				        var myroute = response.routes[0];
				        var distance = 0;
				        for (var i = 0; i < myroute.legs.length; i++) {
						    distance += myroute.legs[i].distance.value;
						}

			  			// console.log(distance + " < " + best.distance);
			  			if(distance < best.distance || !best.distance) {
				  			best.distance = distance;
				  			best.route = response;
				  			directionsDisplay.setDirections(best.route);
			  			}
				    }
			  	});
			} else {
				calc++;
				if( calc == objects.length ) {
					directionsDisplay.set('directions', null);
				}
			}
		}
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

	// FADE IN FADE OUT TABLE
	$('.list-button a').click(function(){
		var content = $('.list-container');
		if(content.hasClass('active')) {
			content.removeClass('active').fadeOut(1000);
		} else {
			content.addClass('active').fadeIn(1000);
		}
	});

	// FADE IN FADE OUT TABLE
	$('.options-button a').click(function(){
		var content = $('.options-container');
		if(content.hasClass('active')) {
			content.removeClass('active').fadeOut(1000);
		} else {
			content.addClass('active').fadeIn(1000);
		}
	});

	// SEARCH BOX ICON FOCUS
	$('#search-input').click(function(){
		$('#search-input').parent().addClass('focus');
	});
	$('.navbar').bind('click', function(e) {
	    if(e.target != $('#search-input')[0]) {
			$('#search-input').parent().removeClass('focus');
	    }
	});


}]);


