<?php

	$data = json_decode(file_get_contents("php://input"));
	
	$link = mysql_connect('localhost', 'admin', '') or die('Could not connect: ' . mysql_error());
	mysql_select_db('test') or die('Could not select database' . mysql_errno());
	
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
        			'lastLogin'	=> $line["lastLogin"]
        		);
	   	array_push($result_array,$arr);
	}

    $jsn = json_encode($result_array);
    print_r($jsn);

	mysql_free_result($result);

	// Closing connection
	mysql_close($link);

?>