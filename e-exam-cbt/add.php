<?php include 'database.php' ?>
<?php



if(!isset($_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'])){
	redirect("index.php");
}

$course_id = (int) $_GET['xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs'];

$query = "SELECT * FROM `courses` WHERE id = $course_id";

$select_course_query = mysqli_query($connection, $query);

if(!$select_course_query){
	die("QUERY FAILED". mysqli_error($connection));
}

while($row = mysqli_fetch_array($select_course_query)) {

	$course_code = $row['course_code'];
	$course_title = $row['course_title'];

}




if(isset($_POST['submit'])){
	$qus_no = mysqli_real_escape_string($mysqli, $_POST['qus_no']);
	$qus_text = mysqli_real_escape_string($mysqli, $_POST['qus_text']);
	$correct_choice = mysqli_real_escape_string($mysqli, $_POST['correct_choice']);

	//choices array
	$choices = array();
	$choices[1] = mysqli_real_escape_string($mysqli, $_POST['choice1']);
	$choices[2] = mysqli_real_escape_string($mysqli, $_POST['choice2']);
	$choices[3] = mysqli_real_escape_string($mysqli, $_POST['choice3']);
	$choices[4] = mysqli_real_escape_string($mysqli, $_POST['choice4']);
	$choices[5] = mysqli_real_escape_string($mysqli, $_POST['choice5']);



            $image = sanitize($_FILES['image']['name']);
            $image_temp = sanitize($_FILES['image']['tmp_name']);


            $target_dir = "qusImage/";
            $target_file = $target_dir . basename($_FILES["image"]["name"]);

            $move = move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);


            if(!$move){

                $errors[] = 'Image Upload Failed';

            }

	//Question query
	$query = "INSERT INTO `questions`(qus_no, text, img, course_id) VALUES('{$qus_no}','{$qus_text}','{$image}','{$course_id}')";

	//Run query

	$insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

	//Validate Insert
	if($insert_row){
		foreach ($choices as $choice => $value){
			if($value != ''){
				if($correct_choice == $choice){
					$is_correct = 1;
				} else {
					$is_correct = 0;
				}
				//choice query
				$query = "INSERT INTO `choices` (qus_no, course_id, is_correct, text) 
				VALUES ('$qus_no', '$course_id', '$is_correct', '$value')";

				//Run query

				$insert_row = $mysqli->query($query) or die($mysqli->error.__LINE__);

				//validate insert
				if($insert_row){
					continue;
				} else {
					die($mysqli->error.__LINE__);
				}
			}
		}
		$msg = 'Question Has Been Added Successfully';
	}
}

//Get Total Number

$query = "SELECT * FROM `questions` WHERE course_id = $course_id";

$results = $mysqli->query($query) or die($mysqli->error.__LINE__);
$totalQus = $results->num_rows;

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Online Examination System </title>
		<link rel=stylesheet href="css/bootstrap.min.css" type="text/css" />
		
		<link rel=stylesheet href="css/style.css" type="text/css" />

		<style>

			input[type='text']{
				width: 97%;
				padding: 4px;
				border-radius: 5px;
				border: 1px #000 solid;
			}
			input[type='number']{
				width: 50px;
				padding: 4px;
				border-radius: 5px;
				border: 1px #000 solid;
			}
		</style>
	</head>
	<body>
	<header>
		<nav class="navbar navbar-default navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="<?php echo ROOT_URL ?>lecturer">Online Examination System</a>
				</div>
				<div id="navbar" class="navbar-collapse collapse">

					<ul class="nav navbar-nav navbar-right">
                        <li><a href="<?php ROOT_URL ?>lecturer"> Home</a></li>
						<li><a>Today's Date : <?php echo $date = date('d-M-Y', time()); ?></a></li>
						<li>
							<a href="logout.php?type=lecturers_login.php" class="bg-success pull-right">Logout</a>

						</li>

					</ul>
				</div><!--/.nav-collapse -->
			</div>


		</nav>


	</header>

	<br>
	<br>
		<main>
			<div class="container">
				<div class="row">
					<div class="col-md-6">
						<h3>Course Title : <?php echo $course_title ?></h3>
						<h4>Add More Question</h4>
						<?php
						if(isset($msg)){
							echo '<p>'.$msg.'</p>';
						}
						?>
						<form method="post" enctype="multipart/form-data" action="">
							<p>
								<label>Question Number</label>
								<input type="number" value="<?php echo $totalQus+1; ?>" name="qus_no" />

							</p>
							<p>
								<label>Question Text</label>
<!--								<input type="text" name="qus_text" />-->
                                <textarea name="qus_text" class="form-control" rows="4"></textarea>

                                <div class="row">
                                        <div class=" col-xs-12 col-sm-12 col-md-12">
                                            <div class="form-group">
                                                <label class="row col-sm-7 control-label" for="textinput">Upload : <span class="text-danger">*</span></label>
                                                <div class="row col-sm-6">
                                                    <div class="panel panel-default">
                                                        <div class="panel-body">
                                                            
                                                            <input type="file" name="image" id="image" value="<?php if(isset($_POST['submit'])){ echo $_POST['image'];}  ?>"  class="form-control" placeholder="Licence Number" tabindex="1">


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
							</p>
							<p>
								<label>Choice #1</label>
								<input type="text" name="choice1" />
							</p>
							<p>
								<label>Choice #2</label>
								<input type="text" name="choice2" />
							</p>
							<p>
								<label>Choice #3</label>
								<input type="text" name="choice3" />
							</p>
							<p>
								<label>Choice #4</label>
								<input type="text" name="choice4" />
							</p>
							<p>
								<label>Choice #5</label>
								<input type="text" name="choice5" />
							</p>
							<p>
								<label>Correct Choice Number:</label>
								<input required="" type="number" name="correct_choice" />
							</p>
							<p>

								<input type="submit" name="submit" value="submit" />
							</p>

						</form>
					</div>
					<div class="col-md-6">
<br>
						<div class="panel panel-primary">
							<div class="panel-heading ">

								<p>Questions <span class="pull-right">Total Questions : <?php echo $totalQus ?></span> </p>
							</div>
							<div class="panel-body">

								<div class="pre-scrollable" style="max-height: 75vh">


									<?php

									$query = "SELECT * FROM questions WHERE course_id = '{$course_id}' ORDER BY qus_no ASC";
									$select_user_query = mysqli_query($connection, $query);

									if(!$select_user_query){
										die("QUERY FAILED". mysqli_error($connection));
									}

									while($row = mysqli_fetch_array($select_user_query)) {

										$qus_no = $row['qus_no'];

										?>
										<p class="question"><?php echo $qus_no ?> : <?php echo $row['text']; ?>
											<?php if($row['img'] != ""){ ?>
											<br><img src="qusImage/<?php echo $row['img'] ?>"></img><br>
											<?php } ?>
											<span class="pull-right"><a href="<?php echo ROOT_URL ?>update.php?n=<?php echo $qus_no ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>" class="btn btn-xs btn-warning">Edit</a> 

												<a rel='<?php echo $qus_no ?>' href='javascript:void(0)' class='delete_link'><button class="btn btn-danger btn-xs">Delete</button></a>


											</span> 

										<!-- 	<span class="pull-right"><a href="<?php echo ROOT_URL ?>update.php?n=<?php echo $qus_no ?>&xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>" class="btn btn-xs btn-danger">Delete</a> </span>  -->

										</p>

										<ul class="choices">
											<?php
											$choices_query = "SELECT * FROM choices 
					WHERE qus_no = $qus_no AND course_id = $course_id";

											// Get result
											$choices = $mysqli->query($choices_query) or die($mysqli->error);

											?>

											<?php while($row = $choices->fetch_assoc()): ?>

												<l1><input name="choice" type="radio" value="<?php echo $row['id']; ?>" /><?php echo $row['text']; ?></l1><br>


											<?php endwhile; ?>
											<?php
											$query = "SELECT * FROM `choices` WHERE qus_no = $qus_no AND is_correct = 1 AND course_id = $course_id LIMIT 1";

											//Get Result
											$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

											//Get Row

											$row = $result->fetch_assoc(); ?>

											<p class="text-info">Ans :  <?php echo $row['text']; ?></p>

										</ul>

									<?php }?>
								</div>

							</div>
						</div>


					</div>
				</div>

				
			</div>


<div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!--        modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Delete Question</h4>

            </div>
            <div class="modal-body">
                <h3>Are you Sure You Want To Delete This Question ?</h3>
            </div>
            <div class="modal-footer">
                <a href="" class="btn btn-danger modal_delete_link">Delete</a>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<?php 
if(isset($_GET['delete'])){
    $the_qus_no = sanitize($_GET['delete']);


    $ans_query = "DELETE FROM choices WHERE qus_no = {$the_qus_no} AND course_id = {$course_id}";
    $delete_ans_query = mysqli_query($connection, $ans_query);

    $query = "DELETE FROM questions WHERE qus_no = {$the_qus_no} AND course_id = {$course_id}";
    $delete_query = mysqli_query($connection, $query);

    
    header("Location: add.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=$course_id");
}

?>



		</main>
		<footer class="footer">
			<div class="container">
				copyright &copy; 2018, Online Examination System Developed By Benx Technologies
			</div>
		</footer>



<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>

	<script>

    $(document).ready(function(){
        $(".delete_link").on('click', function(){
            var id = $(this).attr("rel");

            var delete_url = "add.php?xsssdsdxxssdhfdghsjhfjdhdhsjdhdhfjfhsbsdhddjshs=<?php echo $course_id ?>&delete="+ id +" ";

            $(".modal_delete_link").attr("href", delete_url);

            $("#myModal").modal('show');


        });
        });

    </script>
	</body>
</html>