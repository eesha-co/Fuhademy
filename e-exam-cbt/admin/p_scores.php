<?php require_once("inc/header.php");

$sub = "student_scores";

?>

    <div id="app">

        <?php require_once("inc/sidebar.php"); ?>

        <div class="app-content">


            <?php
            require_once("inc/nav.php");
            ?>


            <div class="main-content" >
                <div class="wrap-content" id="container">


                    <div class="bg-white">


                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3>List Of All Practice Test Scores  </h3>
                            </div>
                            <div class="panel-body">





                                <div class="table-responsive table-bordered">


                                    <table id="documents" class="table table-bordered table-striped">

                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student Name</th>
                                            <!--                                    <th></th>-->
                                            <th>1st Subject</th>
                                            <th>Score</th>
                                            <th>2nd Subject</th>
                                            <th>Score</th>
                                            <th>3rd Subject</th>
                                            <th>Score</th>
                                            <th>4th Subject</th>
                                            <th>Score</th>
                                            <th>Total</th>

                                            <th>Delete</th>
                                        </tr>


                                        </thead>
                                        <tbody>

                                        <?php


                                        $st_query = "SELECT * FROM scores where exam_type='P' ORDER BY student_id";
                                        $select_students_query = mysqli_query($connection, $st_query);

                                        if(!$select_students_query){
                                            die("QUERY FAILED". mysqli_error($connection));
                                        }

                                        $i = 0;

                                        while($s_row = mysqli_fetch_array($select_students_query)) {

                                            $i++;

                                            $st_id = $s_row['student_id'];
                                            $score_id = $s_row['id'];
                                            $sub1_id = getDField('subject_id','exams','id',$s_row['sub1_id']);
                                            $sub1_score = $s_row['sub1_score'];
                                            $sub2_id = getDField('subject_id','exams','id',$s_row['sub2_id']);
                                            $sub2_score = $s_row['sub2_score'];
                                            $sub3_id = getDField('subject_id','exams','id',$s_row['sub3_id']);
                                            $sub3_score = $s_row['sub3_score'];
                                            $sub4_id = getDField('subject_id','exams','id',$s_row['sub4_id']);
                                            $sub4_score = $s_row['sub4_score'];
//                                    $s_course_title = $s_row['course_title'];

                                            $total = $s_row['total_score'];



                                            ?>
                                            <tr>


                                                <td><?php echo $i; ?></td>
                                                <td class="text-capitalize"><a class="" data-title="Print Scores" data-toggle="modal" data-target="#addCourse<?php echo $score_id ?>" ><?php echo getDField('first_name','students','id',$st_id); ?> <?php  echo getDField('last_name','students','id',$st_id); ?></a></td>

                                                <td><?php echo getDField('code','subjects','id',$sub1_id); ?></td>
                                                <td><?php echo $sub1_score; ?></td>
                                                <td><?php echo getDField('code','subjects','id',$sub2_id); ?></td>
                                                <td><?php echo $sub2_score; ?></td>
                                                <td><?php echo getDField('code','subjects','id',$sub3_id); ?></td>
                                                <td><?php echo $sub3_score; ?></td>
                                                <td><?php echo getDField('code','subjects','id',$sub4_id); ?></td>
                                                <td><?php echo $sub4_score; ?></td>
                                                <td><?php echo $total; ?></td>
                                                <td><a name="<?php echo $s_row['id'] ?>" rel='<?php echo $s_row['sub1_id'] ?>_<?php echo $s_row['sub2_id'] ?>_<?php echo $s_row['sub3_id'] ?>_<?php echo $s_row['sub4_id'] ?>_<?php echo $st_id ?>' href='javascript:void(0)' class='delete_link btn btn-danger btn-xs'><i class="fa fa-remove" </a>
                                                </td>


                                                <div class="modal fade" id="addCourse<?php echo $score_id ?>" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="fa fa-times" aria-hidden="true"></span></button>
                                                                <h4 class="modal-title custom_align" id="Heading">Print <?php echo getDField('first_name','students','id',$st_id); ?> <?php  echo getDField('last_name','students','id',$st_id); ?> Score Sheet </h4>
                                                            </div>
                                                            <div class="modal-body">

                                                                <ul class="list-group">
                                                                    <li style="padding: 0.5em; font-weight: 800; font-size: 1.7em" class="list-group-item">Subjects<span class="badge">Show Sheet</span><span class="badge">Correction</span></li>
                                                                    <li class="list-group-item"><?php echo getDField('name','subjects','id',$sub1_id); ?> <span class="pull-right"><a target="_blank" rel="nofollow" href='answer.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub1_id'] ?>&s=<?php echo $sub1_score ?>' class=' btn btn-primary btn-xs'>Score Sheet</a> <a target="_blank" rel="nofollow" href='correction.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub1_id'] ?>&s=<?php echo $sub1_score ?>' class=' btn btn-success btn-xs'>Correction</a></span></li>
                                                                    <li class="list-group-item"><?php echo getDField('name','subjects','id',$sub2_id); ?> <span class="pull-right"><a target="_blank" rel="nofollow" href='answer.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub2_id'] ?>&s=<?php echo $sub2_score ?>' class=' btn btn-primary btn-xs'>Score Sheet</a> <a target="_blank" rel="nofollow" href='correction.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub2_id'] ?>&s=<?php echo $sub2_score ?>' class=' btn btn-success btn-xs'>Correction</a></span></li>
                                                                    <li class="list-group-item"><?php echo getDField('name','subjects','id',$sub3_id); ?> <span class="pull-right"><a target="_blank" rel="nofollow" href='answer.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub3_id'] ?>&s=<?php echo $sub3_score ?>' class=' btn btn-primary btn-xs'>Score Sheet</a> <a target="_blank" rel="nofollow" href='correction.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub3_id'] ?>&s=<?php echo $sub3_score ?>' class=' btn btn-success btn-xs'>Correction</a></span></li>
                                                                    <li class="list-group-item"><?php echo getDField('name','subjects','id',$sub4_id); ?> <span class="pull-right"><a target="_blank" rel="nofollow" href='answer.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub4_id'] ?>&s=<?php echo $sub4_score ?>' class=' btn btn-primary btn-xs'>Score Sheet</a> <a target="_blank" rel="nofollow" href='correction.php?student=<?php echo $st_id ?>&course=<?php echo $s_row['sub4_id'] ?>&s=<?php echo $sub4_score ?>' class=' btn btn-success btn-xs'>Correction</a></span></li>

                                                                </ul>


                                                            </div>
                                                            <!-- /.modal-content -->
                                                        </div>
                                                        <!-- /.modal-dialog -->
                                                    </div>
                                                </div>










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


            <?php

            if(isset($_GET['delete'])){
                $the_score_id = sanitize($_GET['delete']);
                $the_st_id = sanitize($_GET['st_id']);
                $the_sub1_id = sanitize($_GET['sub1_id']);
                $the_sub2_id = sanitize($_GET['sub2_id']);
                $the_sub3_id = sanitize($_GET['sub3_id']);
                $the_sub4_id = sanitize($_GET['sub4_id']);
                $the_st_id = sanitize($_GET['st_id']);

                $ids = array($the_sub1_id,$the_sub2_id,$the_sub3_id,$the_sub4_id);
                $ids = implode(",", $ids);

                $delete_sub = mysqli_query($connection, "DELETE FROM scores WHERE id = {$the_score_id}");

                $delete_score = mysqli_query($connection, "DELETE FROM students_ans WHERE st_id = {$the_st_id} AND course_id IN ({$ids})");



                header("Location: practice_scores");
            }

            ?>

            <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
                <div class="modal-dialog">
                    <!--        modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Delete Score</h4>

                        </div>
                        <div class="modal-body">
                            <h5>Are you Sure You Want To Delete This Student Score?</h5>
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


    <script>


        $(document).ready(function(){
            $(".delete_link").on('click', function(){
                var sub_ids = $(this).attr("rel");

                var subs = sub_ids.split("_");

                var score_id = $(this).attr("name");

                var delete_url = "p_scores.php?delete="+ score_id +"&sub1_id="+ subs[0] +"&sub2_id="+ subs[1] +"&sub3_id="+ subs[2] +"&sub4_id="+ subs[3] +"&st_id="+ subs[4] +" ";
//


                $(".modal_delete_link").attr("href", delete_url);

                $("#myModal").modal('show');


            });
        });


    </script>



    <script type="text/javascript">
        $(document).ready(function() {
            $("#showUpload").click(function(){
                $("#upload").toggle("slow");
            });

            $('#documents').DataTable( {
                "lengthMenu": [ 50, 100, 150, 200, 250, 300],
                dom: 'Blfrtip',
                buttons: [
                    // 'copy', 'csv', 'excel', 'pdf', 'print'

                    {
                        extend: 'excel',
                        title: '<?php echo $sub ?>',
                        exportOptions: {
                            columns: [1,2,3,4,5]
                        }
                    },
                    {
                        extend: 'pdf',
                        title: '<?php echo $sub ?>',
                        exportOptions: {
                            columns: [1,2,3,4,5] // indexes of the columns that should be printed,
                        }                      // Exclude indexes that you don't want to print.
                    },
                    {
                        extend: 'csv',
                        title: '<?php echo $sub ?>',
                        exportOptions: {
                            columns: [1,2,3,4,5]
                        }

                    },
                    {
                        extend: 'print',
                        title: '<?php echo $sub ?>',
                        exportOptions:{
                            columns: [1,2,3,4,5]
                        }
                    }
                ]

            } );
        } );


    </script>

<?php include "inc/footer.php"; ?>