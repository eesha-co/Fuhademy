
<?php require_once("inc/header.php"); ?>
<?php

$_SESSION['exam_type'] = getField('value','settings','2');



$startYear = getField('value','settings','15');

$this_year = date('Y', time()) - 1;

$yearRange = range ($this_year,$startYear);

if(isset($_GET['y'])){
    $_SESSION['p_year'] = $_GET['y'];
}else {
    $_SESSION['p_year'] = $y = date('Y', time()) - 1;
}

$year = $_SESSION['p_year'];

$reg_no = strtoupper($_SESSION['reg_no']);

$student_id = $_SESSION['userid'];




?>


<?php
$c_query = "SELECT * FROM exams WHERE course_code = 'ENG' AND active = '1' AND year = '2018'  LIMIT 1";
$select_c_query = mysqli_query($connection, $c_query);

if(!$select_c_query){
    die("QUERY FAILED". mysqli_error($connection));
}

while($row = mysqli_fetch_array($select_c_query)) {

    $eng_exam_id = $row['id'];

}
?>


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
                                        $s_institution = sanitize($_POST['institution']);

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


                                            $query = "UPDATE students SET first_name = '$first_name', reg_no = '$s_reg_no', last_name = '$last_name', phone = '$s_phone', gender = '$gender', email = '$s_email', 
    institution = '$s_institution' WHERE id = $student_id";

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
                                            $update_querry = "UPDATE students SET profile_pic = '$image' WHERE reg_no = '$reg_no' ";

                                            $update_pass = $mysqli->query($update_query) or die($mysqli->error.__LINE__);
                                        }
                                    }


                                    ?>

                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4 class="text-center"><?php echo $year ?> Practice Test</h4>


                                        </div>
                                        <div class="panel-body">

                                            <form action="" class="form-horizontal">
                                                <div class="form-group ">

                                                    <label class="col-md-4" >Select Year</label>

                                                    <div class="col-md-8">
                                                        <select class="form-control" onchange="location = this.value;" name="exam_year">
                                                            <?php if(isset($_GET['y'])){ ?>
                                                                <option><?php echo $year ?></option>
                                                            <?php } else { ?>
                                                                <option>Select Year</option>
                                                            <?php } ?>
                                                            <?php
                                                            foreach($yearRange as $thisYear)
                                                            {
                                                                echo "<option  value='practice_test.php?y=$thisYear'>$thisYear</option>";
                                                            } ?>
                                                        </select>
                                                    </div>


                                                </div>

                                            </form>

                                            <hr class="row">
                                            <div class="table-responsive">

                                                <table id="mytable" class="table table-bordered table-striped">

                                                    <thead>
                                                    <tr>
                                                        <th>Subjects</th>
                                                        <!--                                        <th>Take Exam</th>-->

                                                    </tr>
                                                    </thead>
                                                    <tbody>

                                                    <?php
                                                    $query = "SELECT subject_id FROM registered_exams WHERE student_reg = '{$reg_no}'";
                                                    $select_user_query = mysqli_query($connection, $query);

                                                    if(!$select_user_query){
                                                        die("QUERY FAILED". mysqli_error($connection));
                                                    }

                                                    $num = 0;
                                                    while($row = mysqli_fetch_array($select_user_query)){

                                                        $subject_id = $row['subject_id'];

                                                        ?>
                                                        <tr>
                                                            <td><?php echo getField('name','subjects',$subject_id) ?>
                                                                <?php $sub_id = getDefiniteExam('id','exams','active','1','subject_id',$subject_id ,'year',$year,'type','P') ?>

                                                                <?php
                                                                if(!is_numeric($sub_id)){
                                                                    die("<br> <br><p class='alert alert-warning'>Some Subjects Have Been Not Added For The Selected Year Exam</p>");
                                                                }
                                                                $total = qusTotalNums($sub_id);
                                                                $num += $total; ?>
                                                            </td>
                                                        </tr>
                                                    <?php } ?>
                                                    <?php $_SESSION['totalQusNum'] = $num; ?>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="text-center">
                                             <?php if($_SESSION['exam_type'] == 'P'){ ?>
                                                <?php
                                                $english_id = getDefiniteExam('id','exams','active','1','subject_id','2','year',$year,'type','P');
                                                if(is_numeric($english_id)){ ?>
                                                    <a class="btn btn-success" href="pre_start.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $english_id ?>">Start Exam</a>
                                                <?php }else { ?>
                                                    <p class="alert alert-danger">There Are Some Errors With the Selected Year</p>
                                                <?php } ?>

                                                <?php } else { ?>
                                                 <p class="alert alert-warning">You can not take practice test now</p>
                                               <?php } ?>

                                            </div>




                                        </div>

                                    </div>
                                    <a href="practice_scores" class="btn btn-block btn-success">View Scores</a>
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

<?php include "inc/footer.php"; ?>