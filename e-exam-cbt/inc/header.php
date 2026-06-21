<?php require_once 'database.php' ?>


<?php

$year = date('Y', time());

if(!logged_in()){
    redirect('login');
}

$reg_no = $_SESSION['reg_no'];

$student_id = $_SESSION['userid'];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title><?php echo getField('value','settings','4') ?></title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta content="" name="description" />
    <meta content="" name="author" />
    <link href="http://fonts.googleapis.com/css?family=Lato:300,400,400italic,600,700|Raleway:300,400,500,600,700|Crete+Round:400italic" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="themify-icons/themify-icons.min.css">


    <script src="js/jquery.min.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>

    <script src='js/tinymce.min.js'></script>

    <style>
        .tabtop .active a {
            background-color: #007aff!important;
            color: #FFF!important;
        }
        .tabtop .active a:before {
            content: "♦";
            position: absolute;
            top: 15px;
            left: 82px;
            color:  #007aff!important;
            font-size: 30px;
        }
        .tabtop li a:hover {
            color: #007aff !important;
        }
    </style>

</head>
<body>

