<?php

include 'config.php';


$sql = mysqli_query($con, "SELECT poi.id, poi.name, poi.description, poi.img, coordinates.longitude, coordinates.latitude
	FROM poi 
INNER JOIN coordinates ON coordinates.table_name = 'poi' AND coordinates.table_name_id = poi.id");


$data = array();

while ($row = mysqli_fetch_array($sql)) {
		 $data[] = array(
			 	"id"=> $row['id'],
				"name"=>$row['name'],
				"description"=>$row['description'],
				"latitude"=>$row['latitude'],
				"longitude"=>$row['longitude'],
				"img"=>$row['img']
			);
}

echo json_encode($data);

// close connection 
$con->close();
?>