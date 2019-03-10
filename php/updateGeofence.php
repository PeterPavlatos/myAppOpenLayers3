<?php

include 'config.php';

if (    isset($_POST['id']) && 
        isset($_POST['name']) && 
        isset($_POST['description']) 
    ) {

        // set variables 
        $table_name = "geofence";
        $id =          mysqli_real_escape_string($con, $_POST['id']);
        $name =        mysqli_real_escape_string($con, $_POST['name']);
        $description = mysqli_real_escape_string($con, $_POST['description']);
      
        // Update User details 
        $sql = "UPDATE geofence set name = '$name', description = '$description' WHERE id = '$id'";
        if (mysqli_query($con, $sql)) {
            echo json_encode("Updated GEOFENCE");
        }else {
            exit(mysqli_error($con));
            echo json_encode("Error updating GEOFENCE:" . mysqli_error($con));
        }

}

// close connection 
$con->close();

?>