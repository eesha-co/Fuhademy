<header>
    <?php
    $c_exam_id = $_SESSION['current_exam_id'];
    $custom_id = $_SESSION['custom_id'];



    $date = date('h:i:s', time());

    echo $_SESSION['exam_time'];


    $exam_time = $_SESSION['exam_time'] * 60;;

    $start_exam_time = toSeconds($start_time);


    $s_time = $start_exam_time + $exam_time;

    $remaining = $s_time - $current_time;

    if($_SESSION['exam_type'] == 'P'){
        $year = $_SESSION['p_year'];
    }else {
        $year = date('Y', time());
    }
    ?>

    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><?php echo  $_SESSION['institution_name'] ?></a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">

                <ul class="nav navbar-nav navbar">
                    <li class="head" style="font-weight: 800; font-size: 1.4em; color: #fff; margin-left: 160px">Time Remaining : <span id="countdown" class="timer"></span></li>

                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li style="font-weight: 800; font-size: 1.4em;"><a class="text-capitalize"><?php echo $name ?></a></li>

                </ul>
            </div><!--/.nav-collapse -->
        </div>

        <div class="info">
            <div class="container">
                <div class="row">

                    <div class="col-md-6">
                        <div class="containe" style="margin-top: 15px">
                            <?php
                            $query = "SELECT subject_id FROM exams WHERE exam_id = '{$custom_id}'";
                            $select_user_query = mysqli_query($connection, $query);

                            if(!$select_user_query){
                                die("QUERY FAILED". mysqli_error($connection));
                            }


                            while($row = mysqli_fetch_array($select_user_query)){


                                $subject_id = $row['subject_id'];

                                $query = "SELECT name, id FROM subjects WHERE id = '{$subject_id}'";
                                $select_course_query = mysqli_query($connection, $query);

                                if(!$select_course_query){
                                    die("QUERY FAILED". mysqli_error($connection));
                                }



                                while($c_row = mysqli_fetch_array($select_course_query)) {


                                    $name = $c_row['name'];

                                        $this_exam_id = getDefiniteExam('id','exams','active','1','subject_id',$subject_id,'exam_id',$custom_id,'type','C');
                                        if(!is_numeric($this_exam_id)){
                                            redirect('error.php?t=e.id.e');
                                        }
                                        $exam_id = $this_exam_id;

                                    if($c_exam_id == $exam_id){
                                        $current_subject = $name;
                                    }

                                    $id = $c_row['id'];



                                    ?>

                                    <?php if(in_array($subject_id,$_SESSION['regExams'])){ ?>
                                    <a href="prestart_custom.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $exam_id ?>"" class="btn <?php if($exam_id == $c_exam_id){ echo "btn-danger"; }else{ echo "btn-success"; } ?>"><?php echo "<span class='text-capitalize'>$name</span>"; ?></a>
<?php } ?>
                                <?php } } ?>

<!--                            <h3 class="white">Current Exam : <span class="text-capitalize">--><?php //echo getDField('name','custom_exams','id',$custom_id) ?><!--</span></h3>-->
                            <h3 class="white">Current Subject : <span class="text-capitalize"><?php echo $current_subject ?></span></h3>
                            <h4 class="white">Attempted <?php echo $all_ans_result->num_rows; ?> Of <?php echo $question_query->num_rows; ?> <span class="text-uppercase"><?php echo $current_subject ?></span> </h4>


                        </div>
                    </div>

                    <div class="col-md-4 pull-right col-md-push-1">

                        <?php if($_SESSION['profile_pics'] == ""){ ?>
                            <img class="student-img img-circle" height="100" width="100" src="images/images.jpg">
                        <?php }else { ?>
                            <img class="student-img img-circle" height="100" width="100" src="images/<?php echo $_SESSION['profile_pics']; ?>">
                        <?php } ?>

                        <h4 class="white">Reg No : <?php echo $matric_no; ?></h4>

                    </div>

                </div>
            </div>
        </div>

    </nav>


</header>
