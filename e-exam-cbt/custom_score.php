<?php require_once("inc/header.php");

if(isset($_GET['y'])){
    $_SESSION['p_year'] = $_GET['y'];
}else {
    $_SESSION['p_year'] = $y = date('Y', time()) - 1;
}
$cdcs = getField('value','settings','19');
$cvcs = getField('value','settings','18');
$matric_no = $_SESSION['reg_no'];

$query = "SELECT * FROM score WHERE student_reg = '{$matric_no}' AND exam_type = 'C' order BY custom_id DESC";
$select_score_query = mysqli_query($connection, $query);

if(!$select_score_query){
    die("QUERY FAILED". mysqli_error($connection));
}
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
                        if(getField('value','settings','18') == 1){ ?>
                            <div class="col-md-10" style="margin-top: 5px">

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
                                    <p class='text-center'><br><span class='text-danger'>You have not taken Custom Exam Yet</span> <br><br>
                                                            <h3 class=\"side-title bold\"><strong> <a href=\"start\" class=\"btn btn-success btn-xs pull-right\">Back home</a></strong></h3>

                                     ";
                                                    } else { ?>
                                                        <?php if($cvcs){ ?>
                                                        <table class="table table-condensed table-bordered table-hover table-striped">

                                                            <thead>
                                                            <tr class="text-primary text-capitalize">
                                                                <td width="30%" class="text-bold">Exam</td>
                                                                <td width="50%">Subject</td>
                                                                <td>Score</td>
                                                                <td>Total Question</td>
                                                                <!--                                        <td class="pull-right">score/overall</td>-->


                                                            </tr>
                                                            </thead>
                                                            <tbody>

                                                            <?php

                                                            $totalscore = 0;
                                                            $totalsub = 0;

                                                            while($row = mysqli_fetch_array($select_score_query)) {

                                                                $id = $row['id'];
                                                                $exam_id = $row['subject_id'];
                                                                $score = $row['score'];
                                                                $total = $row['total'];
                                                                $custom_id = $row['custom_id'];

                                                                $totalscore += $score;
                                                                $totalsub += $total;

                                                                $sub_id = getDField('subject_id','exams','id',$exam_id)



                                                                ?>
                                                                <tr class="">
                                                                    <td class="text-bold"><?php echo getDField('name','custom_exams','id',$custom_id)?></td>
                                                                    <td ><strong><?php echo getDField('name','subjects','id',$sub_id); ?></strong></td>
                                                                    <td><strong><?php echo $score ?></strong></td>
                                                                    <td><strong><?php echo $total ?></strong></td>
                                                                    <td><a href="answer.php?student=<?php echo $_SESSION['userid'] ?>&course=<?php echo $exam_id ?>&s=<?php echo $score ?>&tl=<?php echo $total ?>&t=<?php echo getDField('name','custom_exams','id',$custom_id)?> ">view scoresheet </a> </td>
                                                                </tr>


                                                                <?php  }?>
                                                            <tr>
                                                                <td class="text-bold" colspan="3">Total </td>
                                                                <td class="text-bold text-center" colspan="2"><?php echo $totalscore ?>/<?php echo $totalsub ?></td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-bold" colspan="3">Aggregate Score </td>
                                                                <td class="text-bold" colspan="2"> <?php $mark = ($totalscore * 100)/$totalsub; echo round($mark, 2)?>%</td>
                                                            </tr>

                                                            </tbody>
                                                        </table>
                                                        <?php }else { ?>
                                                            <div class="alert alert-warning text-center">
                                                                <p>You Are Not Permitted To View This Exam Scores</p>
                                                            </div>
                                                        <?php } ?>
                                                    <?php } ?>

                                                    <?php if($select_score_query->num_rows > 0){ ?>

                                                        <?php if($cdcs){ ?>
                                                    <a rel='<?php echo $matric_no ?>' href='javascript:void(0)' class='delete_link'><button class="btn  btn-danger">Delete Scores</button> </a>

                                                        <?php }else {  ?>
                                                            <button class="btn  btn-danger" disabled>Delete Scores</button>
                                                        <?php } ?>
                                                    <?php } ?>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        <?php }else { ?>
                            <div class="col-md-6 col-md-offset-3" style="margin-top: 100px">
                                <div class="alert alert-warning">You are not permitted to view Custom scores</div>
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
                    <h4 class="modal-title">Delete Scores</h4>

                </div>
                <div class="modal-body">
                    <h5>Are you Sure You Want To Delete These Scores ? </h5>
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


    $query = "DELETE FROM score WHERE `student_reg` = '$the_score_id' ";
    $delete_query = mysqli_query($connection, $query);
    header("Location: custom_score");
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

                var delete_url = "custom_score.php?delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#mModal").modal('show');


            });
        });


    </script>

<?php require_once("inc/footer.php"); ?>