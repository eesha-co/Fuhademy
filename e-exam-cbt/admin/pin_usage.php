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
                                <h4 class="row"><i class="fa fa-lg fa-login" aria-hidden="true"></i>  <span class="text-uppercase">Valid Pin Logins</span><span class="small"></span>
                                </h4>
                            </div>

                            <div class="panel-body">
                                <div class="row">

                                    <div class="table-responsve">


                                        <table id="dataTables" class="table table-bordered table-striped">

                                            <thead>
                                            <tr>

                                                                                        <th>#</th>
                                                <th>PIN</th>
                                                <th>Reg NO</th>

                                                <th>Usage Count</th>
                                                <th>Last Used</th>

                                                <!--                                <th>Action</th>-->
                                            </tr>


                                            </thead>
                                            <tbody>

                                            <?php

                                            $i = 1;


                                            $st_query = "SELECT * FROM pin_logins where usage_count < 10";
                                            $select_questions_query = mysqli_query($connection, $st_query);

                                            if(!$select_questions_query){
                                                die("QUERY FAILED". mysqli_error($connection));
                                            }

                                            while($qs_row = mysqli_fetch_array($select_questions_query)) {

                                                $subject_id = $qs_row['id'];
                                                $pin = $qs_row['pin'];
                                                $reg_no = $qs_row['reg_no'];
                                                $usage_count = $qs_row['usage_count'];
                                                $last_used = $qs_row['last_used'];






                                                ?>
                                                <tr>



                                                                                                <td><?php echo $i++; ?></td>
                                                    <td><?php echo formatCreditCard(maskCreditCard($pin)); ?></td>
                                                    <td><?php echo $reg_no; ?></td>
                                                    <td><?php echo $usage_count; ?></td>
                                                    <td><?php echo $last_used; ?></td>


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


    <script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


    <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>

<?php include "inc/footer.php"; ?>