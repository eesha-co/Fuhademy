
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

                            <div class="panel-body" id="Add">

                                <div class="col-md-6">
                                    <?php

                                    if(isset($_POST['submit'])) {

                                        $s_phone = sanitize($_POST['phone']);
                                        $s_reg_no = sanitize(strtoupper($_POST['reg_no']));
                                        $s_email = sanitize($_POST['email']);
                                        $gender = sanitize($_POST['gender']);

                                        $first_name = sanitize($_POST['first_name']);
                                        $last_name = sanitize($_POST['last_name']);

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


                                            $query = "UPDATE students SET first_name = '$first_name', reg_no = '$s_reg_no', last_name = '$last_name', phone = '$s_phone', gender = '$gender', email = '$s_email' 
     WHERE id = $student_id";

                                            //Run query

                                            $update_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

                                            if($reg_no != $s_reg_no){
                                                redirect("logout.php?type=login.php");
                                            }
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

                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4 class="text-center">Exam Instruction</h4>


                                        </div>
                                        <div class="panel-body">




                                            <?php if($ced): ?>
                                                <div class="row">
                                                    <?php

                                                    if(isset($_POST['submit'])){ ?>


                                                        <?php if(isset($errors)){
                                                            echo output_errors($errors);
                                                        } else if (empty($errors) === true){ ?>

                                                            <div class='alert alert-success alert-dismissible text-center'>
                                                                <a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>
                                                                <strong>Success!</strong> Your Information Has Been Updated Successfully .<br>
                                                                <p class='text-center'>Pls Refresh To See Changes <a href=''> <i class='fa fa-refresh'></i></a></p>
                                                            </div>
                                                        <?php } } ?>


                                                    <div class="col-md-6">
                                                        <button class="btn  btn-primary btn-sm" data-title="Edit" data-toggle="modal" data-target="#editInfo" >Edit Registration Details <span class="fa fa-edit"></span></button>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <button class="btn btn-success btn-sm pull-right" data-title="Edit" data-toggle="modal" data-target="#editPass" >Update Passport <span class="fa fa-edit"></span></button>
                                                    </div>
                                                </div>
                                            <?php endif; ?>



                                            <div style="">

                                                <ul class="list-group">
                                                    <li class="list-group-item">No student shall assist another student, or be assisted by a fellow-student or any other person.</li>
                                                    <li class="list-group-item">Students will be required to initial the attendance register before writing each exam.   </li>
                                                    <li class="list-group-item">Time allowed for each exam will be clearly indicated on the exam interface     </li>
                                                    <li class="list-group-item">Cell-phones are not permitted in the exam venue, whether on your person or not. They will not be kept for you during the exam.   </li>
                                                    <li class="list-group-item">Normal standards regarding appearance apply. You may be excluded from the exam hall until such time as your appearance is satisfactory.</li>
                                                    <li class="list-group-item">Toilet breaks during an exam are not permitted.</li>
                                                    <li class="list-group-item">The instructions of any invigilator are to be obeyed.</li>
                                                    <li class="list-group-item">Leave the exam hall quickly and quietly. Remember to take all your belongings with you. (Remember to collect all your                                     belongings from holding rooms.)</li>
                                                    <li class="list-group-item">You must remain silent until after you have exited the building.  </li>
                                                </ul>
                                            </div>

                                            <hr class="row">


                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <p>Keyboard Usage</p>
                                        </div>
                                        <div class="panel-body">
                                            <ul class="list-styled">
                                                <li class="list-item"><button class="btn btn-primary">A</button> Select Option A</li><br>
                                                <li class="list-item"><button class="btn btn-primary">B</button> Select Option B</li><br>
                                                <li class="list-item"><button class="btn btn-primary">C</button> Select Option C</li><br>
                                                <li class="list-item"><button class="btn btn-primary">D</button> Select Option D</li><br>
                                                <li class="list-item"><button class="btn btn-primary">E</button> Select Option E</li><br>
                                                <li class="list-item"><button class="btn btn-primary">N</button> Next Question</li><br>
                                                <li class="list-item"><button class="btn btn-primary">P</button> Previous Question</li><br>
                                                <li class="list-item"><button class="btn btn-default"><span class="fa fa-arrow-right"></span></button> Next Question</li><br>
                                                <li class="list-item"><button class="btn btn-default"><span class="fa fa-arrow-left"></span></button> Previous Question</li><br>
                                                <li class="list-item"><button class="btn btn-danger">S</button> Submit Exam</li><br>
                                            </ul>
                                        </div>
                                    </div>


                                </div>

                            </div>


                        </div>

                    </div>

                </div>
            </div>
        </div>


    </div>



    <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


    <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>

    <script>


        $(document).ready(function(){
            $(".delete_link").on('click', function(){
                var id = $(this).attr("rel");

                var delete_url = "registered_exam.php?delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#mModal").modal('show');


            });
        });


    </script>

<?php include "inc/footer.php"; ?>