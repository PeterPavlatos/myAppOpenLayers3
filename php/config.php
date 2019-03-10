<?php

/* CONNECTION TO wamp  db */
$host = "localhost";
$user = "root";
$password = "password";
$dbname = "openlayers";

// CONNECTION TO peterpavlatos.ca db
// $host = "localhost"; /* Host name */
// $user = "ppavlatos2016"; /* User */
// $password = "Apollo1855!!"; /* Password */
// $dbname = "tapis_homa"; /* Database name */

$con = mysqli_connect($host, $user, $password, $dbname);
// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
// if (!$con) {
//  die("Connection failed: " . mysqli_connect_error());
// }
?>
