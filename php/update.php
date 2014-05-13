<?php

	$data 		= json_decode(file_get_contents("php://input"));
	$username 	= mysql_real_escape_string($data->username);
	$state	 	= mysql_real_escape_string($data->access);
	$latitude 	= mysql_real_escape_string($data->latitude);
	$longitude 	= mysql_real_escape_string($data->longitude);
	$accuracy 	= mysql_real_escape_string($data->accuracy);

	$link = mysql_connect('localhost', 'admin', '') or die('Could not connect: ' . mysql_error());
	mysql_select_db('test') or die('Could not select database' . mysql_errno());
	
	$query = 'UPDATE AMBULANCES SET `state` 	=  "' . $state . '" ,
									`latitude`  =  "' . $latitude . '" ,
									`longitude` =  "' . $longitude . '" ,
									`accuracy`  =  "' . $accuracy . '" 
									WHERE username = "' . $username . '" ';

	mysql_query($query) or die('Query failed: ' . mysql_error());

	// Closing connection
	mysql_close($link);

?>