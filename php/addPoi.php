<?php

include 'config.php';

if (    isset($_POST['name']) && 
        isset($_POST['description']) && 
        isset($_POST['longitude']) &&
        isset($_POST['latitude']) &&
        isset($_POST['img'])     
    ) {

    $table_name = "poi";
    $name =        mysqli_real_escape_string($con, $_POST['name']);
    $description = mysqli_real_escape_string($con, $_POST['description']);
    $longitude =   mysqli_real_escape_string($con, $_POST['longitude']);
    $latitude =    mysqli_real_escape_string($con, $_POST['latitude']);
    $img =         mysqli_real_escape_string($con, $_POST['img']);

    $sql = "INSERT INTO poi (name, description, img) VALUES ('$name', '$description', '$img')";

    if (mysqli_query($con, $sql)) {
        $last_id = mysqli_insert_id($con);

        /* Gets the id of the new row and inserts into the other table */
        $sql = "INSERT INTO coordinates (table_name, table_name_id, longitude, latitude) VALUES ('$table_name', '$last_id', '$longitude', '$latitude')";

        if (!$result = mysqli_query($con, $sql)) {
            exit(mysqli_error($con));
            echo json_encode("ERROR adding POI: " . mysqli_error($con));
        }else {
            echo json_encode("Added POI");
        }
    }else {
        exit(mysqli_error($con));
        echo json_encode("Error ADDING POI:" . mysqli_error($con));
    }
}

// close connection 
$con->close();

?>