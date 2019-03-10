<?php

include 'config.php';

// if (    isset($_POST['name']) && 
//         isset($_POST['description']) && 
//         is_array($_POST['coordinates'])
//     ) {

    $name           = mysqli_real_escape_string($con, $_POST['name']);
    $description    = mysqli_real_escape_string($con, $_POST['description']);
    $type           = mysqli_real_escape_string($con, $_POST['type']);
    $coordinates    = is_array($con, $_POST['coords']);
    $table_name     = "geofence";

    $sql = "INSERT INTO geofence (name, description, type) VALUES ('$name', '$description', '$type')";

    if (mysqli_query($con, $sql)) {
        $last_id = mysqli_insert_id($con);
        
        while (!empty($coordinates)) {
            $coord = array_slice($coordinates,0,1);
            $coord_sql = "INSERT INTO coordinates 
                    (table_name, table_name_id, longitude, latitude) 
                    VALUES 
                    ('$table_name', '$last_id', '$coord[0]', '$$coord[1]')";
            if (!$result = mysqli_query($con, $coord_sql)) {
                exit(mysqli_error($con));
                echo json_encode("ERROR adding Coordinates: " . mysqli_error($con));
            }else {
                //echo json_encode($last_id);
                echo json_encode("ADDED Coordinates for GEOFENCE");
            }    
        }
        if (!$result = mysqli_query($con, $sql)) {
            exit(mysqli_error($con));
            echo json_encode("ERROR adding GEOFENCE: " . mysqli_error($con));
        }else {
           //echo json_encode($last_id);
            echo json_encode("ADDED GEOFENCE");
        }
    }else {
        exit(mysqli_error($con));
        echo json_encode("Error ADDING GEOFENCE:" . mysqli_error($con));
    }
// }

// close connection 
$con->close();

?>