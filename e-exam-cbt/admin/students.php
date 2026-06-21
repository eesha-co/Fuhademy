<?php require_once("inc/header.php");

$sub = "students_list";

?>

    <div id="app">

        <?php require_once("inc/sidebar.php"); ?>
<div class="app-content">

    <?php
    require_once("inc/nav.php");
    ?>





        <?php

        function upload_csv()
        {
            global $connection;
            if (isset($_POST['import'])) {
//    die($csv->import($_FILES['file']['tmp_name']));

                if ($_FILES['file']['name']) {
                    $filename = explode('.', $_FILES['file']['name']);
                    if ($filename[1] == 'csv') {

                        $handle = fopen($_FILES['file']['tmp_name'], "r");
                        $row = 1;
//                $all = fgetcsv($handle);


                        while ($data = fgetcsv($handle)) {

                            if(!isset($data[3])) {
                                $errors[] = "OPPs, I cannot find Email column";
                            }

                            $first_name = mysqli_real_escape_string($connection, $data[0]);
                            $last_name = mysqli_real_escape_string($connection, $data[1]);
                            $reg_no = mysqli_real_escape_string($connection, $data[2]);
                            $email = mysqli_real_escape_string($connection, $data[3]);
                            $phone = mysqli_real_escape_string($connection, $data[4]);


                            if ($row == 1) {
//                                $class = $data[4];
                                if ($first_name != "First Name") {
//                            print_r($item1);
                                    $errors[] = "The first Column Of Your CSV File is not <strong>First Name</strong>";
                                }
                                if($reg_no != "Reg No"){
                                    $errors[] = "The Third Column Of Your CSV File is not <strong>Reg No</strong>";
                                }

                                if($email != 'Email'){
                                    $errors[] = "Opps The <strong>Email Column</strong> is either missing or not on the 4th column ";
                                }
                            } else {

//                        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
//                            $errors[] = "<strong>$email </strong>is not A valid Email Address, Pls Remove From The List";
//                        }


                                if (empty($errors) === true && empty($_POST) === false) {

//                            if (user_exit('students', 'email', $email) > 0) {
//                                echo "<div class='row alert alert-warning'>
//                            <p>A duplicate email : <strong>$email</strong> detected and removed from the list</p>
//                        </div>";
//                            }else
                                    if (user_exit('students', 'reg_no', $reg_no) > 0) {

                                        echo "<div class='row alert alert-warning'>
                            <p>A duplicate Reg No : <strong>$reg_no</strong> detected and removed from the list</p>
                        </div>";

                                    } else{
                                        $phone = $data[4];

                                        $query = "INSERT INTO students(first_name, last_name, reg_no, email, phone) VALUES(?,?,?,?,?)";

                                        $stmt = mysqli_prepare($connection, $query);

                                        mysqli_stmt_bind_param($stmt, 'sssss', $first_name, $last_name, $reg_no, $email, $phone);

                                        mysqli_stmt_execute($stmt);

                                        mysqli_stmt_close($stmt);

                                        if (!$stmt) {
                                            die("QUERY FAILED" . mysqli_error($connection));
                                        }else {
                                            echo "<div class='row alert alert-success'>
                            <p>Reg No. <strong>$reg_no</strong> Inserted Successfully</p>
                        </div>";
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
                        echo "<div class='row alert-success text-center'>
                                <p>Success!!! <br>

                                    You Have Successfully Uploaded The Students Lists <br>



                                </p>

                            </div><br>";
                    } else{

                        echo output_errors($errors);
                    }
                }
            }

        }
        ?>


        <div class="main-content" >
            <div class="wrap-content" id="container">
                <div class="bg-white">


                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3>List Of All Students <span class="pull-right"><i class="btn btn-success btn-xs" id="showUpload">Import Students</i>
</span> </h3>
                        </div>
                        <div class="panel-body">


                            <div style="display: <?php if(isset($_POST['import'])){ echo " "; }else { echo "none"; } ?>" id="upload" class="panel panel-success">
                                <div class="panel-heading">

                                    <h4>Import Students</h4>
                                </div>
                                <div class="panel-body">
                                    <div>

                                        <?php upload_csv() ?>
                                    </div>
                                    <div class="ro">
                                        <form class="form-inline row" method="post" enctype="multipart/form-data" role="form">
                                            <div class="form-group col-xs-4">

                                                <input type="file" class="form-control" placeholder="choose file" name="file">
                                            </div>
                                            <input type="submit" class="col-xs-4 btn btn-primary" name="import" value="Import students">
                                        </form>
                                    </div>
                                </div>
                            </div>





                            <div class="table-responsive table-bordered">


                                <table id="documents" class="table table-bordred table-striped">

                                    <thead>
                                    <tr>
                                        <th>Seat No</th>
                                        <th>Full Name</th>
                                        <th>Reg No</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Action</th>
                                    </tr>


                                    </thead>
                                    <tbody>

                                    <?php


                                    $st_query = "SELECT * FROM students";
                                    $select_students_query = mysqli_query($connection, $st_query);

                                    if(!$select_students_query){
                                        die("QUERY FAILED". mysqli_error($connection));
                                    }

                                    while($st_row = mysqli_fetch_array($select_students_query)) {

                                        $st_id = $st_row['id'];
                                        $st_first_name = $st_row['first_name'];
                                        $st_last_name = $st_row['last_name'];
                                        $st_reg_no = $st_row['reg_no'];
                                        $st_phone = $st_row['phone'];
                                        $st_email = $st_row['email'];
                                        $st_name = "$st_first_name $st_last_name";



                                        ?>
                                        <tr>


                                            <td><?php echo $st_id; ?></td>
                                            <td><?php echo $st_name; ?></td>
                                            <td><?php echo $st_reg_no; ?></td>
                                            <td><?php echo $st_email; ?></td>
                                            <td><?php echo $st_phone; ?></td>
                                            <td><a rel='<?php echo $st_row['id']; ?>' href='javascript:void(0)' class='delete_link btn btn-danger btn-xs'>Delete User</a></td>









                                        </tr>




                                    <?php }?>





                                    </tbody>

                                </table>
                                <div class="clearfix"></div>




                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </div>




        <?php

        if(isset($_GET['delete'])){
            $the_st_id = sanitize($_GET['delete']);

            $query = "DELETE FROM students WHERE id = {$the_st_id} ";
            $delete_query = mysqli_query($connection, $query);
            header("Location: students.php");
        }

        ?>

        <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
            <div class="modal-dialog">
                <!--        modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Delete Student</h4>

                    </div>
                    <div class="modal-body">
                        <h5>Are you Sure You Want To Delete This Student?</h5>
                    </div>
                    <div class="modal-footer">
                        <a href="" class="btn btn-danger modal_delete_link">Delete</a>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
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

                var delete_url = "students.php?delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#myModal").modal('show');


            });
        });


    </script>


    <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


    <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>


    <script type="text/javascript" src="js/dataTables.buttons.min.js"></script>


    <script type="text/javascript" src="js/buttons.flash.min.js"></script>

    <script type="text/javascript" src="js/pdfmake.min.js"></script>

    <script type="text/javascript" src="js/vfs_fonts.js"></script>


    <script type="text/javascript" src="js/buttons.html5.min.js"></script>
    <script type="text/javascript" src="js/buttons.print.min.js"></script>
    <script type="text/javascript" src="js//jszip.min.js"></script>


    <script type="text/javascript">
        $(document).ready(function() {
            $("#showUpload").click(function(){
                $("#upload").toggle("slow");
            });

            $('#documents').DataTable( {
                "lengthMenu": [ 50, 100, 150, 200, 250, 300],
                dom: 'Blfrtip',
                buttons: [
                    {
                        extend: 'pdf',
                        title: '<?php echo $sub ?>',
                        exportOptions: {
                            columns: [0,1,2,3] // indexes of the columns that should be printed,
                        }                      // Exclude indexes that you don't want to print.
                    },
                    {
                        extend: 'csv',
                        title: '<?php echo $sub ?>',
                        exportOptions: {
                            columns: [0,1,2,3]
                        }

                    },
                    {
                        extend: 'print',
                        title: '<?php echo $sub ?>',
                        exportOptions:{
                            columns: [0,1,2,3,4]
                        }
                    }
                ]

            } );
        } );


    </script>

<?php include "inc/footer.php"; ?>