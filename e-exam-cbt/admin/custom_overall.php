<?php require_once("inc/header.php"); ?>

<?php
$y = date('Y', time());
$sub_query = "SELECT * FROM subjects";
$select_sub_query = mysqli_query($connection, $sub_query);

if(!$select_sub_query){
    die("QUERY FAILED". mysqli_error($connection));
}
$subject_total = $select_sub_query->num_rows;

if(isset($_GET['sub_id'])){

    $selected_course = (int) $_GET['sub_id'];

    $course_name = getField('name','custom_exams',$selected_course);

}else {

    redirect('custom_scores');

}


?>


    <div id="app">

        <?php require_once("inc/sidebar.php"); ?>

        <div class="app-content">

            <?php
            require_once("inc/nav.php");
            ?>
            <div class="main-content" >

                <div class="">







                    <div class="panel panel-default">

                        <div class="panel-heading">

                            <h3>List of Available <?php echo $course_name ?> Scores </h3>
                        </div>


                        <div class="panel-body">
                            <div class="ro">


                                <!--            <h3>List Of Available MOCK Subjects <span class="pull-right"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#addCourse" >ADD Mock Exam</button></span> </h3>-->


                                <div>

                                </div>

                                <form name="main" method="post">


                                    <div class="table-responsive">

                                        <table id="mytable" class="table table-bordered table-striped">

                                            <thead>
                                            <tr>
                                                <th width="1%"><input id="selectAllBoxes" type="checkbox" name="checkbox" value=""></th>
                                                <th>Student Name</th>
                                                <th>Reg No</th>
                                                <th>No Of Exams</th>
                                                <th>Subjects</th>
                                                <th>Total Score</th>
                                                <th>Total Questions</th>
                                                <th>Aggregate Score</th>
<!--                                                <th>View Correction</th>-->
<!--                                                <th>delete</th>-->

                                            </tr>


                                            </thead>
                                            <tbody>

                                            <?php

//                                            $query = "SELECT * from score WHERE subject_id = $selected_course GROUP BY score;";
//                                            $query = "SELECT DISTINCT on score * FROM score WHERE subject_id = $selected_course ORDER BY score";
                                            $query = "SELECT * FROM students";
                                            $score_query = "SELECT * FROM score where custom_id = $selected_course";
                                            $select_courses_query = mysqli_query($connection, $query);
                                            $select_score_query = mysqli_query($connection, $score_query);




                                            $regss = array();
                                            while($rows = mysqli_fetch_array($select_score_query)) {
                                                $regss[] = $rows['student_reg'];
                                            }
                                            $st_regs = array_unique($regss);

//                                            if(!$select_courses_query['rows']){
//                                                die("QUERY FAILED". mysqli_error($connection));
//                                            }

                                            while($row = mysqli_fetch_array($select_courses_query)) {
//                                                $sub_id = $row['subject_id'];
//                                                $student_reg = $row['student_reg'];
//                                                $custom_id = $row['custom_id'];
//                                                $score = $row['score'];
//                                                $total = $row['total'];
                                                $reg = $row['reg_no'];
                                                $id = $row['id'];

//

//                                                $st_id = getDField('id','students','reg_no',$student_reg);
//                                                $subject_name = getField('name','subjects',$sub_id);
//                                                $custom_name = getField('name','custom_exams',$custom_id);
                                                $first_name = $row['first_name'];
                                                $last_name =  $row['last_name'];
                                                $full_name = "$first_name $last_name";

                                            if(in_array($reg, $st_regs)){
                                                ?>
                                                <tr>

                                                    <td><input class="checkBoxes" type="checkbox" name="checkBoxArray[]" value='<?php echo $row['id']; ?>'></td>
                                                    <td><?php echo $full_name ?></td>
                                                    <td><?php echo $reg ?></td>
                                                    <td><?php echo getNumRow('score','student_reg',$reg); ?></td>
                                                    <td><?php
                                                        $my_score_query = "SELECT score, subject_id FROM score WHERE student_reg = '$reg'";
                                                        $select_my_score_query = mysqli_query($connection, $my_score_query);
                                                        $subjects = array();
                                                        $my_score = 0;
                                                        $total_qus = 0;
                                                        while($my_row = mysqli_fetch_array($select_my_score_query)) {
                                                            $my_score += $my_row['score'];
                                                            $sub_id = $my_row['subject_id'];
                                                            $subject_id = getField('subject_id','exams',$sub_id);
                                                            $subject_name = getField('name','subjects',$subject_id);
                                                            $subjects[] = $subject_name;
                                                            $total_qus += getNumRow('questions','course_id',$sub_id);


                                                        }
                                                        foreach ($subjects as $subject){ echo "[$subject] "; }


                                                        ?></td>
                                                    <td><?php echo $my_score ?></td>
                                                    <td><?php echo $total_qus ?></td>
<!--                                                    <td>--><?php //echo $my_score / getNumRow('score','student_reg',$reg); ?><!--</td>-->
                                                    <td><?php $agrescore =  ($my_score * 100) / $total_qus;
                                                    echo round($agrescore, 2);
                                                    ?></td>

<!---->
<!--                                                    <td><a class="" href="answer.php?student=--><?php //echo $st_id ?><!--&course=--><?php //echo $sub_id ?><!--&s=--><?php //echo $score ?><!--">ScoreSheet</a></td>-->
<!---->
<!--                                                    <td><a  href="correction.php?student=--><?php //echo $st_id ?><!--&course=--><?php //echo $sub_id ?><!--&s=--><?php //echo $score ?><!--" class=''>Answer Sheet</a></td>-->
<!---->
<!--                                                    <td><a rel='--><?php //echo $id; ?><!--' href='javascript:void(0)' id="--><?php //echo $selected_course; ?><!--" class='delete_link btn btn-danger btn-xs'>Delete</a></td>-->

                                                </tr>




                                            <?php } }?>





                                            </tbody>

                                        </table>

                                        <?php if($select_courses_query->num_rows == 0){ ?>
                                            <div class="alert alert-info">
                                                <p>No Available Scores For The Selected Course</p>
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

    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Delete Score</h4>

                </div>
                <div class="modal-body">
                    <h5>Are you Sure You Want To Delete This Score?</h5>

                </div>
                <div class="modal-footer">
                    <a href="" class="btn btn-danger modal_delete_link">Delete</a>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

<?php

if(isset($_GET['delete'])){
    $id = sanitize($_GET['delete']);

    $del_query = "DELETE FROM score WHERE id = {$id}";
    $delete_score = mysqli_query($connection, $del_query);


    header("Location: custom_overall.php?sub_id=$selected_course");
}

?>

<?php
if(isset($_GET['toggleStatus'])){
    $the_course_id = sanitize($_GET['toggleStatus']);
    $activate = sanitize($_GET['activate']);

    $query = "UPDATE exams SET active = '{$activate}' WHERE id = '{$the_course_id}'";
    $reset_query = mysqli_query($connection, $query);
    header("Location: p_subjects.php");
}
?>


    <!--    <script type="text/javascript">-->
    <!--        var x = document.getElementById("bulk");-->
    <!--        x.style.display = "none";-->
    <!--    </script>-->
    <script type="text/javascript">

    </script>

    <script type="text/javascript">




            $(document).ready(function(){

                $(".delete_link").on('click', function(){
                    var id = $(this).attr("rel");
                    var course = $(this).attr("id");

                    var delete_url = "custom_overall.php?sub_id="+course+"&delete="+ id +" ";

                    $(".modal_delete_link").attr("href", delete_url);

                    $("#myModal").modal('show');


                });

            $('#mytable').DataTable( {
                "lengthMenu": [ 40, 80, 120, 160, 200, 300, 400 ],
                dom: 'Blfrtip'
            } );



        });


    </script>

<?php require_once("inc/footer.php"); ?>