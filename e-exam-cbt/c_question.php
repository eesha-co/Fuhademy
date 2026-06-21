<?php include 'database.php' ?>

<!---->

<?php

if(!logged_in()){
    redirect('login.php');
}

$matric_no = $_SESSION['reg_no'];

$student_id = $_SESSION['userid'];

$name = $_SESSION['name'];


?>


<?php
//Set question number


$number = (int) $_GET['n'];

$q_exam_id = (int) $_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'];

$qus = (int) $_GET['q'];

if(!isset($_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs']) || (!isset($_GET['q']))){
    redirect('login.php');
}


$start_time = $_SESSION["timeStarted_$student_id"];







// get question

$question_query = "SELECT * FROM questions 
					WHERE qus_no = $qus AND course_id = $q_exam_id";

// Get result
$result = $mysqli->query($question_query) or die($mysqli->error);

if($result->num_rows == 0){
    redirect("error.php?t=q.n.e");
}


$question = $result->fetch_assoc();



$question_id = $question['id'];

//get student answers

$ans_query = "SELECT * FROM c_students_ans
					WHERE st_id = $student_id AND course_id = $q_exam_id AND qus_id = $question_id";

// Get result
$ansResult = $mysqli->query($ans_query) or die($mysqli->error);


$ans = $ansResult->fetch_assoc();
//
//echo $ans['ans_id'];
//
//print_r($ansResult);
//
////echo $ans_id;
////
//die('done');


$all_ans_query = "SELECT * FROM c_students_ans 
					WHERE st_id = $student_id AND course_id = $q_exam_id";

// Get result
$all_ans_result = $mysqli->query($all_ans_query) or die($mysqli->error);


$total_attempt_query = "SELECT * FROM c_students_ans 
					WHERE st_id = $student_id";

// Get result
$total_attempt_result = $mysqli->query($total_attempt_query) or die($mysqli->error);

////get answered numbers
//$answered_query = "SELECT * FROM c_students_ans
//					WHERE st_id = $student_id AND course_id = $exam_id";
//
//// Get result
//$answeredResult = $mysqli->query($answered_query) or die($mysqli->error);

//$answered = $answeredResult->fetch_assoc();


//get number
$q_query = "SELECT * FROM questions 
					WHERE course_id = $q_exam_id";

$question_query = $mysqli->query($q_query) or die($mysqli->error);



// get Result

$c_query = "SELECT * FROM choices 
					WHERE qus_no = $qus AND course_id = $q_exam_id ORDER BY RAND()";

// Get result
$choices = $mysqli->query($c_query) or die($mysqli->error);

//Get Total Number

$qus_query = "SELECT * FROM questions 
					WHERE course_id = $q_exam_id";

$results = $mysqli->query($qus_query) or die($mysqli->error.__LINE__);

$totalQus = $results->num_rows;

$_SESSION['totalQus'] = $totalQus;


$examNum = $_SESSION["total_$q_exam_id"];



?>




<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><?php echo $_SESSION['institution_name'] ?></title>
    <link rel=stylesheet href="css1/all.min.css" type="text/css" />
    <link rel=stylesheet href="css1/sticky-footer-navbar.css" type="text/css" />
    <link rel=stylesheet href="js/SimpleCalculadorajQuery.css" type="text/css" />
    <link rel=stylesheet href="katex/katex.min.css" type="text/css" />

    <script src="katex/katex.min.js"></script>
    <!--        <script src="js/jquery.min.js"></script>-->
    <script src="js1/jquery.min.js"></script>
    <!--        <script src="js/bootstrap.min.js"></script>-->
    <script src="js/SimpleCalculadorajQuery.js"></script>


<!---->
<!--    <script src="--><?php //echo ADMIN_ROOT_URL ?><!--css/zoomify.min.js"></script>-->
<!--    <script>-->
<!--        $(document).ready(function() {-->
<!--            $('img').zoomify();-->
<!--        });-->
<!--    </script>-->
    <script src="js1/bootstrap.min.js"></script>
    <style>
        .info {
            height: 150px;
            width: 100%;
            background-color: #3c763dc4;
        }
        #micalc .mtop a {
            display: none;
        }
        #rotate{
            vertical-align:top;
            margin-top:143px;
            width:150px;height:30px;
            transform:rotate(7deg);
            -ms-transform:rotate(90deg); /* IE 9 */
            -moz-transform:rotate(90deg); /* Firefox */
            -webkit-transform:rotate(90deg); /* Safari and Chrome */
            -o-transform:rotate(90deg); /* Opera */}
    </style>
</head>
<body>



<div id="wrap">

    <div id="submit" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Submit Exam</h4>

                </div>
                <div class="modal-body text-center">
                    <h5>Are you Sure You Are Done With All Your Exam and Ready To Submit?</h5>
                    <p>By clicking Submit You wont restart this exam again</p>
                </div>
                <div class="modal-footer">
                    <a href="c_final.php" class="btn btn-danger modal_submit_link">Submit</a>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div id="calculator"   class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content" style="width: 100%; height: 100%; float: right">
                <div class="modal-body">
                    <div style="width: 100%; height:">
                        <div id="micalc"> </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close Calculator</button>
                </div>
            </div>
        </div>
    </div>


    <?php include_once("inc1/c_header.php"); ?>

    <?php if($remaining < 1){

        redirect("c_final.php");
    } ?>

    <!-- 	<br>
        <br> -->

    <!--	--><?php //if($remaining < 600 ){
    //		redirect('final.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs='.$exam_id);
    //	}
    ?>

    <div id="wrap">
        <button id="rotate" type="button" class="pull-right btn btn-info" data-toggle="modal" data-target="#calculator">Launch Calculator</button>

        <main style="margin-top: 160px">
            <div class="container">
                <!--                    <div id="idCalculadora"> </div>-->


                <div class="current">Question <?php echo $number+1 ?> of <?php echo $totalQus; ?> <span class="pull-right text-success" style="font-size: 1.5em;">Atempted <?php echo $total_attempt_result->num_rows; ?> of <?php echo $_SESSION['totalQusNum'] ?> Questions</span></div>

                <div class="scroll" style="max-height:200px; min-height: 165px; overflow-x: hidden; overflow-y: auto; margin-bottom: 10px">

                    <div>
                        <span class="pull-left">[<?php echo $number+1 ?>]</span>  <?php echo $question['text']; ?> <?php if(strlen($question['extra']) > 3):?> <button type="button" class="pull-right btn btn-info" data-toggle="modal" data-target="#instruction">View Detail</button> <?php endif; ?>
                    </div>

                    <div id="instruction" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
                        <div class="modal-dialog modal-lg">
                            <!--        modal content-->
                            <div class="modal-content">
                                <div class="modal-body text-justify">
                                    <p><?php echo $question['extra'] ?></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close Detail</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <?php if(strlen($question['img']) > 3){ ?>

                        <div id="image-view"   class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
                            <div class="modal-dialog">
                                <!--        modal content-->
                                <div class="modal-content" style="width: 800px; height: 800%">
                                    <div class="modal-body text-center">
                                        <img class="" style="max-height: 600px; max-width: 700px"  src="<?php echo ADMIN_ROOT_URL ?>qusImage/<?php echo $question['img']; ?>" >
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close Image</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!--                            <p></p>-->
                        <img class="" height="40" width="40" src="<?php echo ADMIN_ROOT_URL ?>qusImage/<?php echo $question['img']; ?>" >
                        <a  class="" data-toggle="modal" data-target="#image-view">view Image</a>
                      <br><hr>
                    <?php } ?>




                    <?php if($remaining > 300 && $remaining < 600){ ?>

                        <div class="pull-right">
                            <div class="alert alert-danger">
                                <h4>You Have Less Than 10 minutes Remaining</h4>
                            </div>

                        </div>

                    <?php }else if($remaining < 300) {?>
                        <div class="pull-right">
                            <div class="alert alert-danger">
                                <h4 class="tab blink">You Have Less Than 5 minutes Remaining</h4>
                            </div>

                        </div>

                    <?php } ?>
                    <form method="post" action="c_process.php">
                        <ul class="choices">

                            <?php $i = 1; ?>

                            <?php while($row = $choices->fetch_assoc()): ?>

                                <?php if(isset($ans['ans_id'])){ ?>

                                    <l1><input id="<?php echo $i++; ?>" name="choice" type="radio" <?php if($row['id'] == $ans['ans_id']){ echo 'checked'; } ?> value="<?php echo $row['id']; ?>" /><?php echo $row['text']; ?>
                                        <?php if(strlen($row['ans_image']) > 3){ ?>
                                            <div id="op-image-view<?php echo $row['id']; ?>"   class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <!--        modal content-->
                                                    <div class="modal-content" style="width: 800px; height: 800%">
                                                        <div class="modal-body text-center">
                                                            <img style="max-width: 700px; max-height: 600px" src="<?php echo ADMIN_ROOT_URL ?>ansImage/<?php echo $row['ans_image']; ?>" >

                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close Image</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <img height="" width="" src="<?php echo ADMIN_ROOT_URL ?>ansImage/<?php echo $row['ans_image']; ?>" >
                                            <a  class="" data-toggle="modal" data-target="#op-image-view<?php echo $row['id']; ?>">view Image</a>
                                        <?php } ?>
                                    </l1><br>

                                <?php }else {  ?>

                                    <l1><input id="<?php echo $i++; ?>" name="choice" type="radio" value="<?php echo $row['id']; ?>" /><?php echo $row['text']; ?>

                                        <?php if(strlen($row['ans_image']) > 3){ ?>

                                            <div id="op-image-view<?php echo $row['id']; ?>"   class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <!--        modal content-->
                                                    <div class="modal-content" style="width: 800px; height: 800%">
                                                        <div class="modal-body text-center">
                                                            <img style="max-width: 700px; max-height: 600px" src="<?php echo ADMIN_ROOT_URL ?>ansImage/<?php echo $row['ans_image']; ?>" >
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close Image</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <img height="20" width="20" src="<?php echo ADMIN_ROOT_URL ?>ansImage/<?php echo $row['ans_image']; ?>" >
                                            <a  class="" data-toggle="modal" data-target="#op-image-view<?php echo $row['id']; ?>">view Image</a>
                                        <?php } ?>
                                    </l1><br>

                                <?php } ?>

                            <?php endwhile ?>

                        </ul>
                </div>



                <?php
                if($number == 0){
                    $pre = 0;
                }else {
                    $pre = $number-1;

                }

                ?>

                <?php if($number == 0){ ?>
                    <a disabled="" class="btn btn-success" href="">Previous</a>
                <?php } else { ?>

                    <a class="btn btn-success" href="c_question.php?n=<?php echo $pre ?>&q=<?php echo $examNum[$pre]; ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $q_exam_id ?>">Previous</a>

                    <script>
                        var url = "c_question.php?n=<?php echo $pre ?>&q=<?php echo $examNum[$pre]; ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $q_exam_id ?>"
                    </script>

                <?php } ?>

                <!---->

                <input id="go" class="btn btn-success btn-md" type="submit" value="Next" />
                <a data-toggle="modal" data-target="#submit"  id="submit" class="submit_link btn btn-success btn-md pull-right"> Submit </a>
                <!--				<a href="final.php" id="submit" class="btn btn-success btn-md pull-right"> Submit </a>-->
                <input type="hidden" name="number" value="<?php echo $number; ?>" />
                <input type="hidden" name="qus" value="<?php echo $qus; ?>" />
                <input type="hidden" name="exam_id" value="<?php echo $q_exam_id; ?>" />
                <input type="hidden" name="qus_id" value="<?php echo $question['id']; ?>" />


                </form>
                <hr style="margin: 5px">

                <?php



                ?>


            </div>



            <script>

                function blinker() {
                    $('.blinking').fadeOut(500);
                    $('.blinking').fadeIn(500);
                }
                setInterval(blinker, 1000);


                var initialTime =  <?php echo $remaining; ?>;


                var seconds = initialTime;
                function timer() {
                    var days        = Math.floor(seconds/24/60/60);
                    var hoursLeft   = Math.floor((seconds) - (days*86400));
                    var hours       = Math.floor(hoursLeft/3600);
                    var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                    var minutes     = Math.floor(minutesLeft/60);
                    var remainingSeconds = seconds % 60;
                    if (remainingSeconds < 10) {
                        remainingSeconds = "0" + remainingSeconds;
                    }
                    document.getElementById('countdown').innerHTML = hours + "hr : " + minutes + "mins : " + remainingSeconds+ "secs";
                    if (seconds == 0) {
                        clearInterval(countdownTimer);
                        document.getElementById('countdown').innerHTML = "Completed";
                        window.location.reload();
                    } else {
                        seconds--;
                    }
                }
                var countdownTimer = setInterval('timer()', 1000);
            </script>
        </main>
    </div>


</div>

<div id="footer" style="">
    <div class="text-center">

        <?php foreach($_SESSION["total_$q_exam_id"] as $key => $value) { ?>

            <a style="margin-bottom: 4px" href="c_question.php?n=<?php echo $key ?>&q=<?php echo $value ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $q_exam_id ?>" class="btn btn-default <?php if($key == $number){ echo "btn-warning"; }
            ?>

<?php
            //get answered numbers


            $qus_no = $key;
            $answered_query = "SELECT * FROM c_students_ans
					   WHERE st_id = $student_id AND course_id = $q_exam_id AND qus_no = $qus_no";

            // Get result
            $answeredResult = $mysqli->query($answered_query) or die($mysqli->error);

            if($answeredResult->num_rows > 0){
                echo " btn-success ";
            } else {
                echo " btn-dange ";
            }

            ?>


btn-md"><?php echo $key+1 ?></a>


        <?php } ?>











    </div>
</div>



<!--    <script src="js/sticky-footer.min.js"></script>-->
<!---->
<!--    <script>-->
<!--        stickyFooter.init();-->
<!--    </script>-->

<script>
    // window.onload=function(){
    //     if (event.keyCode === 13) {
    //         alert("Button code executed.");
    //     };


    // $("#go").click(function() {
    //   alert("Button code executed.");
    // });

    //   if (event.keyCode == 65) {
    // 		$("#1").prop("checked", true);
    // 	}


    // }


    window.onload=function(){

        document.body.onkeyup=function(e){
            var keyCode = (window.event) ? event.keyCode : e.which;
            if(keyCode==13 || keyCode == 78 || keyCode == 39)
            {
                $("#go").click();
            }
            if(keyCode == 37 || keyCode == 80){
                window.location = url;
            }


            if (keyCode == 65) {
                $("#1").prop("checked", true);
            }

            if (keyCode == 66) {
                $("#2").prop("checked", true);
            }
            if (keyCode == 67) {
                $("#3").prop("checked", true);
            }
            if (keyCode == 68) {
                $("#4").prop("checked", true);
            }
            if (keyCode == 69) {
                $("#5").prop("checked", true);
            }

        };


    }
</script>

<script type="text/javascript">
    $(document).ready(function() {

        $("#idCalculadora").Calculadora();
        $("#micalc").Calculadora({'EtiquetaBorrar': 'Clear'});
    });
</script>

</body>
</html>