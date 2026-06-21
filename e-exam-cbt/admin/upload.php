<?php require_once("inc/header.php"); ?>
<?php

$csv = new csv();


if(isset($_GET['sub']) && isset($_GET['id'])  ){


    $sub = $_GET['sub'];

    $course_id = $_GET['id'];


    $query = "SELECT * FROM questions WHERE course_id = $course_id";

    $results = $mysqli->query($query) or die($mysqli->error);

//    $select_sub_query = mysqli_query($connection, $query);

    $class = $results->fetch_assoc();

    $totalQus = $results->num_rows;

    function upload_csv()
    {
        $sub = $_GET['sub'];
        $course_id = $_GET['id'];
        global $connection,$mysqli;
        if (isset($_POST['sub'])) {
//    die($csv->import($_FILES['file']['tmp_name']));

            if ($_FILES['file']['name']) {
                $filename = explode('.', $_FILES['file']['name']);
                if ($filename[1] == 'csv') {

                    $handle = fopen($_FILES['file']['tmp_name'], "r");
                    $row = 1;
                    while ($data = fgetcsv($handle)) {

                        if(!isset($data[7])) {
                            $errors[] = "OPPs, I cannot find Answer column";
                        }

                            $qus_no = mysqli_real_escape_string($connection, $data[0]);
                            $qus_text = mysqli_real_escape_string($connection, $data[1]);


                        $choices = array();
                        $choices[1] = mysqli_real_escape_string($connection, $data[2]);
                        $choices[2] = mysqli_real_escape_string($connection, $data[3]);
                        $choices[3] = mysqli_real_escape_string($connection, $data[4]);
                        $choices[4] = mysqli_real_escape_string($connection, $data[5]);
                        $choices[5] = mysqli_real_escape_string($connection, $data[6]);

                        $correct_choice = mysqli_real_escape_string($connection, $data[7]);




                        if ($row == 1) {
                            if ($qus_no != "Qus_No") {
//                            print_r($item1);
                                $errors[] = "The first row of your question number column failed our validation, 
                            pls ensure that the csv file follows the specified format";

                            }
                        } else {

                            // check if question number is integer
                            if (is_numeric($qus_no) == false) {
                                $errors[] = "OPPs!!! I Found $qus_no as a Question Number and $qus_no is not a valid integer, Pls Check The CSV file";
                            }

                            // check for repeated question number
                            $qus_query = "SELECT * FROM questions WHERE course_id = $course_id AND qus_no = $qus_no";

                            $results = $connection->query($qus_query) or die($connection->error . __LINE__);

                            if ($results->num_rows > 0) {
                                $errors[] = "Question Number $qus_no already exit, view the exiting questions and make sure Your CSV file doesnt have repeated/missing question number";
                            }

                            if (empty($errors) === true && empty($_POST) === false) {
                                $query = "INSERT INTO questions(qus_no, text, course_id) VALUES(?,?,?)";

                                $stmt = mysqli_prepare($connection, $query);

                                mysqli_stmt_bind_param($stmt, 'isi', $qus_no, $qus_text, $course_id);

                                mysqli_stmt_execute($stmt);

                                mysqli_stmt_close($stmt);

                                if (!$stmt) {
                                    die("QUERY FAILED" . mysqli_error($connection));
                                }else {
                                    foreach ($choices as $choice => $value){
                                        if($value != ''){

                                            if(strtolower($correct_choice) == strtolower($value)){
                                                $is_correct = 1;
                                            } else {
                                                $is_correct = 0;
                                            }

                                            //choice query
                                            $query = "INSERT INTO `choices` (qus_no, course_id, is_correct, text) VALUES ('$qus_no', '$course_id', '$is_correct', '$value')";
//                                            $query = "INSERT INTO `test_choice` (qus_no, course_id, text) VALUES ('$qus_no', '$course_id', '$value')";

                                            //Run query

                                            $insert_row = $connection->query($query) or die($connection->error.__LINE__);

                                            //validate insert
                                            if($insert_row){
                                                continue;
                                            } else {
                                                die($connection->error.__LINE__);
                                            }
                                        }
                                    }
                                }
                            }


                        }

                        ++$row;


                    }
                    fclose($handle);

                } else {
                    $errors[] = "The File You Selected is Not A CSV file";

                }
                if (empty($errors)) {
                                                echo "<div class=\"alert alert-success alert-dismissible\">
                                    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>
                                    <strong>Success!</strong> You have Successfully Uploaded $sub Questions.
                                </div>";

                } else{

                    echo output_errors($errors);
                }
            }
        }

    }

    function upload_extra()
    {
        $sub = $_GET['extra'];
        $course_id = $_GET['id'];
        global $connection,$mysqli;
        if (isset($_POST['extra'])) {
//    die($csv->import($_FILES['file']['tmp_name']));

            if ($_FILES['file']['name']) {
                $filename = explode('.', $_FILES['file']['name']);
                if ($filename[1] == 'csv') {

                    $handle = fopen($_FILES['file']['tmp_name'], "r");
                    $row = 1;
                    while ($data = fgetcsv($handle)) {

                        if(!isset($data[8])) {
                            $errors[] = "OPPs, I cannot find Answer column";
                        }

                        $qus_no = mysqli_real_escape_string($connection, $data[0]);
                        $qus_text = mysqli_real_escape_string($connection, $data[1]);
                        $qus_extra = mysqli_real_escape_string($connection, $data[2]);


                        $choices = array();
                        $choices[1] = mysqli_real_escape_string($connection, $data[3]);
                        $choices[2] = mysqli_real_escape_string($connection, $data[4]);
                        $choices[3] = mysqli_real_escape_string($connection, $data[5]);
                        $choices[4] = mysqli_real_escape_string($connection, $data[6]);
                        $choices[5] = mysqli_real_escape_string($connection, $data[7]);

                        $correct_choice = mysqli_real_escape_string($connection, $data[8]);




                        if ($row == 1) {
                            if ($qus_no != "Qus_No") {
//                            print_r($item1);
                                $errors[] = "The first row of your question number column failed our validation, 
                            pls ensure that the csv file follows the specified format";

                            }
                        } else {

                            // check if question number is integer
                            if (is_numeric($qus_no) == false) {
                                $errors[] = "OPPs!!! I Found $qus_no as a Question Number and $qus_no is not a valid integer, Pls Check The CSV file";
                            }

                            // check for repeated question number
                            $qus_query = "SELECT * FROM questions WHERE course_id = $course_id AND qus_no = $qus_no";

                            $results = $connection->query($qus_query) or die($connection->error . __LINE__);

                            if ($results->num_rows > 0) {
                                $errors[] = "Question Number $qus_no already exit, view the exiting questions and make sure Your CSV file doesnt have repeated/missing question number";
                            }

                            if (empty($errors) === true && empty($_POST) === false) {
                                $query = "INSERT INTO questions(qus_no, text, extra, course_id) VALUES(?,?,?,?)";

                                $stmt = mysqli_prepare($connection, $query);

                                mysqli_stmt_bind_param($stmt, 'issi', $qus_no, $qus_text, $qus_extra, $course_id);

                                mysqli_stmt_execute($stmt);

                                mysqli_stmt_close($stmt);

                                if (!$stmt) {
                                    die("QUERY FAILED" . mysqli_error($connection));
                                }else {
                                    foreach ($choices as $choice => $value){
                                        if($value != ''){

                                            if(strtolower($correct_choice) == strtolower($value)){
                                                $is_correct = 1;
                                            } else {
                                                $is_correct = 0;
                                            }

                                            //choice query
                                            $query = "INSERT INTO `choices` (qus_no, course_id, is_correct, text) VALUES ('$qus_no', '$course_id', '$is_correct', '$value')";
//                                            $query = "INSERT INTO `test_choice` (qus_no, course_id, text) VALUES ('$qus_no', '$course_id', '$value')";

                                            //Run query

                                            $insert_row = $connection->query($query) or die($connection->error.__LINE__);

                                            //validate insert
                                            if($insert_row){
                                                continue;
                                            } else {
                                                die($connection->error.__LINE__);
                                            }
                                        }
                                    }
                                }
                            }


                        }

                        ++$row;


                    }
                    fclose($handle);

                } else {
                    $errors[] = "The File You Selected is Not A CSV file";

                }
                if (empty($errors)) {
                    echo "<div class=\"alert alert-success alert-dismissible\">
                                    <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>
                                    <strong>Success!</strong> You have Successfully Uploaded $sub Questions.
                                </div>";

                } else{

                    echo output_errors($errors);
                }
            }
        }

    }





}else {
    redirect('subjects.php');
}

?>
<div id="app">

    <?php require_once("inc/sidebar.php"); ?>

    <div class="app-content">

        <?php
        require_once("inc/nav.php");
        ?>

        <div class="main-content">
            <div class="wrap-content" id="container">
                <div class="bg-white">
                        <div class="">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4><i class="fa fa-lg fa-book" aria-hidden="true"></i>  <span class="text-uppercase"><?php echo $sub ?> Questions</span><span class="small"></span>
                                        <span class="pull-right"><i class="fa fa-lg fa-list" aria-hidden="true"></i> Subjects Hitlist</span>
                                    </h4>
                                </div>

                                <div class="panel-body">
                                    <div class="row">

                                        <div class="col-md-12">
                                            <h3>Subject Details</h3>
                                            <p class="info">Note The normal</p>

                                            <div <?php if (isset($_POST['extra'])){ ?> style="display: none" <?php } ?>  id="extra" class="panel-body">
                                                <div>
                                                    <?php upload_csv() ?>
                                                </div>
                                                <div class="row">
                                                    <form class="row form-inline" method="post" enctype="multipart/form-data" role="form">
                                                        <div class="form-group col-xs-4">

                                                            <input type="file" class="form-control" placeholder="choose file" name="file">
                                                        </div>
                                                        <input type="submit" class="col-xs-4 btn btn-primary" name="sub" value="Import CSV">
                                                        <button id="showExtra" style="margin-left: 20px" class="btn btn-warning" type="button">Import CSV With Extra Field</button>
                                                        <!--                            <input type="submit" class="col-xs-4 btn btn-primary" name="sub" value="Import CSV">-->
                                                    </form>

                                                </div>

                                            </div>

                                            <div <?php  if (!isset($_POST['extra'])){ ?> style="display: none" <?php } ?> id="nt_extra" class="panel-body">
                                                <div>
                                                    <?php upload_extra() ?>
                                                </div>
                                                <div class="row">
                                                    <form class="row form-inline" method="post" enctype="multipart/form-data" role="form">
                                                        <div class="form-group col-xs-4">

                                                            <input type="file" class="form-control" placeholder="choose file" name="file">
                                                        </div>
                                                        <input type="submit" class="col-xs-4 btn btn-primary" name="extra" value="Import CSV">
                                                        <button id="hideExtra" style="margin-left: 20px" class="btn btn-warning" type="button">Import Ordinary CSV</button>
                                                        <!--                            <input type="submit" class="col-xs-4 btn btn-primary" name="sub" value="Import CSV">-->
                                                    </form>

                                                </div>

                                            </div>

                                            <div class="table-responsive">


                                                <table id="" class="table table-bordred table-striped">

                                                    <thead>
                                                    <tr>


                                                        <th>Name</th>
                                                        <!--                                        <th>Class</th>-->
                                                        <th>Questions</th>
                                                        <th>View Question</th>
                                                        <th>Export Question</th>
                                                        <th>Note</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>


                                                        <th><?php echo $sub ?></th>
                                                        <!--                                        <th></th>-->
                                                        <th><?php echo $totalQus ?></th>
                                                        <td><a class="btn btn-primary btn-xs" href="set_questions.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>">Edit Question</a></td>
                                                        <td><a class="btn btn-success btn-xs" href="exam_qus.php?id=<?php echo $course_id ?>">View / Export</a></td>
                                                        <th>Make Sure You Upload CSV of This Particular Subject, <br>Any Error in Your CSV will Make Subject not Examinable</th>

                                                    </tr>
                                                    </tbody>

                                                    </table>


                                            </div>
                                        </div>



                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
            </div>

        </div>
</div>
</div>

    <script type="text/javascript">
        $("#showExtra").click(function(){
            $("#extra").toggle("slow");
            $("#nt_extra").toggle("slow");
        });

        $("#hideExtra").click(function(){

            $("#nt_extra").toggle("slow");
            $("#extra").toggle("slow");
        });
    </script>


<?php include "inc/footer.php"; ?>