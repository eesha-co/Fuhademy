<?php
function logged_in()
{

    return (isset($_SESSION['reg_no']) && isset($_SESSION["name"]) && isset($_SESSION["userid"])) ? true : false;
}
function get_nth($string, $index)
{
    return substr($string, $index - 1, 1);
}
function lecturer_logged_in()
{
    return (isset($_SESSION['staff_id'])) ? true : false;
}
$db_host    = 'localhost';
$db_name    = 'obidon_result';
$db_user    = 'root';
$db_pass    = '';
$mysqli     = new mysqli($db_host, $db_user, $db_pass, $db_name);
$connection = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($mysqli->connect_error) {
    printf("connection failed: %sn", $mysqli->connect_error);
    exit();
}
$date_now = date("Y-m-d");
if ($date_now > '2020-01-03') {
    redirect('expired');
}
class csv extends mysqli
{
    public function import($file)
    {
        $file = fopen($file, 'r');
        var_dump($file);
    }
}
function output_errors($errors)
{
    return '<div class="alert alert-danger no_border_radius"><ul class="ul" style="list-style:none; padding: 5px; margin-top:7px"><li>' . implode('</li><li>', $errors) . '</li></ul></div>';
}
function is_admin()
{
    return ($_SESSION['user_type'] === 'admin') ? true : false;
}
function getNumRow($table, $field, $value)
{
    global $mysqli;
    $query = "SELECT * FROM $table WHERE $field = '$value'";
    $results = $mysqli->query($query) or die($mysqli->error . __LINE__);
    return $totalQus = $results->num_rows;
}
function getTotalNumRow($table)
{
    global $mysqli;
    $query = "SELECT * FROM $table";
    $results = $mysqli->query($query) or die($mysqli->error . __LINE__);
    return $totalQus = $results->num_rows;
}
function nonRepeat($min, $max, $count)
{
    if ($max - $min < $count - 1) {
        return false;
    }
    $nonrepeatarray = array();
    for ($i = 0; $i < $count; $i++) {
        $rand = rand($min, $max);
        while (in_array($rand, $nonrepeatarray)) {
            $rand = rand($min, $max);
        }
        $nonrepeatarray[$i] = $rand;
    }
    return $nonrepeatarray;
}
function array_push_assoc($array, $key, $value)
{
    $array[$key] = $value;
    return $array;
}
function redirect($location)
{
    header("Location: $location");
}
function getDefinite($field, $table, $key1, $v1, $key2, $v2, $key3, $v3)
{
    global $connection;
    return $connection->query("SELECT $field FROM $table WHERE $key1 = $v1 AND $key2 = $v2 AND $key3 = $v3")->fetch_object()->$field;
}
function getDefiniteExam($field, $table, $key1, $v1, $key2, $v2, $key3, $v3, $key4, $v4)
{
    global $connection;
    return $connection->query("SELECT $field FROM $table WHERE `$key1` = '$v1' AND `$key2` = '$v2' AND `$key3` = '$v3' AND `$key4` = '$v4'")->fetch_object()->$field;
}
function getDefiniteCExam($field, $table, $key1, $v1, $key2, $v2, $key3, $v3)
{
    global $connection;
    return $connection->query("SELECT $field FROM $table WHERE `$key1` = '$v1' AND `$key2` = '$v2' AND `$key3` = '$v3'")->fetch_object()->$field;
}
function updateSetting($value, $id)
{
    global $connection;
    $update_query = "UPDATE settings SET value='$value' WHERE id='$id'";
    return $update_settings = $connection->query($update_query) or die($connection->error . __LINE__);
}
function updatePinLogin($count, $pin)
{
    global $connection;
    $update_query = "UPDATE pin_logins SET usage_count='$count' WHERE pin='$pin'";
    return $connection->query($update_query) or die($connection->error . __LINE__);
}
function updateInstructions($value, $id)
{
    global $connection;
    $update_query = "UPDATE instructions SET value='$value' WHERE id='$id'";
    return $update_settings = $connection->query($update_query) or die($connection->error . __LINE__);
}
function getField($field, $table, $id)
{
    global $connection;
    return $connection->query("SELECT $field FROM $table WHERE `id` = '$id'")->fetch_object()->$field;
}
function getDField($field, $table, $key, $v)
{
    global $connection;
    return $connection->query("SELECT $field FROM $table WHERE `$key` = '$v'")->fetch_object()->$field;
}
function MaskCreditCard($cc)
{
    $cc_length = strlen($cc);
    for ($i = 0; $i < $cc_length - 8; $i++) {
        if ($cc[$i] == '-') {
            continue;
        }
        $cc[$i] = 'X';
    }
    return $cc;
}
function FormatCreditCard($cc)
{
    $cc            = str_replace(array('-', ' '), '', $cc);
    $cc_length     = strlen($cc);
    $newCreditCard = substr($cc, -4);
    for ($i = $cc_length - 5; $i >= 0; $i--) {
        if ((($i + 1) - $cc_length) % 4 == 0) {
            $newCreditCard = '-' . $newCreditCard;
        }
        $newCreditCard = $cc[$i] . $newCreditCard;
    }
    return $newCreditCard;
}
function confirmQuery($result)
{
    global $connection;
    if (!$result) {
        die("QUERY FAILED ." . mysqli_error($connection));
    }
}
function sanitize($data)
{
    global $connection;
    return mysqli_real_escape_string($connection, strip_tags(trim($data)));
    ;
}
function user_exit($table, $field, $input)
{
    global $connection;
    $stmt = mysqli_prepare($connection, "SELECT id FROM $table WHERE $field = ? ");
    mysqli_stmt_bind_param($stmt, 's', $input);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    confirmQuery($stmt);
    return mysqli_stmt_num_rows($stmt);
}
$secret_code = 'benx-technologies';
if (strtoupper(PHP_OS) == strtoupper("LINUX")) {
    $ds      = shell_exec('udevadm info --query=all --name=/dev/sda | grep ID_SERIAL_SHORT');
    $serialx = explode("=", $ds);
    $serial  = $serialx[1];
    $licensi = md5('BENX' . '07081964464' . trim($serial) . $secret_code);
} else {
    function GetVolumeLabel($drive)
    {
        if (preg_match('#Volume Serial Number is (.*)\n#i', shell_exec('dir ' . $drive . ':'), $m)) {
            $volname = ' (' . $m[1] . ')';
        } else {
            $volname = '';
        }
        return $volname;
    }
    $serial  = str_replace("(", "", str_replace(")", "", GetVolumeLabel("c")));
    $licensi = md5('BENX' . '07081964464' . trim($serial) . $secret_code);
}
$lisfile = $licensi . '.key';
if (!file_exists(__DIR__ . '/' . $lisfile)) {
    redirect('activate');
}
function register_user()
{
    global $connection;
    if (isset($_POST['register'])) {
        $reg_no           = sanitize($_POST['reg_no']);
        $password         = sanitize($_POST['password']);
        $hash             = md5(md5($password));
        $email            = sanitize($_POST['email']);
        $confirm_password = sanitize($_POST['confirm_password']);
        $first_name       = sanitize($_POST['first_name']);
        $last_name        = sanitize($_POST['last_name']);
        $institution      = sanitize($_POST['institution']);
        $subject_1        = sanitize($_POST['subject_1']);
        $subject_2        = sanitize($_POST['subject_2']);
        $subject_3        = sanitize($_POST['subject_3']);
        $subject_4        = sanitize($_POST['subject_4']);
        $gender           = sanitize($_POST['gender']);
        $required_fields  = array(
            'reg_no',
            'password',
            'confirm_password'
        );
        foreach ($_POST as $key => $value) {
            if (empty($value) && in_array($key, $required_fields) === true) {
                $errors[] = 'Fields marked with an asterisk Are Required';
                break1;
            }
        }
        if (empty($errors) === true) {
            if (user_exit('students', 'reg_no', $reg_no) > 0) {
                $errors[] = 'Sorry, The Reg No \'' . $reg_no . '\' is already Registered.';
            }
            if (strlen($password) < 3) {
                $errors[] = 'Sorry Your Password must be at least 6 characters';
            }
            if ($confirm_password !== $password) {
                $errors[] = 'Your password do not match';
            }
            if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                $errors[] = 'A valid Email Address is Required';
            }
            if (user_exit('students', 'email', $email) > 0) {
                $errors[] = 'Sorry, The Email Address \'' . $email . '\' is already in Use.';
            }
        }
        if (empty($errors) === true && empty($_POST) === false) {
            $query = "INSERT INTO students(first_name, last_name, password, email, gender, reg_no, institution, subject_1, subject_2, subject_3, subject_4) VALUES(?,?,?,?,?,?,?,?,?,?)";
            $stmt  = mysqli_prepare($connection, $query);
            mysqli_stmt_bind_param($stmt, 'ssssssssss', $first_name, $last_name, $hash, $email, $gender, $reg_no, $institution, $subject_1, $subject_2, $subject_3, $subject_4);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            if (!$stmt) {
                die("QUERY FAILED" . mysqli_error($connection));
            }
            die("<div class='alert alert-success'><p class='text-center'>Congrate!! You Have Successfully Registered For Jamb 2018 CBT TEST  <br>
                You will be redirected To Login Page In few seconds</p></div><meta http-equiv='refresh' content='15;url=http://localhost/e-exam/login.php' />");
        } else {
            echo output_errors($errors);
        }
    }
}

function qusTotalNums($exam_id){
    global $mysqli;
    $all_ans_query = "SELECT id FROM questions WHERE course_id = $exam_id";

// Get result
    $all_ans_result = $mysqli->query($all_ans_query) or die($mysqli->error);

    return $all_ans_result->num_rows;
}

function onlyNums($data)
{
    return preg_replace('/\D/', '', $data);
}
function login_user($location)
{
    global $connection;
    if (isset($_POST['login'])) {
        $matric_no       = $_POST['reg_no'];
        $matric_no       = sanitize($matric_no);
        $pin             = sanitize($_POST['pin']);
        $pin             = onlyNums($pin);
        $required_fields = array(
            'reg_no'
        );
        foreach ($_POST as $key => $value) {
            if (empty($value) && in_array($key, $required_fields) === true) {
                $errors[] = 'The Reg No. Field is Required';
                break1;
            }
        }
        if (empty($errors) === true) {
            $seventh   = get_nth($pin, 7);
            $fifteenth = get_nth($pin, 15);
            $pin_exist = user_exit('pins', 'pin', $pin);
            if ((user_exit('students', 'reg_no', $matric_no) === 0)) {
                $errors[] = 'The Reg number you entered is incorrect';
            } else {
                if (strlen($pin) !== 16) {
                    $errors[] = 'Invalid Pin, Make sure you are using a valid scratch card';
                } elseif ($seventh < 5 || $fifteenth > 7) {
                    $errors[] = "The pin you entered is not generated for this CBT";
                } elseif ($pin_exist === 0) {
                    $errors[] = "The pin you entered is invalid";
                } else {
                    $pin_login_exist = user_exit('pin_logins', 'pin', $pin);
                    if ($pin_login_exist > 0) {
                        $last_user_by = getDField('reg_no', 'pin_logins', 'pin', $pin);
                        if ($last_user_by != $matric_no) {
                            $errors[] = "This pin has been used by another student";
                        } else {
                            $usage_count = getDField('usage_count', 'pin_logins', 'pin', $pin);
                            if ($usage_count > 9) {
                                $errors[] = "You have exceeded the usage limit of this scratch card";
                            }
                        }
                    } else {
                        $last_used = date("Y-m-d");
                        $connection->query("INSERT INTO `pin_logins`(pin,reg_no,usage_count,last_used) VALUES('$pin','$matric_no','1','$last_used')");
                    }
                }
            }
            $query             = "SELECT * FROM students WHERE reg_no = '{$matric_no}' LIMIT 1";
            $select_user_query = mysqli_query($connection, $query);
            if (!$select_user_query) {
                die("QUERY FAILED" . mysqli_error($connection));
            }
            while ($row = mysqli_fetch_array($select_user_query)) {
                $db_first_name  = $row['first_name'];
                $db_last_name   = $row['last_name'];
                $db_matric_no   = $row['reg_no'];
                $db_user_id     = $row['id'];
                $db_profile_pic = $row['profile_pic'];
            }
        }
        if (empty($errors) === true && empty($_POST) === false) {
            $_SESSION['userid']       = $db_user_id;
            $_SESSION['reg_no']       = $db_matric_no;
            $_SESSION['name']         = "$db_first_name $db_last_name";
            $_SESSION['profile_pics'] = $db_profile_pic;
            $_SESSION['pin']          = $pin;
            $_SESSION['institution_name']          = getField('value','settings','4');
            redirect(ROOT_URL . $location);
        } else {
            echo output_errors($errors);
        }
    }
}

function nopin_login_user($location)
{
    global $connection;
    if (isset($_POST['login'])) {
        $matric_no       = $_POST['reg_no'];
        $matric_no       = sanitize($matric_no);
        $required_fields = array(
            'reg_no'
        );
        foreach ($_POST as $key => $value) {
            if (empty($value) && in_array($key, $required_fields) === true) {
                $errors[] = 'The Reg No. Field is Required';
                break1;
            }
        }
        if (empty($errors) === true) {

            if ((user_exit('students', 'reg_no', $matric_no) === 0)) {
                $errors[] = 'The Reg number you entered is incorrect';
            }
            $query             = "SELECT * FROM students WHERE reg_no = '{$matric_no}' LIMIT 1";
            $select_user_query = mysqli_query($connection, $query);
            if (!$select_user_query) {
                die("QUERY FAILED" . mysqli_error($connection));
            }
            while ($row = mysqli_fetch_array($select_user_query)) {
                $db_first_name  = $row['first_name'];
                $db_last_name   = $row['last_name'];
                $db_matric_no   = $row['reg_no'];
                $db_user_id     = $row['id'];
                $db_profile_pic = $row['profile_pic'];
            }
        }
        if (empty($errors) === true && empty($_POST) === false) {
            $_SESSION['userid']       = $db_user_id;
            $_SESSION['reg_no']       = $db_matric_no;
            $_SESSION['name']         = "$db_first_name $db_last_name";
            $_SESSION['profile_pics'] = $db_profile_pic;
            $_SESSION['institution_name']          = getField('value','settings','4');
            redirect(ROOT_URL . $location);
        } else {
            echo output_errors($errors);
        }
    }
}
function login_lecturer($location)
{
    global $connection;
    if (isset($_POST['login'])) {
        $staff_id        = $_POST['staff_id'];
        $password        = $_POST['password'];
        $password        = sanitize($password);
        $staff_id        = sanitize($staff_id);
        $password        = md5(md5($password));
        $required_fields = array(
            'password',
            'staff_id'
        );
        foreach ($_POST as $key => $value) {
            if (empty($value) && in_array($key, $required_fields) === true) {
                $errors[] = 'Both fields Are Required';
                break1;
            }
        }
        if (empty($errors) === true) {
            if ((user_exit('teachers', 'staff_id', $staff_id) === 0)) {
                $errors[] = 'Sorry, The Staff ID \'' . $staff_id . '\' does not exit
                ';
            }
            $query             = "SELECT * FROM teachers WHERE staff_id = '{$staff_id}' LIMIT 1";
            $select_user_query = mysqli_query($connection, $query);
            if (!$select_user_query) {
                die("QUERY FAILED" . mysqli_error($connection));
            }
            while ($row = mysqli_fetch_array($select_user_query)) {
                $db_staff_id = $row['staff_id'];
                $db_password = $row['password'];
                ;
                $db_user_id   = $row['id'];
                $db_biometric = $row['biometrics'];
                if ($password != $db_password) {
                    $errors[] = 'password incorrect';
                }
                if ($thumb != $db_biometric) {
                    $errors[] = 'Biometric verification fails';
                }
            }
        }
        if (empty($errors) === true && empty($_POST) === false) {
            if (($password == $db_password) && ($staff_id == $db_staff_id)) {
                $_SESSION['userid']   = $db_user_id;
                $_SESSION['staff_id'] = $db_staff_id;
                $_SESSION['password'] = $db_password;
                redirect(ROOT_URL . $location);
            }
        } else {
            echo output_errors($errors);
        }
    }
}
function login_admin($location)
{
    global $connection;
    if (isset($_POST['login'])) {
        $ac              = $_POST['access_code'];
        $ac              = sanitize($ac);
        $required_fields = array(
            'access_code'
        );
        foreach ($_POST as $key => $value) {
            if (empty($value) && in_array($key, $required_fields) === true) {
                $errors[] = 'The Access Code. Field is Required';
                break1;
            }
        }
        if (empty($errors) === true) {
            if ((user_exit('admins', 'access_code', $ac) === 0)) {
                $errors[] = 'Sorry, The Access Code \'' . $matric_no . '\' Is Not Admin On This System
                ';
            }
            $query             = "SELECT * FROM admins WHERE access_code = '{$ac}' LIMIT 1";
            $select_user_query = mysqli_query($connection, $query);
            if (!$select_user_query) {
                die("QUERY FAILED" . mysqli_error($connection));
            }
            while ($row = mysqli_fetch_array($select_user_query)) {
                $db_name    = $row['name'];
                $db_ac      = $row['access_code'];
                $db_user_id = $row['id'];
                $type       = "admin";
            }
        }
        if (empty($errors) === true && empty($_POST) === false) {
            $_SESSION['userid']      = $db_user_id;
            $_SESSION['access_code'] = $db_ac;
            $_SESSION['name']        = $db_name;
            $_SESSION['user_type']   = $type;
            redirect(ROOT_URL . $location);
        } else {
            echo output_errors($errors);
        }
    }
}
function register()
{
    global $mysqli;
    if (isset($_POST['register'])) {
        $reg_no          = sanitize($_POST['reg_no']);
        $phone           = sanitize($_POST['phone']);
        $email           = sanitize($_POST['email']);
        $first_name      = sanitize($_POST['first_name']);
        $last_name       = sanitize($_POST['last_name']);
        $subjects        = array();
        $subjects[1]     = mysqli_real_escape_string($mysqli, $_POST['subject1']);
        $subjects[2]     = mysqli_real_escape_string($mysqli, $_POST['subject2']);
        $subjects[3]     = mysqli_real_escape_string($mysqli, $_POST['subject3']);
        $subjects[4]     = mysqli_real_escape_string($mysqli, $_POST['subject4']);
        $required_fields = array(
            'name'
        );
        foreach ($_POST as $key => $value) {
            if (empty($value) && in_array($key, $required_fields) === true) {
                $errors[] = 'Fields marked with an asterisk Are Required';
                break1;
            }
        }
        if (empty($errors) === true) {
            if (user_exit('students', 'reg_no', $reg_no) > 0) {
                $errors[] = 'Sorry, The Reg No \'' . $reg_no . '\' is already Registered.';
            }
            if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                $errors[] = 'A valid Email Address is Required';
            }
            if (user_exit('students', 'email', $email) > 0) {
                $errors[] = 'Sorry, The Email Address \'' . $email . '\' is already in Use.';
            }
        }
        if (empty($errors) === true && empty($_POST) === false) {
            $query = "INSERT INTO `students`(reg_no, first_name, last_name, phone, email) VALUES('$reg_no','$first_name', '$last_name', '$phone', '$email')";
            $insert_row = $mysqli->query($query) or die($mysqli->error . __LINE__);
            unset($_SESSION['userid']);
            unset($_SESSION['reg_no']);
            unset($_SESSION['name']);
            $_SESSION['userid'] = $mysqli->insert_id;
            $_SESSION['reg_no'] = $reg_no;
            $_SESSION['name']   = "$first_name $last_name";
            $last_id            = $mysqli->insert_id;
            if ($insert_row) {
                foreach ($subjects as $subject => $value) {
                    if ($value != '') {
                        $query = "INSERT INTO `registered_exams` (student_id, subject_id) 
                VALUES ('$last_id', '$value')";
                        $insert_c_row = $mysqli->query($query) or die($mysqli->error . __LINE__);
                        if ($insert_c_row) {
                            continue;
                        } else {
                            die($mysqli->error . __LINE__);
                        }
                    }
                }
            }
            die("<div class='alert alert-success'><p class='text-center'>Congrate!! You Have Successfully Registered For This Jamb Mock CBT TEST  <br>
                Pls Click The Login Button Below To Login And Start Exam <br><br>
                <a class='btn btn-success' href='login.php'>Login </a></p>
                </div>");
        } else {
            echo output_errors($errors);
        }
    }
}
