<?php require_once("inc/header.php"); ?>


<?php

if(isset($_POST['bulkPinPrint'])){
    if(isset($_POST['checkBoxArray'])){
        foreach($_POST['checkBoxArray'] as $valueId){
            $bulk_options = $_POST['bulk_options'];

            switch($bulk_options){
                case '1':
                    $query = "UPDATE scratch_pins SET status = '{$bulk_options}' WHERE id = {$valueId} ";

                    $update_to_published_status = mysqli_query($connection, $query);

                    confirmQuery($update_to_published_status);

                    break;

            }

        }
    }
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
                <div class="col-md-12">

                    <div class="row">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4><i class="fa fa-lg fa-home" aria-hidden="true"></i>  <span class="text-uppercase">Print Pins </span><span class="alert alert-warning">Make Sure You Move Printed Pins To Printed</span> <span class="small"></span>
                                    <span class="pull-right"><button id="showOptions" class="btn btn-default"><i class="fa fa-plus" aria-hidden="true"></i> Show Options </button> </span>
                                </h4>
                            </div>

                            <div class="panel-body">
                                <div class="row">

                                    <?php
                                    if(isset($_POST['bulkPinPrint'])){ ?>

                                        <div class="alert alert-success alert-dismissible">
                                            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                                            <strong>Success!</strong> <?php echo $pin ?> Pins Successfully Moved To Printed Click <a href="printed_pins.php">HERE</a> To See Printed Pins
                                        </div>
                                    <?php } ?>

                                    <form method="post" name="main">
                                        <div class="panel panel-success" id="bulkOption">
                                            <div class="panel-body">

                                                <div id="bulkOptionContainer" class="col-md-4" style="
                padding: 0px;">
                                                    <select class="form-control" name="bulk_options" id="">
                                                        <option value="1">Move To Printed</option>
                                                    </select>

                                                </div>

                                                <div class="col-md-4">
                                                    <input type="submit" name="bulkPinPrint" class="btn btn-success" value="Apply">
                                                </div>



                                            </div>
                                        </div>

                                        <div class="table-responsive">


                                            <table id="dataTable" class="table table-bordered table-striped">

                                                <thead>
                                                <tr>

                                                    <th width="1%"><input id="selectAllBoxes" type="checkbox" name="checkbox" value=""></th>
                                                    <th>No</th>
                                                    <th>Pin</th>
                                                    <th>Serial</th>
                                                    <th>Pin Id</th>
                                                    <th width="10%">Date Added</th>
                                                    <th>Expiry Date</th>
                                                </tr>


                                                </thead>
                                                <tbody>

                                                <?php

                                                $i = 1;


                                                $st_query = "SELECT * FROM scratch_pins WHERE status = 2";
                                                $select_questions_query = mysqli_query($connection, $st_query);

                                                if(!$select_questions_query){
                                                    die("QUERY FAILED". mysqli_error($connection));
                                                }

                                                while($qs_row = mysqli_fetch_array($select_questions_query)) {

//                                                $subject_id = $qs_row['id'];
                                                    $pin = $qs_row['pin'];
                                                    $id = $qs_row['id'];
                                                    $serial = $qs_row['serial'];
                                                    $date_added = $qs_row['date_added'];
                                                    $expired = strtotime ( '+2 years' , strtotime ( $date_added ) ) ;
                                                    $expired = date ( 'j M Y' , $expired );
                                                    $dt_added = new DateTime($date_added);
                                                    ?>
                                                    <tr>

                                                        <td><input class="checkBoxes" type="checkbox" name="checkBoxArray[]" value='<?php echo $id; ?>'></td>


                                                        <td><?php echo $i++; ?></td>
                                                        <td><?php echo formatCreditCard($pin); ?></td>
                                                        <td><?php echo $serial; ?></td>
                                                        <td><?php echo "BT$id"; ?></td>
                                                        <td><?php echo $date_added; ?></td>
                                                        <td><?php echo $expired ?></td>






                                                    </tr>




                                                <?php }?>





                                                </tbody>

                                            </table>

                                            <div class="clearfix"></div>




                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>


                        <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="false">
                            <div class="modal-dialog">
                                <!--        modal content-->
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Delete Subject</h4>

                                    </div>
                                    <div class="modal-body">
                                        <h5>Are you Sure You Want To Delete This Subject?</h5>
                                        <p>Note : If you delete this Subject all associated exams will be deleted as well</p>
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
            </div>
        </div>


    </div>





<?php
if(isset($_GET['delete'])){
    $the_subject_id = sanitize($_GET['delete']);


    $cos_query = "DELETE FROM exams WHERE subject_id = {$the_subject_id}";
    $delete_cos_query = mysqli_query($connection, $cos_query);

    $query = "DELETE FROM subjects WHERE id = {$the_subject_id}";
    $delete_query = mysqli_query($connection, $query);

    $_SESSION['deleted'] = '1';


    header("Location: sublist.php");
}

?>
    <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


    <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>


    <script type="text/javascript">
        $(document).ready(function() {

            $('#dataTable').DataTable( {
                "lengthMenu": [ 500, 1000, 1500, 2000, 3000, 4000, 5000, 6000],
                dom: 'Blfrtip',
                buttons: [
                    // 'copy', 'csv', 'excel', 'pdf', 'print'
                    {
                        extend: 'pdf',
                        title: '',
                        exportOptions: {
                            columns: [1,2,3,4,5,6] // indexes of the columns that should be printed,
                        }                      // Exclude indexes that you don't want to print.
                    },
                    {
                        extend: 'csv',
                        title: '',
                        exportOptions: {
                            columns: [2,3,5]
                        }

                    },

                ]

            } );
        } );


    </script>

    <script type="text/javascript">
        var x = document.getElementById("bulkOption");
        x.style.display = "none";
    </script>
    <script>

        $(document).ready(function(){

            $("#showOptions").click(function(){
                $("#bulkOption").toggle("slow");
            });
            $(".delete_link").on('click', function(){
                var id = $(this).attr("rel");

                var delete_url = "sublist.php?id=<?php echo $subject_id ?>&delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#myModal").modal('show');


            });
        });

    </script>

<?php include "inc/footer.php"; ?>