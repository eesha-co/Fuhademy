<?php include 'database.php';

$location = $_GET['type'];

// Set Session data to an empty array
$_SESSION = array();

// Destroy the session variables
unset($_SESSION['totalQus']);
session_destroy();
// Double check to see if their sessions exists

redirect(ROOT_URL.$location);
exit();
