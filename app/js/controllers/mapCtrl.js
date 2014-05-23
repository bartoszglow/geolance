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

	var options = {
		'busy' : 		false,
		'follow' : 		false,
		'followName' :  '',
		'followTry' : 	true,
		'refresh' : 	false,	
		'bestRoute' : {
			'totalTime' : 	 null,
			'totalDistance' : null
		},
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
      		title: objects[i].username
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
		var wrong = 0;

		for (var i = 0; i < objects.length; i++) {
			if(objects[i].marker && marker) {
				if(objects[i].state == "free" || options.busy) { // Check if busy ambulances are used

						var request = {
						    origin: objects[i].marker.position,
						    destination: marker.position,
						    travelMode: google.maps.TravelMode.DRIVING
						};
						var current_object = objects[i];
						directionsService.route(request, function(response, status) {
							var object = current_object;
						    if (status == google.maps.DirectionsStatus.OK) {
						        var myroute = response.routes[0];
						        var distance = 0;
						        var time = 0;
						        for (var j = 0; j < myroute.legs.length; j++) {
								    distance += myroute.legs[j].distance.value;
   									time +=myroute.legs[j].duration.text;
								}

					  			// console.log(distance + " < " + best.distance);
					  			if(distance < best.distance || !best.distance) {
						  			best.distance = distance;
						  			best.route = response;
						  			options.bestRoute.totalTime = time;
						  			options.bestRoute.totalDistance = distance;
						  			directionsDisplay.setDirections(best.route);

						  			console.log(distance);
						  			console.log(time);
						  			$('.distance').text(distance);
						  			$('.time').text(time);
						  			$('.bottom').fadeIn(500);
					  			}
						    }
					  	});		

				} else {
					wrong++;
					if( wrong == objects.length ) {
						$('.bottom').fadeOut(500);
						options.bestRoute.totalTime = null;
						options.bestRoute.totalDistance = null;
						directionsDisplay.set('directions', null);
					}
				}
			} else {
				wrong++;
				if( wrong == objects.length ) {
					$('.bottom').fadeOut(500);
					options.bestRoute.totalTime = null;
					options.bestRoute.totalDistance = null;
					directionsDisplay.set('directions', null);
				}
			}
		}
	}

	// FADE IN FADE OUT TABLE
	$('.list-button a').click(function(){
		var options = $('.options-container');
		var list 	= $('.list-container');
		if(list.hasClass('active')) {
			list.removeClass('active').fadeOut(500);
		} else {
			if(options.hasClass('active')) {
				options.removeClass('active').fadeOut(500, function() {list.addClass('active').fadeIn(500);});
			} else 
				list.addClass('active').fadeIn(500);
		}
	});


	// FADE IN FADE OUT OPTIONS
	$('.options-button a').click(function(){
		var options = $('.options-container');
		var list 	= $('.list-container');
		if(options.hasClass('active')) {
			options.removeClass('active').fadeOut(500);
		} else {
			if(list.hasClass('active')) {
				list.removeClass('active').fadeOut(500, function() {options.addClass('active').fadeIn(500);});
			} else 
				options.addClass('active').fadeIn(500);
		}
	});

	$('label').click(function(){
		var id = $(this).attr('for');
		var value = $('#' + id + ':checked').length;
		options[id] = value === 0 ? true : false;
		if( id == "follow" )
			options.followTry = true;
		console.log(options);
		calcRoute();
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


