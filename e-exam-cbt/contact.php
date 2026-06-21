
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Online Examination System</title>
    <link rel=stylesheet href="css/bootstrap.min.css" type="text/css" />

    <link rel=stylesheet href="css/style.css" type="text/css" />
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel=stylesheet href="css/sticky-footer-navbar.css" type="text/css" />

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
                <a class="navbar-brand" href="#">Online Examination System</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">

                <ul class="nav navbar-nav navbar-right">
                    <li><a>Today's Date : <?php echo $date = date('d-M-Y', time()); ?></a></li>
                    <li>
                            <a href="logout.php?type=login.php" class="bg-success pull-right">Logout</a>

                    </li>

                </ul>
            </div><!--/.nav-collapse -->
        </div>


    </nav>


</header>
<div id="wrap">
    <div class="container" style="margin-top: 10px">

    </div>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">

                   <div class="alert alert-danger">
                       <h1 class="text-center">Opps</h1>
                       <h3>Technical Support Needed, Please Contact Benx Technologies</h3>
                       <p>visit <a href="http://benxtech.com">Benxtech official website</a> </p>
                       <p>Or Call : 08131652852, 07035842901</p>
                       </div>
                </div>

            </div>
        </div>


</div>

</main>

</div>


<div id="footer">
    <div class="container">
        <p class="text-center" style="color: #ffffff">
            copyright &copy; 2018, Online Examination System Designed by Kenubia Emmanuel(NOU150135198)

        </p>
    </div>
</div>
</body>
</html>