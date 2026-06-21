<?php include 'database.php' ?>

<?php


if(!logged_in()){
    redirect('login');
}

$pin = $_SESSION['pin'];

$type = $_SESSION['exam_type'];
//

    $year = date('Y', time());

$student_id = $_SESSION['userid'];
$matric_no = $_SESSION['reg_no'];
$custom_id = $_SESSION['custom_id'];





    $c_query = "SELECT id FROM exams WHERE exam_id = '{$custom_id}'";
    $select_c_query = mysqli_query($connection, $c_query);

    if(!$select_c_query){
        die("QUERY FAILED". mysqli_error($connection));
    }
    while($row = mysqli_fetch_array($select_c_query)) {

        $id = $row['id'];

        $mark = getScore($student_id, $id);

        $total = qusTotalNums($id);


        $query = "INSERT INTO `score` (st_id,student_reg, subject_id, score, total, exam_type,year,custom_id)
				VALUES ('$student_id','$matric_no', '$id', '$mark','$total','$type','$year','$custom_id')";

        $insert_row = $mysqli->query($query) or die($mysqli->error . __LINE__);

    }




$query = "Insert Into students_ans select * from c_students_ans WHERE st_id=$student_id";

$insert_row = $mysqli->query($query) or die($mysqli->error . __LINE__);

$mysqli->query("DELETE FROM c_students_ans WHERE st_id=$student_id");


//get score function
function getScore($student_id,$exam_id){
    global $mysqli;
    $_SESSION[$student_id.'score'.$exam_id] = 0;
    $answered_query = "SELECT * FROM c_students_ans
					   WHERE st_id = $student_id AND course_id = $exam_id";
    // Get result
    $answeredResult = $mysqli->query($answered_query) or die($mysqli->error);
    while ($row = $answeredResult->fetch_assoc()){
        if($row['ans_id'] == $row['correct_ans_id']){
            $_SESSION[$student_id.'score'.$exam_id]++;
        }else {
            $_SESSION[$student_id.'score'.$exam_id];
        }
    }
    $mark = $_SESSION[$student_id.'score'.$exam_id];
    return $mark;
}

$query = "SELECT * FROM students WHERE reg_no = '{$matric_no}' LIMIT 1";
$select_user_query = mysqli_query($connection, $query);

if(!$select_user_query){
    die("QUERY FAILED". mysqli_error($connection));
}

while($row = mysqli_fetch_array($select_user_query)) {
    $first_name = $row['first_name'];
    $last_name = $row['last_name'];
    $name = $first_name . " " . $last_name;
    $matric_no = $row['reg_no'];
    $email = $row['email'];

    $_SESSION['st_name'] = $name;
//	$course_of_study = $row['course_of_study'];
//	$department = $row['department'];

}


$usage_count = getDField('usage_count','pin_logins','pin',$pin);

$deleteStudent = "DELETE FROM current_students WHERE st_id = $student_id";

$deleteStudent = $mysqli->query($deleteStudent) or die($mysqli->error.__LINE__);
//

updatePinLogin($usage_count+1,$pin);

redirect(ROOT_URL."scores");

?>



