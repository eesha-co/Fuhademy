<div class="sidebar app-aside" id="sidebar">
				<div class="sidebar-container perfect-scrollbar">

<nav>
						
						<!-- start: MAIN NAVIGATION MENU -->
						<div class="navbar-title">
							<span>Main Navigation</span>
						</div>
						<ul class="main-navigation-menu">
							<li class="active">
							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'start'){ echo 'active'; }else{ echo ''; } ?>">

							<a href="<?php echo ROOT_URL ?>">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-home"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Dashboard </span>
										</div>
									</div>
								</a>
							</li>

                            <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'profile' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'profile'){ echo 'active'; }else{ echo ''; } ?>">

                                <a href="<?php echo ROOT_URL ?>profile">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-user"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title"> Profile </span>
                                        </div>
                                    </div>
                                </a>
                            </li>

							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'mock.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'mock'){ echo 'active'; }else{ echo ''; } ?>">
                                <a href="<?php echo ROOT_URL ?>mock">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-clip"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title"> Mock Exam </span>
                                        </div>
                                    </div>
                                </a>
                            </li>


							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'practice_test.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'practice_test'){ echo 'active'; }else{ echo ''; } ?>">

								<a href="<?php echo ROOT_URL ?>practice_test">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-file"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Practice Test </span>
										</div>
									</div>
								</a>
							</li>

                            <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'custom' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'custom'){ echo 'active'; }else{ echo ''; } ?>">

                                <a href="<?php echo ROOT_URL ?>custom">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-clipboard"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title"> Custom Exam </span>
                                        </div>
                                    </div>
                                </a>
                            </li>

							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'registered_exam.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'registered_exams'){ echo 'active'; }else{ echo ''; } ?>">

							<a href="<?php echo ROOT_URL ?>registered_exams">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-list"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Update Subjects </span>
										</div>
									</div>
								</a>
							</li>
                            <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/custom' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'practice_scores' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'mock_score'){ echo 'active'; }else{ echo ''; } ?>">

                                <a href="javascript:void(0)">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-export"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title"> Scores </span><i class="icon-arrow"></i>
                                        </div>
                                    </div>
                                </a>
                                <ul class="sub-menu">

                                    <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'mock_score'){ echo 'active'; }else{ echo ''; } ?>">
                                        <a href="<?php echo ROOT_URL ?>mock_score">
                                            <span class="title"> Mock Scores </span>
                                        </a>
                                    </li>
                                    <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'practice_scores'){ echo 'active'; }else{ echo ''; } ?>">
                                        <a href="<?php echo ROOT_URL ?>practice_scores">
                                            <span class="title"> Practice Scores</span>
                                        </a>
                                    </li>

                                    <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'custom_score'){ echo 'active'; }else{ echo ''; } ?>">
                                        <a href="<?php echo ROOT_URL ?>custom_score">
                                            <span class="title"> Custom Scores</span>
                                        </a>
                                    </li>

                                </ul>
                            </li>


                        </ul>
						<!-- end: CORE FEATURES -->
						
					</nav>
					</div>
			</div>