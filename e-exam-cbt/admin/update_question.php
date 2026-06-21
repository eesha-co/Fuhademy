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

$number = (int) $_GET['n'];

$lecturers_id = 1;

$course_id = (int) $_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'];

if(isset($_POST['submit'])){
    $qus_no = $_POST['qus_no'];
    $qus_text = mysqli_real_escape_string($mysqli, $_POST['qus_text']);
    $qus_extra = mysqli_real_escape_string($mysqli,$_POST['qus_extra']);
    $correct_choice = $_POST['correct_choice'];

    //choices array
    $choices = array();
    $choices[1] = $_POST['choice1'];
    $choices[2] = $_POST['choice2'];
    $choices[3] = $_POST['choice3'];
    $choices[4] = $_POST['choice4'];
    $choices[5] = $_POST['choice5'];

    //Question query
//    $query = "INSERT INTO `questions`(qus_no, text, course_id) VALUES('$qus_no','$qus_text','$course_id')";

    $query = "UPDATE `questions` SET text='{$qus_text}', extra='{$qus_extra}' WHERE qus_no=$qus_no AND course_id=$course_id";

    //Run query

    $update_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

//    if($update_row){
//        die('updated');
//    }

    //Validate Insert
    if($update_row){
        $query = "DELETE FROM choices WHERE qus_no=$qus_no AND course_id=$course_id";

        $delete_choices = $mysqli->query($query) or die($mysqli->error.__LINE__);
//
//        if($delete_choices){
//            die("deleted");
//        }

        foreach ($choices as $choice => $value){
            if($value != ''){
                if($correct_choice == $choice){
                    $is_correct = 1;
                } else {
                    $is_correct = 0;
                }
                //choice query
                $query = "INSERT INTO `choices` (qus_no, course_id, is_correct, text) 
                VALUES ('$qus_no', '$course_id', '$is_correct', '$value')";

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
        $msg = 'Question Has Been Updated Successfully';
    }
}

//Get Total Number

$query = "SELECT * FROM `questions` WHERE course_id = $course_id AND qus_no = $number";

$results = $mysqli->query($query) or die($mysqli->error.__LINE__);

$question = $results->fetch_assoc();
//$totalQus = $results->num_rows;

$query = "SELECT * FROM choices 
                    WHERE qus_no = $number AND course_id = $course_id";

// Get result
$choices = $mysqli->query($query) or die($mysqli->error);

//Get correct Choice

$query = "SELECT * FROM `choices` WHERE qus_no = $number AND is_correct = 1 AND course_id = $course_id";

//Get Result
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

//Get Row

$row = $result->fetch_assoc();

?>


<div id="app">

    <?php require_once("inc/sidebar.php"); ?>

    <div class="app-content">

        <?php 
        require_once("inc/nav.php"); 
        ?>
    <div class="main-content " >
    <div class="wrap-content" id="container">
    <div class="container bg-white">
        <div class="row">
            <p>Instruction : Use &lt;br&GT; For Line Break</p>
            <div class="col-md-6">

                <?php

                $choice_no = 1;

                $choice_n = 1;

                if(isset($msg)){
                    echo '<p>'.$msg.'</p>';
                }
                ?>
                <form method="post" action="">

                    <p>
                        <label>Question Number</label>
                        <input style="width: 20px;" type="text" value="<?php echo $number; ?>" name="qus_no" /> <button id="showExtra" type="button" class="pull-right">Toggle Extra</button>
                    </p>
                    <p>Correct Choice : <?php echo $row['text'] ?></p>
                    <p>
                        <label>Question Text</label>
<!--                        <input type="text" name="qus_text" value="--><?php //echo $question['text'] ?><!--" />-->
                        <textarea name="qus_text" style="padding-top: 20px" rows="4" class="form-control myTextarea"><?php echo $question['text'] ?> </textarea>
                    </p>


                    <p id="extra" style="display: <?php if( strlen($question['extra']) < 3){ echo 'none'; } ?>">
                        <label>Question Extra <?php echo strlen($question['extra']) ?></label>
                        <textarea name="qus_extra" class="form-control myTextarea" rows="4"><?php echo $question['extra'] ?></textarea>
                    </p>

<!--                    --><?php //} ?>

                    <?php while($row = $choices->fetch_assoc()): ?>

                        <p>
                            <label>Choice #<?php echo $choice_no++ ?></label>
                            <input type="text" name="choice<?php echo $choice_n++ ?>" value="<?php echo $row['text']; ?>"/>
                        </p>


                    <?php endwhile ?>



                    <p>
                        <label>Correct Choice Number:</label>
                        <input required type="number" name="correct_choice" />
                    </p>
                    <p>

                        <input type="submit" name="submit" value="submit" />
                    </p>

                </form>
            </div>

            <div class="col-md-6">

                <div class="panel panel-primary">
                    <div class="panel-heading ">

                        <p>Questions
<!--                            <span class="pull-right">Total Questions : --><?php //echo $totalQus ?><!--</span> -->
                        </p>
                    </div>
                    <div class="panel-body">

                        <div class="pre-scrollable" style="max-height: 75vh">


                            <?php

                            $query = "SELECT * FROM questions WHERE course_id = '{$course_id}'";
                            $select_user_query = mysqli_query($connection, $query);

                            if(!$select_user_query){
                                die("QUERY FAILED". mysqli_error($connection));
                            }

                            while($row = mysqli_fetch_array($select_user_query)) {

                                $qus_no = $row['qus_no'];

                                ?>




                                <p class="question"><?php echo $qus_no ?> : <?php echo $row['text']; ?>
                                    <span class="pull-right"><a href="<?php echo ADMIN_ROOT_URL ?>update_question.php?n=<?php echo $qus_no ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>" class="btn btn-xs btn-warning">Edit</a> </span> </p>

                                <ul class="choices">
                                    <?php
                                    $choices_query = "SELECT * FROM choices 
                    WHERE qus_no = $qus_no AND course_id = $course_id";

                                    // Get result
                                    $choices = $mysqli->query($choices_query) or die($mysqli->error);

                                    ?>

                                    <?php while($row = $choices->fetch_assoc()): ?>

                                        <l1><input name="choice" type="radio" value="<?php echo $row['id']; ?>" /><?php echo $row['text']; ?></l1><br>


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
    </div>









    <script>

        $(document).ready(function(){
            $(".delete_link").on('click', function(){
                var id = $(this).attr("rel");

                var delete_url = "update_questions.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>&delete="+ id +" ";

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