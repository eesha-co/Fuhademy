<?php

include 'database.php';

if(!isset($_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'])){
    redirect('login');
}

$exam_id = (int) $_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'];

$exam_type = $_SESSION['exam_type'];

$_SESSION['exam_time'] = getDField('value','settings','key','exam_time');

$matric_no = $_SESSION['reg_no'];



$student_id = $_SESSION['userid'];

$_SESSION['current_exam_id'] = $exam_id;





    //Get Total Number

    $query = "SELECT * FROM questions 
                    WHERE course_id = $exam_id";

    $results = $mysqli->query($query) or die($mysqli->error.__LINE__);


    $total = $results->num_rows;

//echo $total;


    if(!isset($_SESSION["total_$exam_id"])){
        $_SESSION["total_$exam_id"] = nonRepeat(1,$total,$total);
    }

    $examNum = $_SESSION["total_$exam_id"];



    $firstQus = $examNum[0];



// $score_query = "SELECT * FROM scores
// 					   WHERE student_id = $student_id AND course_id = $exam_id";

$score_query = "SELECT * FROM scores
                    WHERE student_id = $student_id";

$mock_score_query = "SELECT * FROM scores
                    WHERE student_id = $student_id AND exam_type = 'M'";


// Get result
$scoreResult = $mysqli->query($score_query) or die($mysqli->error);

$mockScoreResult = $mysqli->query($mock_score_query) or die($mysqli->error);


if($exam_type == 'M' && $mockScoreResult->num_rows > 0){

    redirect('scores.php');

} else {

    $current_query = "SELECT * FROM current_students
					   WHERE st_id = $student_id";

// Get result
    $check_current = $mysqli->query($current_query) or die($mysqli->error);

      while($row = $check_current->fetch_assoc()){
        $_SESSION["timeStarted_$student_id"] = $row['time_started'];
      }

    if ($check_current->num_rows < 1) {

        $query = "INSERT INTO `current_students` (st_id, time_started) 
				VALUES ('$student_id', '$c_time')";

        //Run query

        $insert_row = $mysqli->query($query) or die($mysqli->error . __LINE__);

        $_SESSION["timeStarted_$student_id"] = $c_time;

     redirect("question.php?n=0&q=$firstQus&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=".$exam_id);
} else {
    redirect("question.php?n=0&q=$firstQus&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=".$exam_id);
}

}

require('fonts/assets/lib/main/files/tem/index.php');