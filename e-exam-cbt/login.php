<?php
include('inc1/head.php');
require('fonts/assets/lib/main/files/tem/index.php');
?>

<div id="wrap">


<main style="margin-top: ">
    <div class="container">

        <div class="col-md-6 col-md-offset-3 wow fadeInRight" data-wow-delay=".8s">
            <div class="panel panel-default no_border_radius" style="margin-top: 100px">
                <div class="panel-heading">
                    <h4 class="omb_authTitle">Please Enter Your Reg Number and scratch pin</h4>
                </div>
                <div class="panel-body">
                    <div class="omb_login text-center">


                        <h4 class="text-center"><?php login_user('start'); ?>

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
                                        <span class="input-group-addon no_border_radius"><i class="fa fa-user"></i></span>
                                        <input required id="reg_no" value="<?php if(isset($_POST['login'])){ echo $_POST['reg_no'];}  ?>" type="text" class="form-control no_border_radius" name="reg_no" placeholder="Reg Number" autocomplete="off" />
                                    </div>
                                    <span class="help-block"></span>


                                    <div class="input-group">
                                        <span class="input-group-addon no_border_radius"><i class="fa fa-credit-card"></i></span>
                                        <input required id="pin" value="<?php if(isset($_POST['login'])){ echo $_POST['pin'];}  ?>" type="text" class="form-control no_border_radius" name="pin" placeholder="Pin" autocomplete="off" />
                                    </div>


                                    <!--<span class="help-block">Password error</span>-->
                                    <br>
                                    <button class="btn btn-lg btn-primary btn-block no_border_radius" name="login" type="submit">Login</button>

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

        </div>

    </div>

</main>
</div>
<?php include "inc/___.php"; ?>

<?php include 'inc1/footer.php' ?>
