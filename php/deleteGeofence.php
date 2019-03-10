<?php

include 'config.php';

$id = mysqli_real_escape_string($con, $_POST['id']);
$table_name = "geofence";
$sql1 = "DELETE FROM geofence WHERE id = '$id'";
$sql2 = "DELETE FROM coordinates WHERE table_name_id = '$id'";

if (isset($_POST['id'])){
    // delete User
    if (mysqli_query($con, $sql1)) {
        if (mysqli_query($con, $sql2)){
            echo json_encode("Deleted geofence");
        }else{
            echo json_encode("ERROR deleting  COORDINATES: " . mysqli_error($con));
        }
    } else {
        echo json_encode("ERROR deleting  geofence: " . mysqli_error($con));
    }
}
    
// close connection 
$con->close();

?>