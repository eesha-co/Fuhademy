<?php require_once("inc/header.php"); ?>


<?php

if(isset($_POST['bulkPin'])){
    if(isset($_POST['checkBoxArray'])){
        foreach($_POST['checkBoxArray'] as $valueId){
            $bulk_options = $_POST['bulk_options'];

            switch($bulk_options){
                case '2':
                    $query = "UPDATE scratch_pins SET status = '{$bulk_options}', date_added = NOW()  WHERE id = {$valueId} ";

                    $update_to_published_status = mysqli_query($connection, $query);

                    confirmQuery($update_to_published_status);

                    break;

            }

        }
    }
}



if(isset($_POST['gen_pin'])){
    $num = (int)$_POST['pin'];

    for ($i = 0; $i < $num; $i++) {

//        if ($i == ) {
//            break;  // this will break both foreach loops
//        }

        $rand = substr(uniqid('', true), -4);
        $r = mt_rand(1,9);
        $char = strtoupper(substr(str_shuffle("abcdefghijklmnopqrstuvwxyz"), 0, 2));
        $serial = $char.$rand.$char.$r.$char;

        $third = $rand;
        $fourth = mt_rand(11,99).mt_rand(10,79);
        $first = mt_rand(1000,9999);
        $second = mt_rand(10,99).mt_rand(50,99);

        $pin = "$first$second$third$fourth";


//
        if (user_exit('scratch_pins', 'pin', $pin ) < 1 && user_exit('scratch_pins','serial',$serial) < 1) {

            $query = "INSERT INTO scratch_pins(pin, serial) VALUES(?,?)";

            $stmt = mysqli_prepare($connection, $query);

            mysqli_stmt_bind_param($stmt, 'ss', $pin, $serial);

            mysqli_stmt_execute($stmt);

            mysqli_stmt_close($stmt);
        }

    }


    redirect('pin_generate.php');

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
                                <h4><i class="fa fa-lg fa-home" aria-hidden="true"></i>  <span class="text-uppercase">All Subjects</span><span class="small"></span>
                                    <span class="pull-right"><button id="showAdd" class="btn btn-default"><i class="fa fa-plus" aria-hidden="true"></i> Generate Pins</button> </span>
                                    <span class="pull-right"><button id="showAdd" class="btn btn-default"><i class="fa fa-plus" aria-hidden="true"></i> Show Options </button> </span>
                                </h4>
                            </div>

                            <div class="panel-body" id="add">
                                <div class="row">
                                    <div class="col-md-12 row">
                                    </div>

                                </div>

                            </div>

                            <div class="panel-body">
                                <div class="row">
                                    <div id="nt_extra" class="panel-body">
                                        <div>
                                            <?php upload_pins_csv() ?>
                                        </div>
                                        <div class="row">
                                            <form class="row form-inline" method="post" enctype="multipart/form-data" role="form">
                                                <div class="form-group col-xs-4">
                                                    <input type="file" class="form-control" placeholder="choose file" name="file">
                                                </div>
                                                <input type="submit" class="col-xs-4 btn btn-primary" name="sub" value="Import CSV">
                                                <button id="showExtra" style="margin-left: 20px" class="btn btn-warning" type="button">Import CSV With Extra Field</button>
                                            </form>

                                        </div>
                                    </div>
                                        <div class="">


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


                                                $st_query = "SELECT * FROM pins";
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
<!--                                                        <td>--><?php //echo formatCreditCard(maskCreditCard($pin)); ?><!--</td>-->
                                                        <td><?php echo formatCreditCard($pin); ?></td>
                                                        <td><?php echo $serial; ?></td>
                                                        <td><?php echo "BT$id"; ?></td>
                                                        <td><?php echo $dt_added->format('d M Y'); ?></td>
                                                        <td><?php echo $expired ?></td>






                                                    </tr>




                                                <?php }?>





                                                </tbody>

                                            </table>

                                            <div class="clearfix"></div>




                                        </div>

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
//                dom: 'Blfrtip'

            } );
        } );


    </script>

    <script type="text/javascript">
        var x = document.getElementById("add");
        x.style.display = "none";
    </script>
    <script>

        $(document).ready(function(){
            $("#showAdd").click(function(){
                $("#add").toggle("slow");
            });

            $("#showOptions").click(function(){
                $("#options").toggle("slow");
            });
//            $("#add").hide();
            $(".delete_link").on('click', function(){
                var id = $(this).attr("rel");

                var delete_url = "sublist.php?id=<?php echo $subject_id ?>&delete="+ id +" ";

                $(".modal_delete_link").attr("href", delete_url);

                $("#myModal").modal('show');


            });
        });

    </script>

<?php include "inc/footer.php"; ?>