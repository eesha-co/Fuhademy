
<?php require_once("inc/header.php"); ?>

<div id="app">

    <?php require_once("inc/sidebar.php"); ?>

    <div class="app-content">

        <?php
        require_once("inc/nav.php");
        ?>
        <div class="main-content">
            <div class="wrap-content" id="container">
                <div class="col-md-12">

                    <div class="row">
                        <div class="panel panel-default">


                                                    <?php


                        $query = "SELECT * FROM students WHERE reg_no = '{$reg_no}' LIMIT 1";
                        $select_user_query = mysqli_query($connection, $query);

                        if(!$select_user_query){
                            die("QUERY FAILED". mysqli_error($connection));
                        }

                        while($row = mysqli_fetch_array($select_user_query)) {
                            $st_id = $row['id'];
                            $first_name = $row['first_name'];
                            $last_name = $row['last_name'];
                            $name = $first_name . ' ' . $last_name;
                            $matric_no = $row['reg_no'];
                            $email = $row['email'];
                            $phone = $row['phone'];
                            $u_institution = $row['institution'];
                            $passport = $row['profile_pic'];

//                            $department = $row['department'];
                        }
                            ?>






                                        <div class="panel-heading">
                                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                            <h4 class="modal-title custom_align" id="Heading">Edit Users Information</h4>
                                        </div>

                                        <form action="" class="row" enctype="multipart/form-data" method="post">

                                                <div class="panel-body">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>Reg No</label>
                                                            <input disabled class="form-control " name="reg_no" value="<?php echo $reg_no ?>" type="text" placeholder="Pls Enter Your First Name">
                                                        </div>

                                                        <div class="form-group">
                                                            <label>First Name</label>
                                                            <input class="form-control " name="first_name" value="<?php echo $first_name ?>" type="text" placeholder="Pls Enter Your First Name">
                                                        </div>

                                                        <div class="form-group">
                                                            <label>Last Name</label>
                                                            <input class="form-control " name="last_name" value="<?php echo $last_name ?>" type="text" placeholder="Pls Enter Your Last Name">
                                                        </div>


                                                        <div class="form-group">
                                                            <label>Phone</label>
                                                            <input class="form-control " name="phone" value="<?php echo $phone ?>" type="text" placeholder="Pls Enter Your Phone Number">
                                                        </div>


                                                        <div class="form-group">
                                                            <label for="gender">Gender</label>
                                                            <select required class="form-control" name="gender" id="gender">

                                                                <?php if($gender != ""){ ?>
                                                                    <option value="<?php echo $gender; ?>"><?php echo $gender; ?></option>
                                                                <?php }else { ?>

                                                                    <option value="Male">Male</option>

                                                                    <option value="Female">Female</option>

                                                                <?php } ?>






                                                            </select>
                                                        </div>

                                                        <div class="form-group">
                                                            <label>Email Address</label>
                                                            <input class="form-control " name="email" value="<?php echo $email ?>"  type="email" placeholder="Pls Enter Your email Address">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">




                                                                                    <div class="form-group">
                                                                                        <label class="row col-sm-6 control-label" for="textinput">Passport : <span class="text-danger">*</span></label>
                                                                                        <div class="row col-sm-6">
                                                                                            <div class="panel panel-default">
                                                                                                <div class="panel-body">
                                                                                                    <img class="img-responsive" src="images/<?php echo $passport ?>">

                                                                                                    <input type="file" name="passport" id="passport" value=""  class="form-control" placeholder="Passport" tabindex="1">


                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                               <br>




                                                    </div>

                                                </div>



                                            <div class="panel-footer ">

                                                <input type="submit" class="btn btn-success" name="submit" value="submit" />

                                                <br>
                                                <br>
                                                <br>
                                            </div>
                                        </form>

                                    <!-- /.modal-content -->






                        </div>

                    </div>

                </div>
            </div>
        </div>


    </div>

    <?php


    if(isset($_POST['submit'])) {

        $s_phone = sanitize($_POST['phone']);
        $s_reg_no = sanitize(strtoupper($_POST['reg_no']));
        $s_email = sanitize($_POST['email']);
        $gender = sanitize($_POST['gender']);

        $first_name = sanitize($_POST['first_name']);
        $last_name = sanitize($_POST['last_name']);


        $image = sanitize($_FILES['passport']['name']);

        if(strlen($image) > 3){
            $image_temp = sanitize($_FILES['passport']['tmp_name']);
            $target_dir = "images/";
            $target_file = $target_dir . basename($_FILES["passport"]["name"]);


            $move = move_uploaded_file($_FILES["passport"]["tmp_name"], $target_file);

        }else {
            $image = $passport;
        }



        if($phone == ""){
            if (user_exit('students', 'phone', $s_phone ) > 0) {

                $errors[] = "Sorry, The Phone No  $s_phone  is already In Use.";

            }

        }

        if($reg_no != $s_reg_no){
            if (user_exit('students', 'reg_no', $s_reg_no ) > 0) {

                $errors[] = "Sorry, The Reg No  $s_reg_no  is Already Registered.";

            }

        }

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $errors[] = 'A valid Email Address is Required';
        }

        if($email == ""){
            if (user_exit('students', 'email', $s_email) > 0) {

                $errors[] = 'Sorry, The Email Address \'' . $s_email . '\' is already in Use.';

            }
        }
        if (empty($errors) === true && empty($_POST) === false) {

            $query = "UPDATE students SET first_name = '$first_name', last_name = '$last_name', profile_pic = '$image', phone = '$s_phone', gender = '$gender', email = '$s_email' 
     WHERE id = $st_id";

            //Run query
            $update_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

            if($reg_no != $s_reg_no){
                redirect("logout.php?type=login.php");
            }
            redirect("profile");
        }

// else {
//             output_errors($errors);
//         }

    }

    if(isset($_POST['updatePass'])){

        $image = sanitize($_FILES['passport']['name']);
        $image_temp = sanitize($_FILES['passport']['tmp_name']);


        $target_dir = "images/";
        $target_file = $target_dir . basename($_FILES["passport"]["name"]);

        $move = move_uploaded_file($_FILES["passport"]["tmp_name"], $target_file);


        if(!$move){

            $errors[] = 'Image Upload Failed';

        }

        if (empty($errors) === true){
            $update_query = "UPDATE students SET profile_pic = '$image' WHERE reg_no = '$reg_no' ";

            $update_pass = $mysqli->query($update_query) or die($mysqli->error.__LINE__);

            header('Location: '.$_SERVER['PHP_SELF']);
            exit;
        }
    }



    ?>

    <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


    <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>

<?php include "inc/footer.php"; ?>