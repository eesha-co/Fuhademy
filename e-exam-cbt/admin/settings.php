<?php require_once("inc/header.php"); ?>

<?php

    $_SESSION['institution_name'] = getField('value','settings','4');
    $_SESSION['institution_logo'] = getField('value','settings','5');
    $_SESSION['institution_slogan'] = getField('value','settings','6');
    $exam_int = getField('value','instructions','1');
    $exam_type = getField('value','settings','2');
    $cvps = getField('value','settings','8');
    $cvms = getField('value','settings','9');
    $cdms = getField('value','settings','10');
    $cdps = getField('value','settings','11');
    $cvcs = getField('value','settings','18');
    $cdcs = getField('value','settings','19');
    $nlp = getField('value','settings','20');
    $exam_time = getField('value','settings','3');
    $c_exam_time = getField('value','settings','17');
    $login = getField('value','settings','16');

    if($c_exam_time == 1){
        $is_c_exam_time = "Yes";
    }
    if($c_exam_time == 0){
        $is_c_exam_time = "No";
    }
    if($login == 1){
        $isLoginPin = "Yes";
    }
    if($login == 0){
        $isLoginPin = "No";
    }


if($exam_type == 'M'){
    $exam_mode = 'Mock Exam';
}
if($exam_type == 'P'){
    $exam_mode = 'Practice Test';
}
if($exam_type == 'C'){
    $exam_mode = 'Custom Exam';
}

$s_query = "SELECT * FROM settings";
$select_settings_query = mysqli_query($connection, $s_query);

if(!$select_settings_query){
    die("QUERY FAILED". mysqli_error($connection));
}
while($row = mysqli_fetch_array($select_settings_query)) {

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

                        <h4><i class="fa fa-lg fa-home" aria-hidden="true"></i>  <span class="text-uppercase">Settings</span><span class="small"></span>
                            <span class="pull-right"><i class="fa fa-lg fa-list" aria-hidden="true"></i> Settings Hitlist</span>
                        </h4>
                    </div>



                    <div class="panel-body">
                        <?php
                        update_inst_info();
                        update_access_setting();
                        update_exam_settings();
                        reset_pin();
                        ?>
                        <div class="ro">
                            <div class="tabbable-panel margin-tops4 ">
                                <div class="tabbable-line">
                                    <ul class="nav nav-tabs tabtop  tabsetting">
                                        <li class="active"> <a href="#tab_default_1" data-toggle="tab"> Institution Information </a> </li>
                                        <li> <a href="#tab_default_2" data-toggle="tab"> Access Control</a> </li>
                                        <li> <a href="#tab_default_3" data-toggle="tab"> Exam Interface </a> </li>
                                        <li> <a href="#tab_default_4" data-toggle="tab"> Exam Settings</a> </li>
                                        <li> <a href="#tab_default_5" data-toggle="tab"> General Settings </a> </li>
                                    </ul>
                                    <div class="tab-content margin-tops">
                                        <div class="tab-pane active fade in" id="tab_default_1">
                                            <div class="col-md-10 col-md-offset-1 wow fadeInRight" data-wow-delay=".8s">
                                                <div class="omb_login text-centr">

                                                    <h3 class="omb_authTitle">Institution Information Settings</h3>


                                                    <hr>


                                                    <div class="row omb_row-sm-offset-">
                                                        <form action="" class="omb_loginForm" enctype="multipart/form-data" method="POST">
                                                            <div class="col-xs-6 col-sm-6">


                                                                <div class="row">
                                                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                                                        <div class="form-group">
                                                                            <label for="email">Institution Name*</label>
                                                                            <input type="text" name="institution_name" id="name" value="<?php if(isset($_SESSION['institution_name'])){ echo $_SESSION['institution_name']; } ?>"  class="form-control" placeholder="Institution Name" tabindex="1" required>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                                                        <div class="form-group">
                                                                            <label for="email">Institution Slogan *</label>
                                                                            <input type="text" name="institution_slogan" id="slogan" value="<?php if(isset($_SESSION['institution_slogan'])){ echo $_SESSION['institution_slogan']; } ?>"  class="form-control" placeholder="Institutiion Slogan" tabindex="1">
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div class="row">
                                                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                                                        <div class="form-group row">
                                                                            <label class="col-sm-7 control-label" for="textinput">Upload Logo : <span class="text-danger">*</span></label>
                                                                            <div class="col-sm-5">
                                                                                <input type="file" name="logo" id="logo" value=""  class="form-control" placeholder="" tabindex="1">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                                                        <div class="form-group row">
                                                                            <input class="btn btn-lg btn-primary btn-block" name="save_inst_settings" type="submit" value="SAVE">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr>





                                                                <!--<span class="help-block">Password error</span>-->



                                                            </div>
                                                        </form>
                                                    </div>



                                                    <div class="row col-12">
                                                        <div class="col-xs-12 col-sm-6">
                                                            <p class="omb_forgotPwd">
                                                                <a href="#"></a>
                                                            </p>
                                                        </div>
                                                        <!--                    <div class="col-xs-12 col-sm-6">-->
                                                        <!--                        <p class="omb_forgotPwd">-->
                                                        <!--                            <a href="#">Forgot password?</a>-->
                                                        <!--                        </p>-->
                                                        <!--                    </div>-->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="tab_default_2">

                                            <div class="col-md-8">
                                                <form class="form-horizontal" method="post">

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                        <label class="control-label" for="full_name">Exam Mode : </label>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <select class="form-control" name="exam_type">

                                                                    <option value="<?php echo $exam_type ?>"><?php echo $exam_mode ?></option>
                                                                <option  value="P">Practical Test</option>
                                                                <option  value="M">Mock Exam</option>
                                                                <option  value="C">Custom Exam</option>

                                                            </select>

                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                        <label class="control-label" for="full_name">Students Can View Practice Score : </label>
                                                        </div>
                                                        <div class="col-md-3">
<!--                                                            <input checked type="checkbox">-->
<!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($cvps){ echo "checked"; } ?> name="cvps" value="1" type="checkbox">
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Students Can View Custom Score : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($cvcs){ echo "checked"; } ?> name="cvcs" value="1" type="checkbox">
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Students Can Delete Custom Score : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($cdcs){ echo "checked"; } ?> name="cdcs" value="1" type="checkbox">
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Students Can Delete Practice Scores : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($cdps){ echo "checked"; } ?> name="cdps" value="1" type="checkbox">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Students Can View Mock Score : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($cvms){ echo "checked"; } ?> name="cvms" value="1" type="checkbox">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Use Exam Time as Custom Exam Time : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($c_exam_time){ echo "checked"; } ?> name="c_exam" value="1" type="checkbox">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Allow Login Without Pin : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($nlp){ echo "checked"; } ?> name="nlp" value="1" type="checkbox">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Students Can Delete Mock Scores : </label>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <!--                                                            <input checked type="checkbox">-->
                                                            <!--                                                            <span class="slider round"></span>-->
                                                            <label class="switch">
                                                                <input <?php if($cdms){ echo "checked"; } ?> name="cdms" value="1" type="checkbox">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div class="">
                                                            <div class="col-xs-12 col-sm-12 col-md-12">
                                                                <div class="form-group">
                                                                    <input class="btn btn-primary btn-block" name="save_access_settings" type="submit" value="SAVE">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </form>
                                            </div>
                                        </div>

                                        <div class="tab-pane fade" id="tab_default_4">

                                            <div class="col-md-8">
                                                <form class="form-horizontal" method="post">
                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Exam Time : </label>
                                                        </div>
                                                        <div class="col-md-7">
                                                            <input class="form-control" id="exam_time" name="exam_time" value="<?php echo $exam_time ?>" placeholder="Enter Exam Time" type="number">

                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Exam Mode : </label>
                                                        </div>
                                                        <div class="col-md-7">
                                                            <select class="form-control" name="exam_type">

                                                                <option value="<?php echo $exam_type ?>"><?php echo $exam_mode ?></option>
                                                                <option  value="P">Practical Test</option>
                                                                <option  value="M">Mock Exam</option>

                                                            </select>

                                                        </div>
                                                    </div>

                                                    <div class="form-group">
                                                        <div class="col-md-5">
                                                            <label class="control-label" for="full_name">Login Without Pin: </label>
                                                        </div>
                                                        <div class="col-md-7">
                                                            <select class="form-control" name="exam_type">

                                                                <option value="<?php echo $exam_type ?>"><?php echo $exam_mode ?></option>
                                                                <option  value="1">Yes</option>
                                                                <option  value="0">No</option>

                                                            </select>

                                                        </div>
                                                    </div>




                                                    <div class="form-group">
                                                        <div class="col-md-3">
                                                            <label class="control-label" for="full_name">End Of Exam Message: </label>
                                                        </div>
                                                        <div class="col-md-9">
                                                            <textarea name="exam_inst" class="form-control myTextarea" rows="4"><?php echo $exam_int ?></textarea>
                                                        </div>
                                                    </div>

                                                    <div class="">
                                                        <div class="col-xs-12 col-sm-12 col-md-12">
                                                            <div class="form-group">
                                                                <input class="btn btn-primary btn-block" name="save_exam_settings" type="submit" value="SAVE">
                                                            </div>
                                                        </div>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="tab_default_5">

                                            <form class="form-horizontal" method="post">
                                                <input type="submit" class="btn btn-success" name="reset" value="Reset Login">
                                            </form>
<br>
<br>
                                            <div class="btn btn-warning">
                                                <p>Note Resetting Login Will Clear only the logins of pin : <strong>7781-2950-2347-7520</strong></p>
                                            </div>

                                            <br>
                                            <br>
                                            <p>pin : <strong>7781-2950-2347-7520</strong></p>

                                        </div>
                                    </div>
                                </div>
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


    $cos_query = "DELETE FROM course WHERE subject_id = {$the_subject_id}";
    $delete_cos_query = mysqli_query($connection, $cos_query);

    $query = "DELETE FROM subjects WHERE id = {$the_subject_id}";
    $delete_query = mysqli_query($connection, $query);


    header("Location: sublist.php");
}

?>


    <script>

//        $(document).ready(function(){
//            $(".delete_link").on('click', function(){
//                var id = $(this).attr("rel");
//
//                var delete_url = "sublist.php?id=<?php //echo $subject_id ?>//&delete="+ id +" ";
//
//                $(".modal_delete_link").attr("href", delete_url);
//
//                $("#myModal").modal('show');
//
//
//            });
//        });

        tinymce.init({
            selector: '.myTextarea'
        });
    </script>

<?php include "inc/footer.php"; ?>