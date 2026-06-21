<?php require_once("inc/header.php"); ?>

<?php

$sub_query = "SELECT * FROM subjects";
$select_sub_query = mysqli_query($connection, $sub_query);

if(!$select_sub_query){
    die("QUERY FAILED". mysqli_error($connection));
}
$subject_total = "16";

if(isset($_GET['y'])){

    $selected_year = (int) $_GET['y'];

    $year = $selected_year;

    $query = "SELECT * FROM exams WHERE year = $selected_year AND type = 'P'";

    $result = $mysqli->query($query) or die($mysqli->error);

//    $select_sub_query = mysqli_query($connection, $query);

    $exam = $result->fetch_assoc();

    $y_totalExam = $result->num_rows;

}else {

    $y = date('Y', time());

    $year = $y-1;

    $query = "SELECT * FROM exams WHERE year = $year AND type = 'P'";

    $results = $mysqli->query($query) or die($mysqli->error);

    $y_totalExam = $results->num_rows;

}

$startYear = getField('value','settings','15');

$this_year = date('Y', time()) - 1;

$yearRange = range ($this_year,$startYear);

$y_def = $subject_total - $y_totalExam;

if(isset($_POST['editExam'])) {

    $exam_time = sanitize($_POST['exam_time']);
    $id = $_POST['id'];


    // $query = "UPDATE courses SET course_code = '$course_code', course_title = '$course_title',
    // exam_time = '$exam_time' WHERE id=$id";

    $query = "UPDATE exams SET exam_time = '$exam_time' WHERE id=$id";

    //Run query

    $update_row = $mysqli->query($query) or die($mysqli->error.__LINE__);


}

if(isset($_POST['addExam'])) {
    $subject = $_POST['subject'];
    $subject_explode = explode('|', $subject);

    $subject_id = sanitize($subject_explode[0]);
    $subject_code = sanitize($subject_explode[1]);

    $exam_time = sanitize($_POST['exam_time']);
    $status = sanitize($_POST['status']);

    $exam_id = $subject_code.'-'.'MOCK'.'-'.$year;

    $lecturers_id = 0;

    $course_query = "SELECT * FROM exams WHERE exam_id = '$exam_id' AND type = 'P'";

    $results = $connection->query($course_query) or die($connection->error . __LINE__);

    if ($results->num_rows == 0) {

        //Add Course query
        $query = "INSERT INTO `exams`(course_code, subject_id, exam_time, type, exam_id, year, active, lecturers_id) 
        VALUES('$subject_code', '$subject_id', '$exam_time', 'P', '$exam_id', '$year', '$status', '$lecturers_id')";

        //Run query

        $main_s_id = $subject_id;

        $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

    } else {
        $errors[] = 'Opps, The Exam Code \'' . $exam_id. '\' Has Been Added For This Year Mock.';
    }




}

?>


    <div id="app">

        <?php require_once("inc/sidebar.php"); ?>

        <div class="app-content">

            <?php
            require_once("inc/nav.php");
            ?>
            <div class="main-content" >
            <div class="modal fade" id="addCourse" tabindex="-1" role="dialog" aria-labelledby="add" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="fa fa-times" aria-hidden="true"></span></button>
                            <h4 class="modal-title custom_align" id="Heading">Add Exam</h4>
                        </div>
                        <div class="modal-body">

                            <form action="" method="post">
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label>Subject</label>
                                        <select required class="form-control" name="subject">
                                            <?php

                                            while($row = mysqli_fetch_array($select_sub_query)) {

                                                $name = $row['name'];
                                                $subject_id = $row['id'];
                                                $subject_code = $row['code'];
                                                ?>
                                                <option value="<?php echo $subject_id ?>|<?php echo $subject_code ?>"><?php echo $name ?></option>
                                            <?php } ?>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label>Exam Time (in minutes)</label>
                                        <input class="form-control " name="exam_time" value=""  type="number" placeholder="Exam">
                                    </div>

                                    <div class="form-group ">
                                        <label>Status</label>
                                        <select required class="form-control" name="status">
                                            <option value="1">Active</option>
                                            <option value="0">Not Active</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="modal-footer ">

                                    <input type="hidden" name="id" value="" />
                                    <input type="submit" class="btn btn-success" name="addExam" value="Add Exam" />
                                </div>
                            </form>


                        </div>
                        <!-- /.modal-content -->
                    </div>
                    <!-- /.modal-dialog -->
                </div>
            </div>

            <div class="">







                <div class="panel panel-default">

                    <div class="panel-heading">

                        <h4><i class="fa fa-lg fa-home" aria-hidden="true"></i>  <span class="text-uppercase">Select Exam Questions By Year -> </span><span class="small"></span> <button id="toggleBulk" class="btn btn-default">Toggle Bulk Option</button>
                            <span class="pull-right">

                    <form action="" class="form-horizontal">
                    <div class="form-group ">

                                       <select class="form-control" onchange="location = this.value;" name="exam_year">
                                           <?php if(isset($_GET['y'])){ ?>
                                               <option><?php echo $selected_year ?></option>
                                           <?php } else { ?>
                                               <option>Select Year</option>
                                           <?php } ?>
                                           <?php

                                           foreach($yearRange as $thisYear)
                                           {
                                               echo "<option  value='p_subjects.php?y=$thisYear'>$thisYear</option>";
                                           } ?>

                                       </select>

                                   </div>

                        </form>
                </span>
                        </h4>
                    </div>


                    <div class="panel-body">
                        <?php if($y_def > 0){ ?>
                            <div class="alert alert-warning">
                                <p>You have set <?php echo $y_totalExam ?> Exams out of <?php echo $subject_total ?> Available Subjects, Make Sure You Set Exam For All Subjects</p>
                            </div>
                        <?php } ?>
                        <div class="ro">


                            <!--            <h3>List Of Available MOCK Subjects <span class="pull-right"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD Mock Exam</button></span> </h3>-->

                            <?php

                            if(isset($_GET['y'])){ ?>

                                <h3>List of Available  <span class="text-uppercase"><?php echo $selected_year ?> </span> Past Exams  <span class="pull-right"><button class="btn btn-primary btn-sm" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD <?php echo $exam['year'] ?> Exam</button></span></h3>


                            <?php } else{ ?>

                                <h3>List of Available <?php echo $year ?> Past Questions <span class="pull-right"><button class="btn btn-primary btn-sm" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD Exam</button></span> </h3>
                            <?php } ?>

                            <?php

                            if(isset($_POST['editExam'])){ ?>

                                <div class="alert alert-success"><span class=""></span> <?php echo $course_title ?> updated successfully </div>
                            <?php } ?>

                            <?php
                            if(isset($_POST['addCourse'])){ ?>
                                <?php if(isset($errors)){
                                    echo output_errors($errors);
                                } else if (empty($errors) === true){ ?>
                                    <div class="alert alert-success"><span class=""></span> <?php echo $course_title ?> Added successfully </div>
                                <?php } }
                            ?>

                            <div>

                            </div>

                            <form name="main" method="post">

                                <?php
                                if(isset($_POST['addExam'])){ ?>
                                    <?php if(isset($errors)){
                                        echo output_errors($errors);
                                    } else if (empty($errors) === true){ ?>
                                        <div class="alert alert-success"><span class=""></span> <?php echo getField('name','subjects',$main_s_id) ?> Added successfully </div>
                                    <?php } }
                                ?>

                                <div class="table-responsive">

                                    <table id="mytable" class="table table-bordered table-striped">

                                        <thead>
                                        <tr>
                                            <th width="1%"><input id="selectAllBoxes" type="checkbox" name="checkbox" value=""></th>
                                            <th>Subject Title</th>
                                            <th>Year</th>
                                            <th>Upload</th>
                                            <th>Questions</th>
                                            <th>Status</th>
                                            <th>Set Exam</th>
                                            <th>Action</th>
                                            <th>Delete</th>
                                        </tr>


                                        </thead>
                                        <tbody>

                                        <?php

                                        if(isset($_GET['y'])) {
                                            $query = "SELECT * FROM exams WHERE  year = $selected_year AND type = 'P'";
                                            $select_courses_query = mysqli_query($connection, $query);
                                        }else {
                                            $query = "SELECT * FROM exams WHERE year = $year AND type = 'P'";
                                            $select_courses_query = mysqli_query($connection, $query);
                                        }


                                        if(!$select_courses_query){
                                            die("QUERY FAILED". mysqli_error($connection));
                                        }

                                        while($row = mysqli_fetch_array($select_courses_query)) {
                                            $sub_id = $row['subject_id'];
                                            $id = $row['id'];
                                            $subject_name = getField('name','subjects',$sub_id);


                                            ?>
                                            <tr>

                                                <td><input class="checkBoxes" type="checkbox" name="checkBoxArray[]" value='<?php echo $row['id']; ?>'></td>
                                                <td><?php echo $subject_name ?></td>
                                                <td><?php echo $row['year'] ?></td>
                                                <td><a class="btn btn-primary btn-xs" href="upload.php?sub=<?php echo $subject_name ?>&id=<?php echo $row['id'] ?>">Upload CSV</a></td>

                                                <td><a class="" href="exam_qus.php?id=<?php echo $row['id'] ?>"><?php echo getNumRow('questions','course_id',$id) ?> Question(s)</a></td>
                                                <td><?php if($row['active'] == 1){ echo "Active"; }else{ echo "Not Active"; } ?></td>

                                                <td><a class="btn btn-success btn-xs" href="set_questions.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $row['id'] ?>">Set Question</a></td>

                                                <div class="modal fade" id="edit<?php echo $row['id'] ?>" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="fa fa-times" aria-hidden="true"></span></button>
                                                                <h4 class="modal-title custom_align" id="Heading">Edit Course</h4>
                                                            </div>
                                                            <form action="" name="inner" method="post">
                                                                <div class="modal-body">
                                                                    <div class="form-group">
                                                                        <label>Subject Title</label>
                                                                        <input class="form-control" disabled name="course_title" value="<?php echo $subject_name ?>" type="text" placeholder="Course Title">
                                                                    </div>

                                                                    <div class="form-group">
                                                                        <label>Exam Time (in minutes)</label>
                                                                        <input class="form-control " name="exam_time" value="<?php echo $row['exam_time'] ?>"  type="number" placeholder="End Time">
                                                                    </div>
                                                                </div>
                                                                <div class="modal-footer ">

                                                                    <input type="hidden" name="id" value="<?php echo $row['id'] ?>" />
                                                                    <input type="submit" class="btn btn-success" name="editExam" value="submit" />
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <!-- /.modal-content -->
                                                    </div>
                                                    <!-- /.modal-dialog -->
                                                </div>

                                                <td>
                                                    <form action="" method="post">
                                                        <?php if($row['active'] == 0){ ?>
                                                            <a href="p_subjects.php?toggleStatus=<?php echo $row['id'] ?>&activate=1">Activate Course</a>
                                                        <?php }else { ?>

                                                            <a href="p_subjects.php?toggleStatus=<?php echo $row['id'] ?>&activate=0">Deactivate Course</a>
                                                        <?php } ?>
                                                    </form>


                                                </td>

                                                <td><a rel='<?php echo $row['id']; ?>' href='javascript:void(0)' class='delete_link btn btn-danger btn-xs'>Delete</a></td>

                                            </tr>




                                        <?php } ?>





                                        </tbody>

                                    </table>

                                    <?php if($select_courses_query->num_rows == 0){ ?>
                                        <div class="alert alert-info">
                                            <p>No Exam Available For The Selected Year</p>
                                        </div>
                                    <?php } ?>

                                    <div class="clearfix"></div>


                                </div>

                            </form>





                        </div>
                    </div>
                </div>


            </div><div class="col-md-2"></div>

                </div>




        </div>


    </div>

<?php

if(isset($_GET['delete'])){
    $the_course_id = sanitize($_GET['delete']);

    $qus_query = "DELETE FROM questions WHERE course_id = {$the_course_id}";
    $delete_ans = mysqli_query($connection, $qus_query);

    $ans_query = "DELETE FROM choices WHERE course_id = {$the_course_id}";
    $delete_ans = mysqli_query($connection, $ans_query);

    $query = "DELETE FROM exams WHERE id = {$the_course_id}";
    $delete_query = mysqli_query($connection, $query);

    header("Location: p_subjects.php");
}

?>

    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Delete Exam</h4>

                </div>
                <div class="modal-body">
                    <h5>Are you Sure You Want To Delete This Exam?</h5>
                    <p>Note : If You Delete This Exam, All Related Questions will be deleted</p>
                </div>
                <div class="modal-footer">
                    <a href="" class="btn btn-danger modal_delete_link">Delete</a>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>




<?php
if(isset($_GET['toggleStatus'])){
    $the_course_id = sanitize($_GET['toggleStatus']);
    $activate = sanitize($_GET['activate']);

    $query = "UPDATE exams SET active = '{$activate}' WHERE id = '{$the_course_id}'";
    $reset_query = mysqli_query($connection, $query);
    header("Location: p_subjects.php");
}
?>


    <script type="text/javascript">
        var x = document.getElementById("bulk");
        x.style.display = "none";
    </script>
    <script type="text/javascript">


        $(document).ready(function(){

            $(".delete_link").on('click', function(){
            var id = $(this).attr("rel");

            var delete_url = "p_subjects.php?delete="+ id +" ";

            $(".modal_delete_link").attr("href", delete_url);

            $("#myModal").modal('show');


        });

            $('#mytable').DataTable( {
                "lengthMenu": [ 50, 100, 150, 200, 250, 300],
                dom: 'Blfrtip',
                buttons: [
                    // 'copy', 'csv', 'excel', 'pdf', 'print'

                    {
                        extend: 'excel',
                        title: '',
                        exportOptions: {
                            columns: [0,1,2,3,4]
                        }
                    },
                    {
                        extend: 'pdf',
                        title: '',
                        exportOptions: {
                            columns: [0,1,2,3,4] // indexes of the columns that should be printed,
                        }                      // Exclude indexes that you don't want to print.
                    },
                    {
                        extend: 'csv',
                        title: '',
                        exportOptions: {
                            columns: [0,1,2,3,4]
                        }

                    },
                    {
                        extend: 'print',
                        title: '',
                        exportOptions:{
                            columns: [0,1,2,3,4]
                        }
                    }
                ]

            } );
        });


    </script>

<?php require_once("inc/footer.php"); ?>