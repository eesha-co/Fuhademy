<?php include 'inc/head.php';

if(!logged_in()){
    redirect('login.php');
}
if(!isset($_GET['t'])){
    redirect('login.php');
}else{
    $type = $_GET['t'];
}
?>


<div id="wrap">
    <br>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-offset-3 col-md-6" style="margin-top: 100px">


                    <?php if($type == 'q.n.e'){ ?>

                        <div class="alert alert-warning">
                            <strong>Error!</strong> The Current Question Number You Tried To Access Does not Exit,
                            <p>Call Exam Supervisor/Administrator To Attend to this</p>
                            <hr class="row">
                            <h4>Possible Solution</h4>
                            <p>Make sure the accessed subject have correct question number sequence,<br> i.e No question number missing</p>
                        </div>
                    <?php }else if($type == 'e.id.e'){ ?>

                        <div class="alert alert-warning">
                            <strong>Error!</strong> There is an error with some of your registered jamb subjects, <br>

                            <p>Call Exam Supervisor/Administrator To Attend to this</p>
                            <hr class="row">
                            <h4>Possible Solution</h4>
                            <p><strong>If exam mode is 'PRACTICAL'</strong>
                                <br>Make sure the selected practice year have all subjects set
                                <br>
                                <strong>If exam mode is 'MOCK'</strong>
                                <br>Make sure all subjects are set for the present mock exam

                            </p>
                        </div>
                    <?php } ?>
                    </div>
            </div>
        </div>


</div>


</main>
</div>



<div id="footer">
    <div class="container">
        <p class="text-center" style="color: #ffffff">
            copyright &copy;  <?php echo date('Y') ?>, Online Examination System Powered by <a href="http://benxtech.com">  <?php echo getField('value','settings','4') ?> </a>

        </p>
    </div>
</div>
</body>
</html>