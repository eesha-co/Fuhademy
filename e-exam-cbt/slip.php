<?php include 'database.php';

if(!logged_in()){
    redirect('login.php');
}

$reg_no = $_SESSION['reg_no'];

$student_id = $_SESSION['userid'];

if(isset($_POST['addSubject'])) {
    $subject_id = $_POST['subject_id'];
    $student_id = $_SESSION['userid'];


//    if (user_exit('courses', 'course_code', $course_code ) == 0) {

$registered_query = "SELECT * FROM registered_exams
					   WHERE student_id = $student_id AND course_id = $subject_id";

// Get result
$registeredResult = $mysqli->query($registered_query) or die($mysqli->error);

if($registeredResult->num_rows < 1){

        //Add Course query
        $query = "INSERT INTO `registered_exams`(student_id, course_id) 
        VALUES('$student_id', '$subject_id')";

        //Run query

        $insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

    } else {
        $errors[] = 'Opps, The Subject You Tried Adding, Has Been Added Already .';


    }




}



?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Obidon CBT Exam Registration Slip </title>
    <link rel=stylesheet href="css/bootstrap.min.css" type="text/css" />

    <link rel=stylesheet href="css/style.css" type="text/css" />
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel=stylesheet href="css/sticky-footer-navbar.css" type="text/css" />

</head>
<body>
<header>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="start.php">Obidon CBT Exam Registration Slip </a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">

                <ul class="nav navbar-nav navbar-right">
                    <li><a>Print out Date : <?php echo $date = date('d-M-Y', time()); ?></a></li>

                </ul>
            </div><!--/.nav-collapse -->
        </div>


    </nav>


</header>
<br>
<br>
<div id="wrap">
    <!-- <div class="container" style="margin-top: 10px">
        <img class="row" style="float: left" src="images/logo1.png">
    </div> -->
    <main>
        <div class="container" style="background-image: url('');">
            <div class="row">

                <div class="col-md-12" style="margin-top:40px; padding-right: 80px; padding-left: 80px;">
                                    <div class="col-md-8 col-md-offset-2">

                                        <div class="">
                    <div class="" style="margin-top: ">
                        <?php


                        $query = "SELECT * FROM students WHERE reg_no = '{$reg_no}' LIMIT 1";
                        $select_user_query = mysqli_query($connection, $query);

                        if(!$select_user_query){
                            die("QUERY FAILED". mysqli_error($connection));
                        }

                        while($row = mysqli_fetch_array($select_user_query)){
                            $first_name = $row['first_name'];
                            $last_name = $row['last_name'];
                            $name = $first_name . ' '. $last_name;
                            $matric_no = $row['reg_no'];
                            $course_of_study = $row['institution'];
                            $seat_no = $row['id'];
//                            $department = $row['department'];

                            ?>

                            <div style="padding-left: 200px">

                            <?php if($row['profile_pic'] == "" || $row['profile_pic'] == 'passport.jpg'){ ?>

                         
                            <img class="img-responsive" height="250" width="200" src="images/images.jpg">

                            

                            <?php }else {  ?>

                            <img class="student-img" height="250" width="200" src="images/<?php echo $row['profile_pic']; ?>">
                            <?php } ?>

                        </div>

                            <br>
                            <div class="">
                            
                            <h4>Name : <?php echo $name ?></h4>
                            <h4>Reg No: <?php echo $matric_no ?></h4>
                                <h4>Seat No : <?php echo $seat_no; ?></h4>
                            </div>

                        <?php } ?>

                    </div>


                                        </div>

                    <div class="" >
                        <!-- Category -->
                        <div class="single category">



                            <h3>Subjects </h3><br>
                        

                            <div class="table-responsive">
                                <table class="table table-condensed table-bordered table-hover table-striped">
                                    <thead>
                                    <tr class="text-primary text-capitalize h5">
                                        
                                        <td>Subjects</td>

                                    

                                    </tr>
                                    </thead>
                                    <tbody>


<!--                            <ul class="list-unstyled">-->
                                <?php


                                $query = "SELECT * FROM registered_exams WHERE student_id = '{$student_id}'";
                                $select_user_query = mysqli_query($connection, $query);

                                if(!$select_user_query){
                                    die("QUERY FAILED". mysqli_error($connection));
                                }

                                

                                while($row = mysqli_fetch_array($select_user_query)){

                                $course_id = $row['course_id'];
                                $r_id = $row['id'];

                                $query = "SELECT * FROM courses WHERE id = '{$course_id}'";
                                $select_course_query = mysqli_query($connection, $query);

                                if(!$select_course_query){
                                    die("QUERY FAILED". mysqli_error($connection));
                                }

                                while($row = mysqli_fetch_array($select_course_query)) {

                                $course_code = $row['course_code'];
                                $subject_id = $row['subject_id'];
                                $course_title = $row['course_title'];
                                
                                $exam_id = $row['id'];

                                
                                


                                $date = date('Y-m-d', time());

                              



                                ?>

<tr>
    
    <td><?php echo $course_title ?></td>
    

</tr>
                                <?php } }?>

                                    </tbody>
                                </table>

                        </div>
                    </div>
                </div>

            </div>


                </div>



        </div>


</div>

</main>
</div>







    <div id="footer">
    <div class="container">
        <p class="text-center" style="color: #ffffff">
            copyright &copy; <?php echo date('Y') ?>, Online Examination System Powered by <a href="http://benxtech.com">  <?php echo getField('value','settings','4') ?> </a>

        </p>
    </div>
</div>
</body>

<script type="text/javascript" src="<?php echo ROOT_URL; ?>js/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo ROOT_URL; ?>js/bootstrap.min.js"></script>


<script>


    $(document).ready(function(){
        $(".delete_link").on('click', function(){
            var id = $(this).attr("rel");

            var delete_url = "registered_exam.php?delete="+ id +" ";

            $(".modal_delete_link").attr("href", delete_url);

            $("#mModal").modal('show');


        });
    });


</script>

</html>