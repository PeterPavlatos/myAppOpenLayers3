<?php

include 'config.php';

$sql = mysqli_query($con, "SELECT geofence.id, geofence.name, geofence.type, geofence.description, coordinates.longitude, coordinates.latitude
	                        FROM geofence 
                            INNER JOIN coordinates 
                            ON coordinates.table_name = 'geofence' 
                            AND coordinates.table_name_id = geofence.id"
                            );


$data = array();

while ($row = mysqli_fetch_array($sql)) {
		 $data[] = array(
			 	"id"=> $row['id'],
                "name"=>$row['name'],
                "type"=>$row['type'],
				"description"=>$row['description'],
				"latitude"=>$row['latitude'],
				"longitude"=>$row['longitude']
				
			);
}

echo json_encode($data);

// close connection 
$con->close();
?>