<?php
/**
 * Created by PhpStorm.
 * User: Benx Technologies
 * Date: 10/2/18
 * Time: 10:38 AM
 */
?>

<footer>
    <div class="footer-inner">
        <div class="pull-left">
            &copy; <span class="current-year"></span><span class="text-bold text-uppercase"> <?php echo getField('value','settings','4') ?></span>. <span>All rights reserved</span>
        </div>
        <div class="pull-right">
            <span class="go-top"><i class="ti-angle-up"></i></span>
        </div>
    </div>
</footer>



<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>


<script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>


<script type="text/javascript" src="js/dataTables.buttons.min.js"></script>


<script type="text/javascript" src="js/buttons.flash.min.js"></script>

<script type="text/javascript" src="js/pdfmake.min.js"></script>

<script type="text/javascript" src="js/vfs_fonts.js"></script>


<script type="text/javascript" src="js/buttons.html5.min.js"></script>
<script type="text/javascript" src="js/buttons.print.min.js"></script>
<script type="text/javascript" src="js//jszip.min.js"></script>



<!-- start: MAIN JAVASCRIPTS -->

<script src="js/modernizr.js"></script>
<script src="js/jquery.cookie.js"></script>
<script src="js/perfect-scrollbar.min.js"></script>
<script src="js/autosize.js"></script>

<script src="js/select2.min.js"></script>
<script src="js/main.js"></script>




<script type="text/javascript">


    $(document).ready(function(){

        $("#toggleBulk").click(function(){
            $("#bulk").toggle("slow");
        });


        $(".classSelect").change(function () {
            className = $(this).children(':selected').text();
            console.log(className);
            /*
             $(".one option:selected").each(function () {
             Price = newPrice*$(".unit").val();
             });*/

            $(this).next('input').val(className);
        });

                $('#dataTables').DataTable( {
                    "lengthMenu": [ 20, 30, 40, 50, 60, 70, 100, 200],
//                    dom: 'Blfrtip'

                } );

            $('#selectAllBoxes').click(function(event){
                if(this.checked) {
                    $('.checkBoxes').each(function(){
                        this.checked = true;
                    });
                }else {
                    $('.checkBoxes').each(function(){
                        this.checked = false;
                    });
                }
            });



    });


</script>

<script>
    jQuery(document).ready(function() {
        Main.init();
        // FormElements.init();
    });
</script>


</body>

</html>
