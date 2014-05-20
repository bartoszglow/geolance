<?php

	$data 		= json_decode(file_get_contents("php://input"));
	$username 	= $data->username;
	$state	 	= $data->access;
	$latitude 	= $data->latitude;
	$longitude 	= $data->longitude;
	$accuracy 	= $data->accuracy;

	$link = mysql_connect('localhost', 'root', '12CraC34') or die('Could not connect: ' . mysql_error());
	mysql_select_db('geolance') or die('Could not select database' . mysql_errno());
	
	$query = 'UPDATE AMBULANCES SET `state` 	=  "' . $state . '" ,
									`latitude`  =  "' . $latitude . '" ,
									`longitude` =  "' . $longitude . '" ,
									`accuracy`  =  "' . $accuracy . '" 
									WHERE username = "' . $username . '" ';

	mysql_query($query) or die('Query failed: ' . mysql_error());

	// Closing connection
	mysql_close($link);

?>