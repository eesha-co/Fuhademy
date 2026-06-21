<?php include "inc/header.php"; ?>
<div id="app">
	<?php include('inc/sidebar.php');?>
	<div class="app-content">

		<?php include('inc/nav.php');?>

		<!-- end: TOP NAVBAR -->
		<div class="main-content" >
			<div class="wrap-content container" id="container">
				<div class="container" id="content" tabindex="-1">

					<div class="row">

						<div class="metr">
							<a class="metrostyle orgmetro" style="cursor: pointer" href="students">

								<span class="fa fa-users" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px;float:left"></span>
								<span style="color: white; font-size: 1.1em; float: right; margin-top: 5px; padding-right: 0.2em">7</span>
								<span style="color: white; float: left; margin-top: 125px; margin-left: 10px;margin-right:80px">All Students </span>
							</a>
							<a class="metrostyle eenmetro" style="cursor: pointer" href="teachers.php">

								<span class="pe-7s-users" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>
								<span style="color: white; font-size:  1.1em; float: right; margin-top: 5px; padding-right: 0.2em">71</span>
								<span style="color: white; float: left; margin-top: 105px; margin-left: 10px ;margin-right:50px">Teachers</span>

							</a>
							<a style="cursor: pointer" class="metrostyle metrostylelarge  boometro" href="subjects.php">
								<span class="pe-7s-display2" style="font-size:3em;color:white;padding-left:0.3em;margin-top:3px;float:left"></span>
								<span style="color:white;font-size: 1.1em;float:right;margin-top:5px;padding-right:0.2em">37</span>
								<span style="color:white;float:left;margin-top:55px;margin-left:10px;margin-right:10px">All Subjects </span>
							</a>
							<a class="metrostyle reemetro" style="cursor: pointer" href="students_scores.php">
								<span class="pe-7s-ribbon" style="font-size: 4em; color: white; padding-left: 0.3em ; margin-top: 3px ;float:left"></span>
								<span style="color: white; float: left; margin-top: 115px; margin-left: 10px;margin-right:80px">Student Scores </span>
							</a>
							<a class="metrostyle yoometro" style="cursor: pointer" href="settings.php">

								<span class="fa fa-cogs" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>

								<span style="color: white; float: left; margin-top: 125px;">Settings</span>
							</a>
						</div>
						<div class="metr">

							<a style="cursor: pointer" class="metrostyle  reemetro" href="current_students.php">

								<span class="pe-7s-display1" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>
								<span style="color: white; font-size:  1.1em; float: right; margin-top: 5px; padding-right: 0.2em">7</span>
								<span style="color: white; float: left; margin-top: 135px; margin-left: 10px;margin-right:10px">Active Students</span>
							</a>
							<a style="cursor: pointer" class="metrostyle metrostylelarge  toometro">
								<span class="fa fa-ticket" style="font-size: 2em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>
								<span style="color: white; font-size:  1.1em; float: right; margin-top: 5px; padding-right: 0.2em">7</span>
								<span style="color: white; float: left; margin-top: 35px; margin-left: 10px;margin-right:120px">Active Subjects</span>
							</a>
							<a style="cursor: pointer" class="metrostyle yoometro" href="">

								<span class="pe-7s-close" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>
								<span style="color: white; font-size:  1.1em; float: right; margin-top: 5px; padding-right: 0.2em">7</span>
								<span style="color: white; float: left; margin-top: 105px; margin-left: 0px;margin-right:0px">Deactivated Subjects</span>
							</a>

							<a style="cursor: pointer" class="metrostyle  toometro" href="subjects.php">
								<span class="pe-7s-pen" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>
								<span style="color: white; float: left; margin-top: 105px; margin-left: 0px ;margin-right:0px">Set Exams</span>
							</a>
							<a style="cursor: pointer" class="metrostyle  orgmetro"  href="slip.php">
								<span class="fa fa-print" style="font-size: 4em; color: white; padding-left: 0.3em; margin-top: 3px ;float:left"></span>

								<span style="color: white; float: left; margin-top: 135px; ">Print Students Slip</span>
							</a>
						</div>

					</div>
				</div>
			</div>
		</div>
		<!-- end: BASIC EXAMPLE -->






		<!-- end: SELECT BOXES -->

	</div>
</div>

<!-- start: FOOTER -->
<?php include('inc/footer.php');?>
<!-- end: FOOTER -->
