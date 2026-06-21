<?php include 'database.php' ?>

<?php



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

if(!logged_in()){
	redirect('login');
}

$type = $_SESSION['exam_type'];

if($_SESSION['exam_type'] == 'P'){
	$year = $_SESSION['p_year'];
}else {
	$year = date('Y', time());

}

$matric_no = $_SESSION['reg_no'];

$student_id = $_SESSION['userid'];

$pin = $_SESSION['pin'];

//
//
//
//
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

$query = "SELECT subject_id FROM registered_exams WHERE student_reg = '{$matric_no}'";
$select_user_query = mysqli_query($connection, $query);

if(!$select_user_query){
	die("QUERY FAILED". mysqli_error($connection));
}

$i = 0;

while($row = mysqli_fetch_array($select_user_query)) {

	$i++;

	$subject_id = $row['subject_id'];

	$this_exam_id = getDefiniteExam('id','exams','active','1','subject_id',$subject_id,'year',$year,'type',$type);
	$exam_id = $this_exam_id;


	if(!isset($_SESSION["sub$i"."_id"])){
		$_SESSION["sub$i"."_id"] = $exam_id;
	}
	if(!isset($_SESSION["sub$i"."_score"])){
		$_SESSION["sub$i"."_score"] = getScore($student_id,$exam_id);
	}

//	echo "subject = ".$_SESSION["sub$i"."_id"]. " score = " .$_SESSION["sub$i"."_score"] .'<br>';

}
$sub1_id = $_SESSION["sub1_id"];
$sub2_id = $_SESSION["sub2_id"];
$sub3_id = $_SESSION["sub3_id"];
$sub4_id = $_SESSION["sub4_id"];

$sub1_score = $_SESSION["sub1_score"];

$sub2_score = $_SESSION["sub2_score"];
$sub3_score = $_SESSION["sub3_score"];
$sub4_score = $_SESSION["sub4_score"];

$score = $sub1_score + $sub2_score + $sub3_score + $sub4_score;


$query = "INSERT INTO `scores` (student_id, sub1_id, sub1_score, sub2_id, sub2_score, sub3_id, sub3_score, sub4_id, sub4_score, total_score, exam_type,year)
				VALUES ('$student_id', '$sub1_id', '$sub1_score', '$sub2_id', '$sub2_score', '$sub3_id', '$sub3_score', '$sub4_id', '$sub4_score','$score','$type',$year)";

$insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

$usage_count = getDField('usage_count','pin_logins','pin',$pin);

$deleteStudent = "DELETE FROM current_students WHERE st_id = $student_id";

$deleteStudent = $mysqli->query($deleteStudent) or die($mysqli->error.__LINE__);
//
if($_SESSION['exam_type'] == 'M'){
	$query = "Insert Into students_ans select * from c_students_ans WHERE st_id=$student_id";

	$insert_row = $mysqli->query($query) or die($mysqli->error . __LINE__);

	$mysqli->query("DELETE FROM c_students_ans WHERE st_id=$student_id");

}else {

	$ans_query = "SELECT * FROM students_ans WHERE st_id = $student_id AND course_id=$sub1_id";
	$check_ans = $mysqli->query($ans_query) or die($mysqli->error);

if ($check_ans->num_rows > 0) {
	$mysqli->query("DELETE FROM students_ans WHERE st_id=$student_id AND course_id=$sub1_id");
	$mysqli->query("DELETE FROM students_ans WHERE st_id=$student_id AND course_id=$sub2_id");
	$mysqli->query("DELETE FROM students_ans WHERE st_id=$student_id AND course_id=$sub3_id");
	$mysqli->query("DELETE FROM students_ans WHERE st_id=$student_id AND course_id=$sub4_id");
}

	$query = "Insert Into students_ans select * from c_students_ans WHERE st_id=$student_id";

	$insert_row = $mysqli->query($query) or die($mysqli->error . __LINE__);

	$mysqli->query("DELETE FROM c_students_ans WHERE st_id=$student_id");
}


updatePinLogin($usage_count+1,$pin);

redirect(ROOT_URL."scores");

?>



