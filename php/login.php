<?php

	$data = json_decode(file_get_contents("php://input"));
	$username = mysql_real_escape_string($data->username);
	$password = mysql_real_escape_string($data->password);
	
	$link = mysql_connect('localhost', 'admin', '') or die('Could not connect: ' . mysql_error());
	mysql_select_db('test') or die('Could not select database' . mysql_errno());
	
	$query = 'SELECT * FROM AMBULANCES WHERE username = "' . $username . '" ';

	$result = mysql_query($query) or die('Query failed: ' . mysql_error());

	$line = mysql_fetch_array($result, MYSQL_ASSOC);

	if( $line["password"] == $password ) {	
        $arr = array(
        			'username' 	=> $line["username"], 
        			'state' 	=> $line["state"], 
        			'latitude' 	=> $line["latitude"],
        			'longitude' => $line["longitude"],
        			'accuracy' 	=> $line["accuracy"]
        		);
    	$jsn = json_encode($arr);
    	print_r($jsn);
	} else {
        $arr = array('username' => "", 'error' => 'Wrong password');
        $jsn = json_encode($arr);
        print_r($jsn);
	}

	mysql_free_result($result);

	// Closing connection
	mysql_close($link);

?>