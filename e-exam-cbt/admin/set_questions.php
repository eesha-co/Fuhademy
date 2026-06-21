<?php require_once("inc/header.php"); ?>


    <style>

        input[type='text']{
            width: 97%;
            padding: 4px;
            border-radius: 5px;
            border: 1px #000 solid;
        }
        input[type='number']{
            width: 50px;
            padding: 4px;
            border-radius: 5px;
            border: 1px #000 solid;
        }
    </style>

<?php


if(!isset($_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'])){
    redirect("index.php");
}

$course_id = (int) $_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'];

$query = "SELECT * FROM `exams` WHERE id = $course_id";

$select_course_query = mysqli_query($connection, $query);

if(!$select_course_query){
    die("QUERY FAILED". mysqli_error($connection));
}

while($row = mysqli_fetch_array($select_course_query)) {

//    $course_code = $row['course_code'];
    $sub_id = $row['subject_id'];

}




if(isset($_POST['submit'])){
    $qus_no = mysqli_real_escape_string($mysqli, $_POST['qus_no']);
    $qus_text = mysqli_real_escape_string($mysqli, $_POST['qus_text']);
    $qus_extra = mysqli_real_escape_string($mysqli, $_POST['qus_extra']);
    $correct_choice = mysqli_real_escape_string($mysqli, $_POST['correct_choice']);

    //choices array
    $choices = array();
    $choices[1] = mysqli_real_escape_string($mysqli, $_POST['choice1']);
    $choices[2] = mysqli_real_escape_string($mysqli, $_POST['choice2']);
    $choices[3] = mysqli_real_escape_string($mysqli, $_POST['choice3']);
    $choices[4] = mysqli_real_escape_string($mysqli, $_POST['choice4']);
    $choices[5] = mysqli_real_escape_string($mysqli, $_POST['choice5']);

    $choicesImages = array();
    $choicesImages['choice1'] = mysqli_real_escape_string($mysqli, $_FILES['choice1image']['name']);
    $choicesImages['choice2'] = mysqli_real_escape_string($mysqli, $_FILES['choice2image']['name']);
    $choicesImages['choice3'] = mysqli_real_escape_string($mysqli, $_FILES['choice3image']['name']);
    $choicesImages['choice4'] = mysqli_real_escape_string($mysqli, $_FILES['choice4image']['name']);
    $choicesImages['choice5'] = mysqli_real_escape_string($mysqli, $_FILES['choice5image']['name']);

    $ans_dir = "ansImage/";

    $image = sanitize($_FILES['image']['name']);
    $image_temp = sanitize($_FILES['image']['tmp_name']);
    $image_temp1 = sanitize($_FILES['choice1image']['tmp_name']);
    $image_temp2 = sanitize($_FILES['choice2image']['tmp_name']);
    $image_temp3 = sanitize($_FILES['choice3image']['tmp_name']);
    $image_temp4 = sanitize($_FILES['choice4image']['tmp_name']);
    $image_temp5 = sanitize($_FILES['choice5image']['tmp_name']);

    $target_dir = "qusImage/";

    $target_file = $target_dir . basename($_FILES["image"]["name"]);

    $target_1 = $ans_dir . basename($_FILES['choice1image']['name']);
    $target_2 = $ans_dir . basename($_FILES['choice2image']['name']);
    $target_3 = $ans_dir . basename($_FILES['choice3image']['name']);
    $target_4 = $ans_dir . basename($_FILES['choice4image']['name']);
    $target_5 = $ans_dir . basename($_FILES['choice5image']['name']);


    $move = move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);

    $move_1 = move_uploaded_file($_FILES["choice1image"]["tmp_name"], $target_1);
    $move_2 = move_uploaded_file($_FILES["choice2image"]["tmp_name"], $target_2);
    $move_3 = move_uploaded_file($_FILES["choice3image"]["tmp_name"], $target_3);
    $move_4 = move_uploaded_file($_FILES["choice4image"]["tmp_name"], $target_4);
    $move_5 = move_uploaded_file($_FILES["choice5image"]["tmp_name"], $target_5);


    if(!$move){

        $errors[] = 'Image Upload Failed';

    }



    //Question query
    $query = "INSERT INTO `questions`(qus_no, text, extra, img, course_id) VALUES('{$qus_no}','{$qus_text}','{$qus_extra}','{$image}','{$course_id}')";

    //Run query

    $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);



    //Validate Insert
    if($insert_row){
        foreach ($choices as $choice => $value){
            if($value != '' || $choicesImages["choice$choice"] != ''){
                if($correct_choice == $choice){
                    $is_correct = 1;
                } else {
                    $is_correct = 0;
                }
                $ans_image = $choicesImages["choice$choice"];

                //choice query
                $query = "INSERT INTO `choices` (qus_no, course_id, is_correct, text, ans_image) 
                VALUES ('$qus_no', '$course_id', '$is_correct', '$value','$ans_image')";

                //Run query

                $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

                //validate insert
                if($insert_row){
                    continue;
                } else {
                    die($mysqli->error.__LINE__);
                }
            }
        }
        $msg = 'Question Has Been Added Successfully';
    }
}

//Get Total Number

$query = "SELECT * FROM `questions` WHERE course_id = $course_id";

$results = $mysqli->query($query) or die($mysqli->error.__LINE__);
$totalQus = $results->num_rows;

?>


    <div id="app">

<?php require_once("inc/sidebar.php"); ?>

    <div class="app-content">

<?php
require_once("inc/nav.php");
?>



    <div class="main-content bg-white">
    <div class="wrap-content" id="container">
    <div class="">
        <div class="col-md-6">
            <h4>Subject Title : <?php echo getField('name','subjects',$sub_id) ?></h4>
            <p>Add More Question</p>
            <?php
            if(isset($msg)){
                echo '<p>'.$msg.'</p>';
            }
            ?>
            <form method="post" enctype="multipart/form-data" action="">
                <p>
                    <label>Question Number</label>
                    <input type="number" value="<?php echo $totalQus+1; ?>" name="qus_no" />
                    <button id="showExtra" type="button" class="pull-right">Add Extra</button>

                </p>
                <p>
                    <label>Question Text</label>
                    <!--                                <input type="text" name="qus_text" />-->
                    <textarea name="qus_text" class="form-control myTextarea" rows="4"></textarea>

                <div id="extra" style="display: none">
                    <label>Question Comprehension or Instruction :</label>
                    <!--                                <input type="text" name="qus_text" />-->
                    <textarea name="qus_extra" class="form-control myTextarea" rows="4"></textarea>

                </div>

                <div class="row">
                    <div class=" col-xs-12 col-sm-12 col-md-12">
                        <div class="form-group">
                            <label class="row col-sm-7 control-label" for="textinput">Upload : <span class="text-danger">*</span></label>
                            <div class="row col-sm-6">
                                <div class="panel panel-default">
                                    <div class="panel-body">

                                        <input type="file" name="image" id="image" value="<?php if(isset($_POST['submit'])){ echo $_POST['image'];}  ?>"  class="form-control" placeholder="Licence Number" tabindex="1">


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>
                    <label>Choice #1</label>
                    <input type="text" name="choice1" />
                    <input type="file" name="choice1image" id="image">
                </p>
                <p>
                    <label>Choice #2</label>
                    <input type="text" name="choice2" />
                    <input type="file" name="choice2image" id="image">
                </p>
                <p>
                    <label>Choice #3</label>
                    <input type="text" name="choice3" />
                    <input type="file" name="choice3image" id="image">
                </p>
                <p>
                    <label>Choice #4</label>
                    <input type="text" name="choice4" />
                    <input type="file" name="choice4image" id="image">
                </p>
                <p>
                    <label>Choice #5</label>
                    <input type="text" name="choice5" />
                    <input type="file" name="choice5image" id="image">
                </p>
                <p>
                    <label>Correct Choice Number:</label>
                    <input required="" type="number" name="correct_choice" />

                </p>
                <p>

                    <input type="submit" name="submit" value="submit" />
                </p>

            </form>
        </div>

        <div class="row col-md-6">

            <div class="panel panel-primary">
                <div class="panel-heading ">

                    <p>Questions <span class="pull-right">Total Questions : <?php echo $totalQus ?></span> </p>
                </div>
                <div class="panel-body">

                    <div class="pre-scrollable" style="max-height: 95vh">


                        <?php

                        $query = "SELECT * FROM questions WHERE course_id = '{$course_id}' ORDER BY qus_no ASC";
                        $select_user_query = mysqli_query($connection, $query);

                        if(!$select_user_query){
                            die("QUERY FAILED". mysqli_error($connection));
                        }

                        while($row = mysqli_fetch_array($select_user_query)) {

                            $qus_no = $row['qus_no'];

                            ?>
                            <p class="question"><?php echo $qus_no ?> : <?php echo $row['text']; ?>
                                <?php if($row['img'] != ""){ ?>
                                    <br><img height="40" width="40" src="<?php echo ADMIN_ROOT_URL ?>qusImage/<?php echo $row['img'] ?>"><br>
                                <?php } ?>
                                <span class="pull-right"><a href="update_question.php?n=<?php echo $qus_no ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>" class="btn btn-xs btn-warning">Edit</a>

                                                <a rel='<?php echo $qus_no ?>' href='javascript:void(0)' class='delete_link'><button class="btn btn-danger btn-xs">Delete</button></a>


                                            </span>

                            </p>

                            <ul class="choices">

                                <?php
                                $choices_query = "SELECT * FROM choices 
                    WHERE qus_no = $qus_no AND course_id = $course_id";

                                // Get result
                                $choices = $mysqli->query($choices_query) or die($mysqli->error);

                                ?>

                                <?php while($row = $choices->fetch_assoc()): ?>

                                    <l1><input name="choice" type="radio" value="<?php echo $row['id']; ?>" /><?php echo $row['text']; ?>
                                        <?php if($row['ans_image'] != ''){ ?>
                                            <span class="pull-right"><img height="30" width="30" src="ansImage/<?php echo $row['ans_image'] ?>" /></span><br>
                                        <?php } ?>
                                    </l1><br>


                                <?php endwhile; ?>
                                <?php
                                $query = "SELECT * FROM `choices` WHERE qus_no = $qus_no AND is_correct = 1 AND course_id = $course_id LIMIT 1";

                                //Get Result
                                $result = $mysqli->query($query) or die($mysqli->error.__LINE__);

                                //Get Row

                                $row = $result->fetch_assoc(); ?>

                                <p class="text-info">Ans :  <?php echo $row['text']; ?></p>

                            </ul>

                        <?php }?>
                    </div>

                </div>
            </div>


        </div>
        </div>
        </div>


    </div>





    <div id="myModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!--        modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Delete Question</h4>

                </div>
                <div class="modal-body">
                    <h3>Are you Sure You Want To Delete This Question ?</h3>
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
    $the_qus_no = sanitize($_GET['delete']);


    $ans_query = "DELETE FROM choices WHERE qus_no = {$the_qus_no} AND course_id = {$course_id}";
    $delete_ans_query = mysqli_query($connection, $ans_query);

    $query = "DELETE FROM questions WHERE qus_no = {$the_qus_no} AND course_id = {$course_id}";
    $delete_query = mysqli_query($connection, $query);


    header("Location: set_questions.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=$course_id");
}

?>


    <script>

        $(document).ready(function(){
            $(".delete_link").on('click', function(){
                var id = $(this).attr("rel");

                var delete_url = "set_questions.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>&delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#myModal").modal('show');


            });

            $("#showExtra").click(function(){
                $("#extra").toggle("slow");
            });

        });

        tinymce.init({
            selector: '.myTextarea'
        });
    </script>





<?php require_once("inc/footer.php"); ?>