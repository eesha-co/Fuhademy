<?php require_once("inc/header.php");

$query = "SELECT * FROM scores WHERE student_id = '{$student_id}' AND exam_type = 'M'";
$select_score_query = mysqli_query($connection, $query);

if(!$select_score_query){
    die("QUERY FAILED". mysqli_error($connection));
}
?>
    ?>

    <div id="app">

        <?php require_once("inc/sidebar.php"); ?>

        <div class="app-content ">

            <?php
            require_once("inc/nav.php");
            ?>
            <div class="main-content bg-white" >
                <div class="wrap-content " id="container">

                    <div class="row">
                        <?php
                        if(getField('value','settings','9') == 1){ ?>
                            <div class="col-md-6 col-md-offset-3" style="margin-top: 50px">

                                <div class="">
                                    <!-- Category -->
                                    <div class="single category">
                                        <div class="panel panel-default">

                                            <div class="panel-body">

                                                <hr class="row">
                                                <div class="table-responsive">

                                                    <?php
                                                    if($select_score_query->num_rows < 1){
                                                        echo "
                                    <p class='text-center'><br><span class='text-danger'>You have not taken Mock Exam Yet</span> <br><br>
                                                            <h3 class=\"side-title bold\"><strong> <a href=\"start\" class=\"btn btn-success btn-xs pull-right\">Back home</a></strong></h3>

                                     ";
                                                    } else { ?>
                                                        <table class="table table-condensed table-bordered table-hover table-striped">

                                                            <thead>
                                                            <tr class="text-primary text-capitalize">
                                                                <td width="80%">Subject</td>
                                                                <td>Score</td>
                                                                <!--                                        <td class="pull-right">score/overall</td>-->


                                                            </tr>
                                                            </thead>
                                                            <tbody>

                                                            <?php


                                                            while($row = mysqli_fetch_array($select_score_query)) {

                                                                $id = $row['id'];

                                                                $sub1_id = getDField('subject_id','exams','id',$row['sub1_id']);
                                                                $sub2_id = getDField('subject_id','exams','id',$row['sub2_id']);
                                                                $sub3_id = getDField('subject_id','exams','id',$row['sub3_id']);
                                                                $sub4_id = getDField('subject_id','exams','id',$row['sub4_id']);


                                                                $total_score = $row['total_score'];

                                                                $sub1_score = $row['sub1_score'];
                                                                $sub2_score = $row['sub2_score'];
                                                                $sub3_score = $row['sub3_score'];
                                                                $sub4_score = $row['sub4_score'];

                                                                ?>
                                                                <tr class="text-center">
                                                                    <td colspan="2"><strong>DATE : <?php echo $row['date'] ?></strong></td>
                                                                </tr>

                                                                <tr>
                                                                    <td><?php echo getField('name','subjects',$sub1_id) ?></td>
                                                                    <td><?php echo $sub1_score ?></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><?php echo getField('name','subjects',$sub2_id) ?></td>
                                                                    <td><?php echo $sub2_score ?></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><?php echo getField('name','subjects',$sub3_id) ?></td>
                                                                    <td><?php echo $sub3_score ?></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><?php echo getField('name','subjects',$sub4_id) ?></td>
                                                                    <td><?php echo $sub4_score ?></td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Total Score : </td>
                                                                    <td><strong><?php echo $total_score ?></strong></td>
                                                                </tr>

                                                                <?php
                                                                if(getField('value','settings','10') == 1){ ?>
                                                                    <tr>
                                                                        <td>Delete Score : </td>
                                                                        <td>
                                                                            <a rel='<?php echo $row['id'] ?>' href='javascript:void(0)' class='delete_link'><button class="btn btn-xs btn-danger">Delete Score</button> </a>
                                                                        </td>
                                                                    </tr>

                                                                <?php } }?>

                                                            </tbody>
                                                        </table>
                                                    <?php } ?>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        <?php }else { ?>
                            <div class="col-md-6 col-md-offset-3" style="margin-top: 100px">
                                <div class="alert alert-warning">You are not permitted to view Mock scores</div>
                                <h3 class="side-title bold"><strong> <a href="start" class="btn btn-success btn-xs pull-right">Back home</a></strong></h3>

                            </div>
                        <?php } ?>

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
                    <h4 class="modal-title">Delete Score</h4>

                </div>
                <div class="modal-body">
                    <h5>Are you Sure You Want To Delete this Score ? </h5>
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
    $the_score_id = sanitize($_GET['delete']);

    $query = "DELETE FROM scores WHERE id = {$the_score_id} ";
    $delete_query = mysqli_query($connection, $query);
    header("Location: mock_scores");
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

                var delete_url = "practice_scores.php?delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#mModal").modal('show');


            });
        });


    </script>

<?php require_once("inc/footer.php"); ?>