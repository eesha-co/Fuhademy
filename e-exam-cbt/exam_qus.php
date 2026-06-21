<?php require_once("inc/header.php"); ?>

<?php

$exam_id = (int) $_GET['id'];

$query = "SELECT * FROM exams WHERE id = $exam_id";

$result = $mysqli->query($query) or die($mysqli->error);

if($result->num_rows == 0){
    redirect('subjects.php');
}

//    $select_sub_query = mysqli_query($connection, $query);

$course = $result->fetch_assoc();

$sub_id = $course['subject_id'];

$subject_name = getField('name','subjects',$sub_id);

$sub = strtolower($subject_name).'_questions';

$sub = str_replace(' ','_',$sub);



?>

<div id="app">
    <?php include('inc/sidebar.php');?>
    <div class="app-content">

        <?php include('inc/nav.php');?>

        <!-- end: TOP NAVBAR -->
        <div class="main-content" >
            <div class="wrap-content" id="container">

                <div class="bg-white">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4><i class="fa fa-lg fa-pencil-square-o" aria-hidden="true"></i>  <span class="text-uppercase"><?php echo $subject_name ?> Question(s)</span><span class="small"></span>
                                <span class="pull-right"> <a class="btn btn-success btn-sm" href="set_questions.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $exam_id ?>">Add / Edit Question</a>
</span>
                            </h4>
                        </div>

                        <div class="panel-body">
                            <div class="row">

                                <div class="table-responsive">


                                    <table id="documents" class="table table-bordred table-striped">

                                        <thead>
                                        <tr>

                                            <th>Qus_No</th>
                                            <th>Question</th>
                                            <th>A</th>
                                            <th>B</th>
                                            <th>C</th>
                                            <th>D</th>
                                            <th>E</th>
                                            <th>ANS</th>
                                            <th>DELETE</th>

                                            <!--                                <th>Action</th>-->
                                        </tr>


                                        </thead>
                                        <tbody>

                                        <?php


                                        $st_query = "SELECT * FROM questions WHERE course_id = $exam_id ORDER BY qus_no ASC ";
                                        $select_questions_query = mysqli_query($connection, $st_query);

                                        if(!$select_questions_query){
                                            die("QUERY FAILED". mysqli_error($connection));
                                        }

                                        while($qs_row = mysqli_fetch_array($select_questions_query)) {

                                            $qus_id = $qs_row['id'];
                                            $qus_text = $qs_row['text'];
                                            $qus_no = $qs_row['qus_no'];
                                            $course_id = $qs_row['course_id'];





                                            ?>
                                            <tr>



                                                <td><?php echo $qus_no; ?></td>
                                                <td><?php echo $qus_text; ?></td>

                                                <?php
                                                // get Result

                                                $c_query = "SELECT * FROM choices WHERE qus_no = $qus_no AND course_id = $exam_id ORDER BY RAND()";

                                                // Get result
                                                $choices = $mysqli->query($c_query) or die($mysqli->error);

                                                if(!$choices){
                                                    die("QUERY FAILED". mysqli_error($connection));
                                                }

                                                while($row = $choices->fetch_assoc()): ?>

                                                    <td><?php echo $row['text']; ?></td>

                                                <?php endwhile ?>
                                                <?php

                                                $c_query = "SELECT * FROM choices WHERE qus_no = $qus_no AND course_id = $exam_id AND is_correct = 1 ORDER BY RAND()";

                                                // Get result
                                                $choices = $mysqli->query($c_query) or die($mysqli->error);

                                                if(!$choices){
                                                    die("QUERY FAILED". mysqli_error($connection));
                                                }

                                                while($row = $choices->fetch_assoc()): ?>

                                                    <td><?php echo $row['text']; ?></td>

                                                <?php endwhile ?>



                                                <td>
                                                    <a rel='<?php echo $qus_no ?>' href='javascript:void(0)' class='delete_link'><button class="btn btn-danger btn-xs">Delete</button></a>
                                                </td>









                                            </tr>




                                        <?php }?>





                                        </tbody>

                                    </table>

                                    <div class="clearfix"></div>




                                </div>
                            </div>
                        </div>

                    </div>


                    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
                        <div class="modal-dialog">
                            <!--        modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Delete Question</h4>

                                </div>
                                <div class="modal-body">
                                    <h5>Are you Sure You Want To Delete This Question?</h5>
                                </div>
                                <div class="modal-footer">
                                    <a href="" class="btn btn-danger modal_delete_link">Delete</a>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <!-- end: BASIC EXAMPLE -->






        <!-- end: SELECT BOXES -->

    </div>
</div>

<?php
if(isset($_GET['delete'])){
    $the_qus_no = sanitize($_GET['delete']);


    $ans_query = "DELETE FROM choices WHERE qus_no = {$the_qus_no} AND course_id = {$exam_id}";
    $delete_ans_query = mysqli_query($connection, $ans_query);

    $query = "DELETE FROM questions WHERE qus_no = {$the_qus_no} AND course_id = {$exam_id}";
    $delete_query = mysqli_query($connection, $query);


    header("Location: exam_qus.php?id=$exam_id");
}

?>


<script>

    $(document).ready(function(){
        $(".delete_link").on('click', function(){
            var id = $(this).attr("rel");

            var delete_url = "exam_qus.php?id=<?php echo $exam_id ?>&delete="+ id +" ";

            $(".modal_delete_link").attr("href", delete_url);

            $("#myModal").modal('show');


        });

        $('#documents').DataTable( {
            "lengthMenu": [ 20, 40, 60, 80, 100],
            dom: 'Blfrtip',
            buttons: [
                // 'copy', 'csv', 'excel', 'pdf', 'print'

                {
                    extend: 'excel',
                    title: '<?php echo $sub ?>',
                    exportOptions: {
                        columns: [0,1,2,3,4,5,6,7]
                    }
                },
                {
                    extend: 'pdf',
                    title: '<?php echo $sub ?>',
                    exportOptions: {
                        columns: [0,1,2,3,4,5,6,7] // indexes of the columns that should be printed,
                    }                      // Exclude indexes that you don't want to print.
                },
                {
                    extend: 'csv',
                    title: '<?php echo $sub ?>',
                    exportOptions: {
                        columns: [0,1,2,3,4,5,6,7]
                    }

                },
                {
                    extend: 'print',
                    title: '<?php echo $sub ?>',
                    exportOptions:{
                        columns: [0,1,2,3,4,5,6,7]
                    }
                }
            ]

        } );
    });

</script>

<!-- start: FOOTER -->
<?php include('inc/footer.php');?>
