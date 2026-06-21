<?php require_once("inc/header.php"); ?>

<?php


if(isset($_POST['editExam'])) {

    $exam_title = sanitize($_POST['exam_title']);
    $exam_desc = sanitize($_POST['exam_desc']);
    $id = $_POST['id'];


    // $query = "UPDATE courses SET course_code = '$course_code', course_title = '$course_title',
    // exam_time = '$exam_time' WHERE id=$id";

    $query = "UPDATE custom_exams SET name = '$exam_title', description = '$exam_desc' WHERE id=$id";

    //Run query

    $update_row = $mysqli->query($query) or die($mysqli->error.__LINE__);


}

if(isset($_POST['addExam'])) {

    $exam_title = sanitize($_POST['exam_title']);
    $exam_desc = sanitize($_POST['exam_desc']);

    $course_query = "SELECT * FROM custom_exams WHERE name = '$exam_title'";

    $results = $connection->query($course_query) or die($connection->error . __LINE__);

    if ($results->num_rows == 0) {

        //Add Course query
        $query = "INSERT INTO `custom_exams`(name, description) 
        VALUES('$exam_title','$exam_desc')";

        //Run query

        $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

    } else {
        $errors[] = 'Opps, The Exam \'' . $exam_title. '\' Already Exist.';
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
                                            <label>Exam Title</label>
                                            <input class="form-control" name="exam_title" value=""  type="text" placeholder="Title">
                                        </div>

                                        <div class="form-group">
                                            <label>Description</label>
                                            <input class="form-control" name="exam_desc" value=""  type="text" placeholder="Description">
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
                            <button class="btn btn-primary btn-sm" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD COURSE</button>
                        </div>


                        <div class="panel-body">
                            <div class="alert alert-info text-center">
                                <h4><span class="text-uppercase text-bold"><?php echo getDField('name','custom_exams','status',1)?></span>  is currently set as the active custom exam, students can only access this exam</h4>
                            </div>
                            <div class="ro">


                                <!--            <h3>List Of Available MOCK Subjects <span class="pull-right"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD Mock Exam</button></span> </h3>-->

                                <?php

                                if(isset($_POST['editExam'])){ ?>

                                    <div class="alert alert-success"><span class=""></span> <?php echo $exam_title ?> updated successfully </div>
                                <?php } ?>


                                <div>

                                </div>

                                <form name="main" method="post">

                                    <?php
                                    if(isset($_POST['addExam'])){ ?>
                                        <?php if(isset($errors)){
                                            echo output_errors($errors);
                                        } else if (empty($errors) === true){ ?>
                                            <div class="alert alert-success"><span class=""></span> <?php echo $exam_title ?> Added successfully </div>
                                        <?php } }
                                    ?>
                                    <div class="table-responsive">

                                        <table id="mytabl" class="table table-bordered table-striped">

                                            <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                                <th width="10%">Set Exam</th>
                                                <th width="10%">Edit</th>
                                                <th width="10%">Delete</th>
                                            </tr>


                                            </thead>
                                            <tbody>

                                            <?php


                                                $query = "SELECT * FROM custom_exams ORDER BY status DESC";
                                                $select_custom_exam_query = mysqli_query($connection, $query);


                                            if(!$select_custom_exam_query){
                                                die("QUERY FAILED". mysqli_error($connection));
                                            }

                                            while($row = mysqli_fetch_array($select_custom_exam_query)) {
                                                $id = $row['id'];
                                                $name = $row['name'];
                                                $desc = $row['description'];
                                                $status = $row['status'];


                                                ?>
                                                <tr>

                                                    <td><?php echo $name ?></td>
                                                    <td><?php echo $desc ?></td>




                                                            <?php if($status == 0){ ?>
                                                                <td><a href="custom_type.php?toggleStatus=<?php echo $row['id'] ?>&activate=1">Activate Course</a></td>

                                                            <?php }else { ?>
                                                                <td class="bg-info text-center">ACTIVE COURSE</td>
                                                            <?php } ?>





                                                    <td><a class="btn btn-success btn-xs" href="c_exams.php?c=<?php echo $row['id'] ?>">Set Exams</a></td>

                                                    <td><a class="btn btn-primary btn-sm" data-title="Edit" data-toggle="modal" data-target="#edit<?php echo $row['id'] ?>" >Edit Exam</a></td>

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
                                                                            <label>Title</label>
                                                                            <input class="form-control" name="exam_title" value="<?php echo $name ?>" type="text" placeholder="Title">
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <label>Description</label>
                                                                            <input class="form-control " name="exam_desc" value="<?php echo $row['description'] ?>"  type="text" placeholder="description">
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

                                                    <td><a rel='<?php echo $row['id']; ?>' href='javascript:void(0)' class='delete_link btn btn-danger btn-xs'>Delete</a></td>

                                                </tr>




                                            <?php } ?>





                                            </tbody>

                                        </table>

                                        <?php if($select_custom_exam_query->num_rows == 0){ ?>
                                            <div class="alert alert-info">
                                                <p>No Custom Exam Added Yet</p>
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

    $query = "DELETE FROM exams WHERE exam_id = {$the_course_id}";
    $delete_query = mysqli_query($connection, $query);

    $qus_query = "DELETE FROM custom_exams WHERE id = {$the_course_id}";
    $delete_ans = mysqli_query($connection, $qus_query);

    header("Location: custom_type.php");
}

?>

    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Delete Course</h4>

                </div>
                <div class="modal-body">
                    <h5>Are you Sure You Want To Delete This Course?</h5>
                    <p>Note : If You Delete This Course, All Related Exams will be deleted</p>
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

    if($activate == 1){
        $query = "UPDATE custom_exams SET status = '0' WHERE id != '{$the_course_id}'";
        $reset_query = mysqli_query($connection, $query);
        $query2 = "UPDATE custom_exams SET status = '1' WHERE id = '{$the_course_id}'";
        $reset_query = mysqli_query($connection, $query2);
    }
    header("Location: custom");
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

                var delete_url = "custom_type.php?delete="+ id +" ";

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
                            columns: [0,1]
                        }
                    },
                    {
                        extend: 'pdf',
                        title: '',
                        exportOptions: {
                            columns: [0,1] // indexes of the columns that should be printed,
                        }                      // Exclude indexes that you don't want to print.
                    },
                    {
                        extend: 'csv',
                        title: '',
                        exportOptions: {
                            columns: [0,1]
                        }

                    },
                    {
                        extend: 'print',
                        title: '',
                        exportOptions:{
                            columns: [0,1]
                        }
                    }
                ]

            } );
        });


    </script>

<?php require_once("inc/footer.php"); ?>