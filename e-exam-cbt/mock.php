
<?php require_once("inc/header.php"); ?>

<?php
//if($_SESSION['exam_type'] != 'M'){
//    redirect('practice_test');
//}

$_SESSION['totalQusNum'] = 0;

$reg_no = strtoupper($_SESSION['reg_no']);

$current_year = date('Y');

$_SESSION['exam_type'] = getField('value','settings','2');

$ced = getField('value','settings','14');

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

                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4 class="text-center">Registered Jamb Subjects</h4>
                                        </div>
                                        <div class="panel-body">


                                            <div class="table-responsive">

                                                <table id="mytable" class="table table-bordered table-striped">
                                                    <?php


                                                    $query = "SELECT * FROM registered_exams WHERE student_reg = '{$reg_no}'";
                                                    $select_user_query = mysqli_query($connection, $query);

                                                    if(!$select_user_query){
                                                        die("QUERY FAILED". mysqli_error($connection));
                                                    }

                                                    if($select_user_query->num_rows < 1){
                                                        echo '
                                    <p class="text-center"><br><span class="text-danger">You Dont Have Any Registered Subject</span> <br><br>
                                    <a class="btn btn-success" href="registered_exam.php">Add Subjects</a></p>';
                                                    } else {

                                                    while($row = mysqli_fetch_array($select_user_query)){

                                                        $subject_id = $row['subject_id'];

                                                        $query = "SELECT * FROM subjects WHERE id = '{$subject_id}'";
                                                        $select_course_query = mysqli_query($connection, $query);

                                                        if(!$select_course_query){
                                                            die("QUERY FAILED". mysqli_error($connection));
                                                        }

//                                    $_SESSION['totalQusNum1'] = 0;

                                                        while($row = mysqli_fetch_array($select_course_query)) {

                                                            $name = $row['name'];
                                                            $subject_id = $row['id'];

                                                            ?>

                                                            <tr>
                                                                <td>
                                                                    <!--                                    --><?php //$id = getDefiniteExam('id','exams','subject_id',$subject_id,'active','1','type','M','year',$current_year); ?>
                                                                    <?php echo getField('name','subjects',$subject_id) ?>
                                                                    <?php $sub_id = getDefiniteExam('id','exams','active','1','subject_id',$subject_id ,'year',$current_year,'type','M') ?>
                                                                    <?php
                                                                    if(!is_numeric($sub_id)){
                                                                        die("<br> <br><p class='alert alert-warning'>Some Subjects Have Been Not Added For This Mock Exam</p>");
                                                                    }
                                                                    $total = qusTotalNums($sub_id);
                                                                    $_SESSION['totalQusNum']  += $total; ?>
                                                                </td>
                                                            </tr>


                                                        <?php } ?>

                                                    <?php } ?>
                                                    <?php $_SESSION['totalQusNum']; ?>
                                                </table>

                                                <div class="text-center">
                                                    <?php if($_SESSION['exam_type'] == 'M'){ ?>
                                                        <?php

                                                        $english_id = getDefiniteExam('id','exams','active','1','subject_id','2','year',$current_year,'type','M');
                                                        if(is_numeric($english_id)){ ?>
                                                            <a class="btn btn-success" href="pre_start.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $english_id ?>">Start Exam</a>
                                                        <?php }else { ?>
                                                            <p class="alert alert-danger">There Are Some Errors With the Selected Year</p>
                                                        <?php } ?>
                                                        <br><br>

                                                        <?php if($select_user_query->num_rows < 4){ ?>

                                                            <p>Your Jamb Registered Subjects Is Not Complete Click The Button Bellow To Update Subject </p>

                                                            <a class="btn btn-success" href="registered_exam.php">Update Subjects</a>

                                                        <?php } ?>


                                                    <?php } else { ?>
                                                        <p class="alert alert-warning">You can not take mock exam now</p>
                                                    <?php } ?>

                                                </div>


                                                <?php } ?>

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

<?php include "inc/footer.php"; ?>