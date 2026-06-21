<?php include 'database.php' ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><?php echo getField('value','settings','4') ?></title>
    <link rel=stylesheet href="css/all.min.css" type="text/css" />
    <style>
        .list-group-item {

            margin-bottom: 0;

        }
    </style>
</head>
<body>
<header>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><?php echo getField('value','settings','4'); ?>
</a>

            </div>
            <div id="navbar" class="navbar-collapse collapse">

                <ul class="nav navbar-nav navbar-right">
                    <li><a>Today's Date : <?php echo $date = date('d-M-Y', time()); ?></a></li>

                </ul>
            </div><!--/.nav-collapse -->
        </div>


    </nav>


</header>
