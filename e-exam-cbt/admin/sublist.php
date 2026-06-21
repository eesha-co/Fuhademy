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
                        <div class="panel-heading">
                            <h4><i class="fa fa-lg fa-home" aria-hidden="true"></i>  <span class="text-uppercase">All Subjects</span><span class="small"></span>
                                <span class="pull-right"><button id="showAdd" class="btn btn-default"><i class="fa fa-plus" aria-hidden="true"></i> Add Subject</button> </span>
                            </h4>
                        </div>

                        <div class="panel-body" id="Add">
                            <div class="row">
                                <div class="col-md-12 row">
                                    <div><?php add_new_subject() ?></div>
                                    <form id="add" class="form-inline" method="post" role="form">
                                        <fieldset>

                                            <div class="form-group row">
                                                <label class="col-sm-5 control-label" for="">Subject Name <span class="text-danger">*</span></label>
                                                <div class="col-sm-7">
                                                    <input required type="text" name="name" placeholder="Eg: Mathematics" class="form-control">
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label class="col-sm-5 control-label" for="">Subject Code <span class="text-danger">*</span></label>
                                                <div class="col-sm-7">
                                                    <input required type="text" name="code" placeholder="Eg: Maths" class="form-control">
                                                </div>
                                            </div>





                                            <div class="form-group">
                                                <div class=" ">
                                                    <div class="pull-right">

                                                        <button type="submit" name="add_subject" class="btn btn-primary">Add Subject</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </fieldset>
                                    </form>
                                </div>

                            </div>

                        </div>

                        <div class="panel-body">
                            <div class="row">

                                <?php
                                if(isset($_POST['editSub'])){ ?>

                                    <div class="alert alert-success alert-dismissible">
                                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                                        <strong>Success!</strong> <?php echo $name ?> Updated Successful.
                                    </div>
                                <?php } ?>

                                <?php
                                if(isset($_SESSION['deleted'])){ ?>

                                    <div class="alert alert-success alert-dismissible">
                                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                                        <strong>Success!</strong> Subject Successful Deleted.
                                    </div>

                                    <?php
                                    unset($_SESSION['deleted']);
                                } ?>


                                <div class="table-responsive">


                                    <table id="dataTable" class="table table-bordered table-striped">

                                        <thead>
                                        <tr>

                                            <!--                                        <th>#</th>-->
                                            <th>Name</th>
                                            <th>Code</th>

                                            <th>Edit</th>
                                            <th>Delete</th>

                                            <!--                                <th>Action</th>-->
                                        </tr>


                                        </thead>
                                        <tbody>

                                        <?php

                                        $i = 1;


                                        $st_query = "SELECT * FROM subjects";
                                        $select_questions_query = mysqli_query($connection, $st_query);

                                        if(!$select_questions_query){
                                            die("QUERY FAILED". mysqli_error($connection));
                                        }

                                        while($qs_row = mysqli_fetch_array($select_questions_query)) {

                                            $subject_id = $qs_row['id'];
                                            $name = $qs_row['name'];
                                            $code = $qs_row['code'];






                                            ?>
                                            <tr>



                                                <!--                                            <td>--><?php //echo $i++; ?><!--</td>-->
                                                <td><?php echo $name; ?></td>
                                                <td><?php echo $code; ?></td>


                                                <?php if($subject_id > 23){ ?>
                                                <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit<?php echo $subject_id ?>" ><span class="fa fa-edit"></span></button></p></td>
                                                <td>
                                                    <a rel='<?php echo $subject_id ?>' href='javascript:void(0)' class='delete_link'><button class="btn btn-danger btn-xs">Delete</button></a>
                                                </td>

                                                <?php }else { ?>
                                                    <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn disabled btn-primary btn-xs" data-title="Edit" data-toggle="modal"><span class="fa fa-edit"></span></button></p></td>
                                                    <td>
                                                        <button disabled class="btn btn-danger btn-xs">Delete</button>
                                                    </td>
                                                <?php } ?>


                                                <div class="modal fade" id="edit<?php echo $subject_id ?>" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span class="fa fa-times" aria-hidden="true"></span></button>
                                                                <h4 class="modal-title custom_align" id="Heading">Edit Subject</h4>
                                                            </div>
                                                            <form action="" method="post">
                                                                <div class="modal-body">
                                                                    <div class="form-group">
                                                                        <label>Subject Name</label>
                                                                        <input class="form-control " name="name" value="<?php echo $name ?>"type="text" placeholder="Class Name">
                                                                    </div>

                                                                </div>
                                                                <div class="modal-footer ">

                                                                    <input type="hidden" name="id" value="<?php echo $subject_id ?>" />
                                                                    <input type="submit" class="btn btn-success" name="editSub" value="submit" />
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <!-- /.modal-content -->
                                                    </div>
                                                    <!-- /.modal-dialog -->
                                                </div>








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
                "lengthMenu": [ 20, 30, 40, 50, 60, 70, 100, 200],
                dom: 'Blfrtip'

            } );
        } );


    </script>


    <script>

        $(document).ready(function(){
            $("#showAdd").click(function(){
                $("#add").toggle("slow");
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