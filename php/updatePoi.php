<?php

include 'config.php';

if (    isset($_POST['name']) && 
        isset($_POST['description']) && 
        isset($_POST['longitude']) &&
        isset($_POST['latitude']) &&
        isset($_POST['img'])     
    ) {

        // set variables 
        $table_name = "poi";
        $id =          mysqli_real_escape_string($con, $_POST['id']);
        $name =        mysqli_real_escape_string($con, $_POST['name']);
        $description = mysqli_real_escape_string($con, $_POST['description']);
        $longitude =   mysqli_real_escape_string($con, $_POST['longitude']);
        $latitude =    mysqli_real_escape_string($con, $_POST['latitude']);
        $img =         mysqli_real_escape_string($con, $_POST['img']);

        // Update User details 
        $sql = "UPDATE poi set name = '$name', description = '$description', img = '$img' WHERE id = '$id'";
        if (mysqli_query($con, $sql)) {
              /* Gets the id of the new row and insert into the other table */
            $sql = "UPDATE coordinates set longitude = '$longitude', latitude = '$latitude' WHERE table_name_id = '$id'";
                
            if (!$result = mysqli_query($con, $sql)) {
                exit(mysqli_error($con));
                echo json_encode("Error updating POI:" . mysqli_error($con));
            }else {
                echo json_encode("Updated POI");
            }
        }else {
            exit(mysqli_error($con));
            echo json_encode("Error updating POI:" . mysqli_error($con));
        }

     
}

// close connection 
$con->close();

?>