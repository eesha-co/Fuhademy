<?php require_once("inc/header.php"); ?>

<?php
$y = date('Y', time());
$sub_query = "SELECT * FROM subjects";
$select_sub_query = mysqli_query($connection, $sub_query);

if(!$select_sub_query){
    die("QUERY FAILED". mysqli_error($connection));
}
$subject_total = $select_sub_query->num_rows;

if(isset($_GET['c'])){

    $selected_course = (int) $_GET['c'];

    $query = "SELECT * FROM exams WHERE exam_id = $selected_course AND type = 'C'";

    $result = $mysqli->query($query) or die($mysqli->error);

//    $select_sub_query = mysqli_query($connection, $query);

    $exam = $result->fetch_assoc();

    $y_totalExam = $result->num_rows;

}else {

    redirect('custom_type.php');

}


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

    $exam_id = $selected_course;

    $lecturers_id = 0;

    $course_query = "SELECT * FROM exams WHERE course_code = '$subject_code' AND exam_id = '$selected_course' AND type = 'C'";

    $results = $connection->query($course_query) or die($connection->error . __LINE__);

    if ($results->num_rows == 0) {

        //Add Course query
        $query = "INSERT INTO `exams`(course_code, subject_id, exam_time, type, exam_id, year, active, lecturers_id) 
        VALUES('$subject_code', '$subject_id', '$exam_time', 'C', '$exam_id', '$y', '$status', '$lecturers_id')";

        //Run query

        $main_s_id = $subject_id;

        $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

    } else {
        $errors[] = 'Opps, The Subject Code \'' . $subject_code. '\' Has Been Added For This Selected Course.';
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

                                                    if($subject_id > 23){
                                                        ?>
                                                        <option value="<?php echo $subject_id ?>|<?php echo $subject_code ?>"><?php echo $name ?></option>
                                                    <?php } }?>
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

                            <h3>List of Available <?php echo getField('name','custom_exams',$selected_course) ?> Exams</h3>
                        </div>


                        <div class="panel-body">
                            <div class="ro">


                                <!--            <h3>List Of Available MOCK Subjects <span class="pull-right"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD Mock Exam</button></span> </h3>-->


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
                                                <th>Questions</th>
                                                <th>View Scores</th>

                                            </tr>


                                            </thead>
                                            <tbody>

                                            <?php

                                            $query = "SELECT * FROM exams WHERE exam_id = $selected_course AND type = 'C'";
                                            $select_courses_query = mysqli_query($connection, $query);


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

                                                    <td><a class="" href="exam_qus.php?id=<?php echo $row['id'] ?>"><?php echo getNumRow('questions','course_id',$id) ?> Question(s)</a></td>

                                                    <td><a  href="custom_sub_score.php?sub_id=<?php echo $id?>" class='delete_link btn btn-danger btn-xs'>Scores</a></td>

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

    </script>

<?php require_once("inc/footer.php"); ?>