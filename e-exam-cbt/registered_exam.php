
<?php require_once("inc/header.php"); ?>

<?php

$registered_exams_query = "SELECT * FROM registered_exams
					   WHERE `student_reg` = '$reg_no'";

// Get resul
$registeredExamResult = $mysqli->query($registered_exams_query) or die($mysqli->error);

$totalExams = $registeredExamResult->num_rows;



if(isset($_POST['addSubject'])) {
    $subject_id = $_POST['subject_id'];
    $student_id = $_SESSION['userid'];



    $registered_query = "SELECT * FROM registered_exams
					   WHERE `student_reg` = '$reg_no' AND subject_id = $subject_id";

// Get resul
    $registeredResult = $mysqli->query($registered_query) or die($mysqli->error);


    if($registeredResult->num_rows < 1){

        //Add Course query
        $query = "INSERT INTO `registered_exams`(student_reg, subject_id) 
        VALUES('$reg_no', '$subject_id')";

        //Run query

        $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

    } else {
        $errors[] = 'Opps, The Subject You Tried Adding, Has Been Added Already .';


    }




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
                            <div class="panel-heading">
                                <h4><i class="fa fa-lg fa-home" aria-hidden="true"></i>  <span class="text-uppercase">Registered Subjects</span><span class="small"></span>
                                    <?php if($totalExams < 4){?>
                                    <span class="pull-right"><button class="btn btn-primary" data-title="Edit" data-toggle="modal" data-target="#addCourse" >

                                            Add Subject

                                        </button> </span>
                                    <?php } ?>
                                </h4>
                            </div>

                            <div class="panel-body" id="Add">
                                <div class="row">
                                    <div class="col-md-12">

                                        <div class="">
                                            <!-- Category -->
                                            <div class="single category">


                                                <?php
                                                if(isset($_POST['addSubject'])){ ?>
                                                    <?php if(isset($errors)){
                                                        echo output_errors($errors);
                                                    } else if (empty($errors) === true){ ?>
                                                        <div class="alert alert-success"><span class=""></span> Subject Added successfully </div>
                                                    <?php } }
                                                ?>


                                                <h3 class="side-title">Registered Exams</h3>

                                                <div class="table-responsive">
                                                    <table class="table table-condensed table-bordered table-hover table-striped">
                                                        <thead>
                                                        <tr class="text-primary text-capitalize h5">
                                                            <td><i class="fa fa-file" aria-hidden="true"></i></td>
                                                            <td>Subjects</td>
                                                            <td>Action</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <?php
                                                        $query = "SELECT * FROM registered_exams WHERE student_reg = '{$reg_no}'";
                                                        $select_user_query = mysqli_query($connection, $query);

                                                        if(!$select_user_query){
                                                            die("QUERY FAILED". mysqli_error($connection));
                                                        }

                                                        while($row = mysqli_fetch_array($select_user_query)){

                                                            $sub_id = $row['subject_id'];
                                                            $r_id = $row['id'];




                                                            ?>

                                                            <tr>

                                                                <td><i class="fa fa-file"></i> </td>
                                                                <td><?php echo getField('name','subjects',$sub_id) ?></td>
                                                                <td>
                                                                    <a rel='<?php echo $r_id ?>' href='javascript:void(0)' class='delete_link pull-right'><button class="btn btn-xs btn-danger">Remove Subject</button> </a>
                                                                </td>

                                                            </tr>
                                                        <?php  }?>

                                                        <?php
                                                        if($select_user_query->num_rows < 3){

                                                            echo "<p class='text-center'>Click The Add Subject To Add Subjects</p>";

                                                        }

                                                        if($select_user_query->num_rows == 4){
                                                            echo "<p class='text-center text-success'>You Have Added All Your Jamb Subjects and won'nt be allowed to add more subjects</p>"; }

                                                        ?>

                                                        </tbody>
                                                    </table>

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
        </div>


    </div>



    <div id="mModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Remove Subject</h4>

                </div>
                <div class="modal-body">
                    <h5>Are you Sure You Want To Remove This Subject From Your Registered Subject ?</h5>
                </div>
                <div class="modal-footer">
                    <a href="" class="btn btn-danger modal_delete_link">Remove</a>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="addCourse" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="fa fa-times" aria-hidden="true"></span></button>
                    <h4 class="modal-title custom_align" id="Heading">Add Subject</h4>
                </div>
                <div class="modal-body">

                    <form action="" method="post">
                        <div class="modal-body">


                            <div class="row">
                                <div class="col-xs-12 col-sm-12 col-md-12">
                                    <div class="form-group">
                                        <label for="username">Subject</label>
                                        <select required class="form-control" name="subject_id" id="">

                                            <?php


                                            $query = "SELECT * FROM subjects";
                                            $select_course_query = mysqli_query($connection, $query);

                                            if(!$select_course_query){
                                                die("QUERY FAILED". mysqli_error($connection));
                                            }

                                            while($row = mysqli_fetch_array($select_course_query)) {

                                                $name = $row['name'];
                                                $subject_id = $row['id'];


                                                ?>

                                                <option value="<?php echo $subject_id?>"> <?php echo $name ?> </option>


                                            <?php } ?>


                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer ">

                            <input type="hidden" name="id" value="" />
                            <input type="submit" class="btn btn-success" name="addSubject" value="Add Subject" />
                        </div>
                    </form>


                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    </div>




    <?php

    if(isset($_GET['delete'])){
        $the_exam_id = sanitize($_GET['delete']);

        $query = "DELETE FROM registered_exams WHERE id = {$the_exam_id} ";
        $delete_query = mysqli_query($connection, $query);
        header("Location: registered_exams");
    }

    ?>




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