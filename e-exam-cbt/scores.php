
<?php require_once("inc/header.php"); ?>

<div id="app">

    <?php require_once("inc/sidebar.php"); ?>

    <div class="app-content">

        <?php
        require_once("inc/nav.php");
        ?>
        <div class="main-content">
            <div class="wrap-content" id="container">
                <div class="col-md-12">

                    <div class="row">
                        <div class="panel panel-default">
                            <div class="panel-body" id="Add">
                                <div class="" style="margin-top: 20px">
                                    <center>
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
                                        $email = $row['email'];
                                        $phone = $row['phone'];
                                        $u_institution = $row['institution'];

                                        //                            $department = $row['department'];

                                        ?>

                                        <?php if($row['profile_pic'] == "" || $row['profile_pic'] == 'passport.jpg'){ ?>

                                            <img src="images/images.jpg" name="aboutme" width="140" height="140" border="0" class="img-circle">

                                        <?php }else {  ?>
                                            <img src="images/<?php echo $row['profile_pic']; ?>" name="aboutme" width="140" height="140" border="0" class="img-circle">
                                        <?php } ?>
                                        <h3 class="media-heading"><?php echo $name ?></small></h3>
                                        <span><strong>Subjects: </strong></span>
                                        <?php
                                        $query = "SELECT * FROM registered_exams WHERE student_reg = '{$reg_no}'";
                                        $select_user_query = mysqli_query($connection, $query);

                                        if(!$select_user_query){
                                            die("QUERY FAILED". mysqli_error($connection));
                                        }

                                        if($select_user_query->num_rows < 1){
                                            echo '
                                    <p class="text-center"><br><span class="text-danger">You Dont Have Any Registered Subject</span> <br><br>
                                    <a class="btn btn-success" href="registered_exams">Add Subjects</a></p>';
                                        } else {

                                            while($row = mysqli_fetch_array($select_user_query)){

                                                $subject_id = $row['subject_id'];
                                                ?>
                                                <span class="label label-success"><?php echo getField('name','subjects',$subject_id) ?></span>


                                            <?php }} }?>

                                    </center>
                                    <hr>
                                    <div class="" style="margin-top: ">

                                        <div class="row">
                                            <div class="col-md-8 col-md-offset-2" style="margin-top: 30px">
                                                <div class="text-center">
                                                    <a class="btn btn-success" href="<?php echo ROOT_URL?>">Back To Dashboard</a>
                                                </div><br>


                                                <div class="alert alert-success">

                                                    <h3>Congrat! <?php echo $_SESSION['name'] ?></h3>

                                                    <?php
                                                    $exam_inst = getField('value','instructions','1');
                                                    echo htmlspecialchars_decode(stripslashes($exam_inst))  ?>




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


    </div>


    <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


    <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>

    <?php include "inc/footer.php"; ?>
