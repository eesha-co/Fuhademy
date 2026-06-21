<!DOCTYPE html>
<html>
<head>
    <title>Activation Page
    </title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link href="css/all.min.css" rel="stylesheet">
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <h2>Please activate your application before use
            </h2>
        </div>
        <div class="tab-pane fade active in" role="tabpanel" id="home" aria-labelledby="home-tab">
            <h3>* Please be sure you re connected to the Internet
            </h3>
            <div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Username
                    </label>
                    <input type="text" class="form-control" autofocus id="txtuser" placeholder="Username">
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Phone
                    </label>
                    <input type="tel" class="form-control" id="txtpass" placeholder="Phone">
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Activation Pin
                    </label>
                    <input type="text" class="form-control" id="txtpin" placeholder="Activation Pin">
                </div>
                <div class="form-group">
                    <label for="exampleInputFile">Activator Link
                    </label>
                    <input type="text" value="" placeholder="activator link" class="form-control" id="txtweb">
                </div>
                <button type="submit" id="btnonline" class="btn btn-default">Submit
                </button>
            </div>
        </div>
        <div class="col-xs-12" id="result">
        </div>
    </div>
    <script src="js/jquery.min.js">
    </script>
    <script src="js/bootstrap.min.js">
    </script>
    <script type="text/javascript">$(document).on("click","#btnonline",function(){
                var nama=$("#txtuser").val();
                var pass=$("#txtpass").val();
                var pin=$("#txtpin").val();
                var url=$("#txtweb").val();
                var value={
                    nama:nama, password:pass, url:url, pin:pin, method : "online"};
                $.ajax({
                        url : "inc/obidonictfiles.php", type: "POST", data : value, success: function(data, textStatus, jqXHR){
                            console.log(data);
                            var data=jQuery.parseJSON(data);
                            if(data.value==true){
                                $("#result").html("<h2>Application active!!, Thank you</h2><p>You can login from <a href='admin_login'>this link</a>");
                                $("#xtabbs").html("");
                            }
                            else{
                                $("#result").html("<br><div class='row'><div class='alert alert-danger'>Sorry, failed to activate your application, make sure you entered the right username and phone</div></div>");
                            }
                        }
                        , error: function(jqXHR, textStatus, errorThrown){
                            $("#result").html("<br><div class='row'><div class='alert alert-danger'> error</div></div>");
                        }
                    }
                );
            }
        ) </script>
</body>
</html>
