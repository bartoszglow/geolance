<?php

	date_default_timezone_set('UTC');

	$data = json_decode(file_get_contents("php://input"));
	
	$link = mysql_connect('localhost', 'root', '12CraC34') or die('Could not connect: ' . mysql_error());
	mysql_select_db('geolance') or die('Could not select database' . mysql_errno());
	
	$query = 'SELECT * FROM AMBULANCES';

	$result = mysql_query($query) or die('Query failed: ' . mysql_error());

	$result_array = array();

	while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
	   	$arr = array(
        			'username' 	=> $line["username"], 
        			'state' 	=> $line["state"], 
        			'latitude' 	=> $line["latitude"],
        			'longitude' => $line["longitude"],
        			'accuracy' 	=> $line["accuracy"],
        			'lastLogin'	=> $line["lastLogin"],
        			'time' 		=> date('Y-m-d H:i:s')
        		);
	   	array_push($result_array,$arr);
	}

    $jsn = json_encode($result_array);
    print_r($jsn);

	mysql_free_result($result);

	// Closing connection
	mysql_close($link);

?>