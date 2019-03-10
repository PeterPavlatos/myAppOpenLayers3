<?php

/* CONNECTION TO wamp  db */


$con = mysqli_connect($host, $user, $password, $dbname);
// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
// if (!$con) {
//  die("Connection failed: " . mysqli_connect_error());
// }
?>
