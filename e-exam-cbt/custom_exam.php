
<?php require_once("inc/header.php"); ?>

<?php
//if($_SESSION['exam_type'] != 'M'){
//    redirect('practice_test');
//}

$_SESSION['totalQusNum'] = 0;
$_SESSION['totalTime'] = 0;

$reg_no = strtoupper($_SESSION['reg_no']);

$current_year = date('Y');

$_SESSION['exam_type'] = getField('value','settings','2');

$ced = getField('value','settings','14');
$custom_time = getField('value','settings','3');

$use_custom_time = getField('value','settings','17');
$sub_query = "SELECT subject_id FROM registered_exams WHERE student_reg = '{$reg_no}'";
$select_sub_query = mysqli_query($connection, $sub_query);

//$select_sub_query->toArray();

while( $row = mysqli_fetch_array( $select_sub_query)){
    $new_array[] = $row['subject_id']; // Inside while loop
}


//$row = mysqli_fetch_array($select_sub_query);
//$row = mysqli_fetch_array($select_sub_query);

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
                                            <h4 class="text-center text-bold">Current Exam : <?php echo getDField('name','custom_exams','status',1) ?></h4>
                                        </div>
                                        <div class="panel-body">


                                            <div class="table-responsive">

                                                <table id="mytable" class="table table-bordered table-striped">
                                                    <?php

                                                    $_SESSION['custom_id'] = $custom_id = getDField('id','custom_exams','status',1);


                                                    $query = "SELECT * FROM exams WHERE exam_id = '{$custom_id}' AND active = 1";
                                                    $select_exam_query = mysqli_query($connection, $query);

                                                    if(!$select_exam_query){
                                                        die("QUERY FAILED". mysqli_error($connection));
                                                    }

                                                    if($select_exam_query->num_rows < 1){
                                                        echo '
                                    <p class="text-center"><br><span class="text-danger">You Dont Have Any Registered Subject</span> <br><br>
                                    <a class="btn btn-success" href="registered_exam.php">Add Subjects</a></p>';
                                                    } else {

                                                    while($row = mysqli_fetch_array($select_exam_query)){

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
//die($subject_id);
                                                            ?>
<?php if(in_array($subject_id,$new_array)){ ?>
                                                            <tr>
                                                                <td>
                                                                    <!--                                    --><?php //$id = getDefiniteExam('id','exams','subject_id',$subject_id,'active','1','type','M','year',$current_year); ?>
                                                                    <?php echo getField('name','subjects',$subject_id) ?>
                                                                    <?php $sub_id = getDefiniteExam('id','exams','active','1','subject_id',$subject_id ,'type','C','exam_id',$custom_id) ?>
                                                                    <?php
                                                                    $time = getDField('exam_time','exams','id',$sub_id);
                                                                    if(!is_numeric($sub_id)){
                                                                        die("<br> <br><p class='alert alert-warning'>Some Subjects Have Not Been Added For This Exam</p>");
                                                                    }
                                                                    if($use_custom_time == 1){
                                                                        $_SESSION['totalTime'] = $custom_time;
                                                                    }else {
                                                                        $_SESSION['totalTime'] += $time;
                                                                    }

                                                                   $total = qusTotalNums($sub_id);
                                                                   $_SESSION['totalQusNum']  += $total; ?>
                                                                </td>
                                                            </tr>

                                                            <?php } ?>


                                                        <?php } ?>


                                                    <?php } ?>
                                                    <tr>
                                                        <td class="text-bold text-center">Total Time For This Exam : <?php echo $_SESSION['totalTime']; ?>Mins</td>
                                                    </tr>
                                                </table>

                                                <div class="text-center">
                                                    <?php if($_SESSION['exam_type'] == 'C'){ ?>
                                                        <?php

                                                        $f_query = "SELECT * FROM exams WHERE exam_id = '{$custom_id}' AND active = 1 limit 1";
                                                        $select_f_exam_query = mysqli_query($connection, $f_query);

                                                        if(!$select_f_exam_query){
                                                            die("QUERY FAILED". mysqli_error($connection));
                                                        }

                                                        while($row = mysqli_fetch_array($select_f_exam_query)){
                                                            $first_subject_id = $row['subject_id'];
                                                        }

                                                        $english_id = getDefiniteExam('id','exams','active','1','subject_id',$first_subject_id,'exam_id',$custom_id,'type','C');
                                                        if(is_numeric($english_id)){ ?>
                                                            <a class="btn btn-success" href="prestart_custom.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $english_id ?>">Start Exam</a>
                                                        <?php }else { ?>
                                                            <p class="alert alert-danger">There Are Some Errors With the Selected Exam</p>
                                                        <?php } ?>
                                                        <br><br>

                                                    <?php } else { ?>
                                                        <p class="alert alert-warning">You can not take this exam now</p>
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