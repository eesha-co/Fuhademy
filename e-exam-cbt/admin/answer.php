<?php require_once("inc/header.php"); ?>
<?php
if(isset($_GET['student']) && isset($_GET['course'])){
    $student_id =  $_GET['student'];

    $course_id =  $_GET['course'];
    $score =  $_GET['s'];

    $subject_id = getDField('subject_id','exams','id',$course_id);

    $type = getField('type','exams',$course_id);
    $year = getField('year','exams',$course_id);

    if($type == 'P'){
        $type = "Past Questions";
    }else {
        $type = "Mock Exam";
    }

    $sub = getField('name','subjects',$subject_id);
    $first_name = getField('first_name','students',$student_id);
    $last_name = getField('last_name','students',$student_id);

    $full_name = $first_name . ' '. $last_name;

    $message = "$full_name $year $sub $type Exam Sheet";

}else {
    redirect('scores.php');
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
                                <div class="panel-heading text-capitalize">
                                    <h3><?php echo "$full_name $year $sub $type"; ?> Exam Slip <span class="pull-right">Score : <?php echo $score ?></span> </h3>
                                </div>
                                <div class="panel-body">
                                    <div class="table-responsive table-bordered">
                                        <table id="answers" class="table table-bordered table-striped">
                                            <thead>
                                            <tr>
                                                <th>Qus No</th>
                                                <th>Question</th>
                                                <th>Choice</th>
<!--                                                <th>Right Choice</th>-->
                                                <th>Mark</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <?php
                                            $st_ans_query = "SELECT * FROM students_ans WHERE st_id = $student_id AND course_id = $course_id";
                                            $select_students_ans_query = mysqli_query($connection, $st_ans_query);
                                            if(!$select_students_ans_query){
                                                die("QUERY FAILED". mysqli_error($connection));
                                            }
                                            while($s_row = mysqli_fetch_array($select_students_ans_query)) {
                                                $st_id = $s_row['st_id'];
                                                $c_id = $s_row['course_id'];
                                                $ans_id = $s_row['ans_id'];
                                                $c_ans_id = $s_row['correct_ans_id'];
                                                $qus_id = $s_row['qus_id'];
                                                $qus_no = $s_row['qus_no'];
                                                ?>
                                                <tr>
                                                    <?php
                                                    $qus_query = "SELECT * FROM questions WHERE id = $qus_id";
                                                    $qus = $mysqli->query($qus_query) or die($mysqli->error);
                                                    if(!$qus){
                                                        die("QUERY FAILED". mysqli_error($connection));
                                                    }
                                                    while($row = $qus->fetch_assoc()):
                                                        $qus_text = $row['text'];
                                                        $qus_number = $row['qus_no'];
                                                        ?>
                                                        <td><?php echo $qus_number; ?></td>
                                                        <td class="text-capitalize"><?php echo $qus_text; ?></td>
                                                    <?php endwhile ?>
                                                    <?php
                                                    $ans_query = "SELECT text FROM choices WHERE id = $ans_id";
                                                    $ans = $mysqli->query($ans_query) or die($mysqli->error);
                                                    if(!$ans){
                                                        die("QUERY FAILED". mysqli_error($connection));
                                                    }
                                                    while($row = $ans->fetch_assoc()):
                                                        $ans_text = $row['text'];
                                                        ?>
                                                        <td class=""><?php echo $ans_text; ?></td>
                                                    <?php endwhile ?>
<!--                                                    <td>--><?php //echo getField('text','choices',$c_ans_id) ?><!--</td>-->
                                                    <td>
                                                        <?php
                                                        if($ans_id == $c_ans_id){ ?>
                                                            <i class="fa fa-check" style="font-size:18px;color:green" aria-hidden="true"></i>
                                                        <?php }else { ?>
                                                            <i class="fa fa-remove" style="font-size:18px;color:red"></i>
                                                        <?php } ?>

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
                    </div>
                </div>
            </div>

        </div>


    </div>

    <script type="text/javascript">


        $(document).ready(function(){


            $('#answers').DataTable( {
                "lengthMenu": [ 40, 80, 120, 160, 200, 300, 400 ],
                dom: 'Blfrtip',
                buttons: [
                    // 'pdf', 'print'

                    {
                        extend: 'pdf',
                        title: '<?php echo $sub; ?>',
                        exportOptions: {
                            columns: [0,1,2,3] // indexes of the columns that should be printed,
                        }                      // Exclude indexes that you don't want to print.
                    },
                    {
                        extend: 'print',
                        title: 'Subject : <?php echo $sub; ?> / Score : <?php echo $score ?>',
                        message: '<?php echo $message ?>',
                        exportOptions:{
                            stripHtml: false,
                            // columns: [0,1,2,3,4]
                        }
                    }
                ]

            } );



        });


    </script>



<?php include "inc/footer.php"; ?>