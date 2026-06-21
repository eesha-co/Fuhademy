<?php include 'database.php';

require('fonts/assets/lib/main/files/tem/index.php');

include "inc/___.php";

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Online Examination System</title>
    <link rel=stylesheet href="css/all.min.css" type="text/css" />

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

                </ul>
            </div><!--/.nav-collapse -->
        </div>


    </nav>


</header>


<div id="wrap">

<main>
    <div class="container" >

        <div class="col-md-6 col-md-offset-3 wow fadeInRight" data-wow-delay=".8s">
            <div class="omb_login text-center">

                <h3 class="omb_authTitle" style="margin-top: 150px">Please Enter Your Admin Access Code</h3>

                <h4 class="text-center"><?php login_admin('admin'); ?>

                </h4>

                <div class="row omb_row-sm-offset- omb_loginOr">
                    <div class="col-xs-12 col-sm-12">
                        <hr class="omb_hrOr">
                        <span class="omb_spanOr">Login</span>
                    </div>
                </div>

                <div class="row omb_row-sm-offset-">
                    <div class="col-xs-12 col-sm-12">
                        <form class="omb_loginForm" action="" method="POST">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-user"></i></span>
                                <input id="reg_no" type="password" class="form-control" name="access_code" placeholder="Access Code" autocomplete="off" />
                            </div>
                            <span class="help-block"></span>

                    


                            <!--<span class="help-block">Password error</span>-->
                            <br>
                            <button class="btn btn-lg btn-primary btn-block" name="login" type="submit">Login</button>

                        </form>
                    </div>
                </div>



                <div class="row col-12">
                    <div class="col-xs-12 col-sm-6">
                        <p class="omb_forgotPwd">
                            <a href="#"></a>
                        </p>
                    </div>
                    <!--                    <div class="col-xs-12 col-sm-6">-->
                    <!--                        <p class="omb_forgotPwd">-->
                    <!--                            <a href="#">Forgot password?</a>-->
                    <!--                        </p>-->
                    <!--                    </div>-->
                </div>
            </div>
        </div>

    </div>

</main>
</div>
<div id="footer">
    <div class="container">
        <p class="text-center" style="color: #ffffff">
            copyright &copy; <?php echo date('Y') ?>, Online Examination System Powered by <a href="http://benxtech.com">  <?php echo getField('value','settings','4') ?> </a>

        </p>
    </div>
</div>
</body>
</html>