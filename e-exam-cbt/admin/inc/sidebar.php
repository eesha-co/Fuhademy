<div class="sidebar app-aside" id="sidebar">
				<div class="sidebar-container perfect-scrollbar">

<nav>
						
						<!-- start: MAIN NAVIGATION MENU -->
						<div class="navbar-title">
							<span>Main Navigation</span>
						</div>
						<ul class="main-navigation-menu">
							<li class="active">
							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/index.php'){ echo 'active'; }else{ echo ''; } ?>">

							<a href="<?php echo ADMIN_ROOT_URL ?>">
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
							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/students.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/students'){ echo 'active'; }else{ echo ''; } ?>">
                                <a href="<?php echo ADMIN_ROOT_URL ?>students">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-user"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title"> Students </span>
                                        </div>
                                    </div>
                                </a>
                            </li>

							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/custom' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/subjects' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/past_questions'){ echo 'active'; }else{ echo ''; } ?>">

							<a href="javascript:void(0)">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-export"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Exams List </span><i class="icon-arrow"></i>
										</div>
									</div>
								</a>
								<ul class="sub-menu">
									
									<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/subjects'){ echo 'active'; }else{ echo ''; } ?>">
										<a href="<?php echo ADMIN_ROOT_URL ?>subjects">
											<span class="title"> Manage Mock Exams </span>
										</a>
									</li>
									<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/past_questions'){ echo 'active'; }else{ echo ''; } ?>">
										<a href="<?php echo ADMIN_ROOT_URL ?>past_questions">
											<span class="title"> Manage Practice Exams </span>
										</a>
									</li>

                                    <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/custom'){ echo 'active'; }else{ echo ''; } ?>">
                                        <a href="<?php echo ADMIN_ROOT_URL ?>custom">
                                            <span class="title"> Custom Exams </span>
                                        </a>
                                    </li>
									
								</ul>
								</li>

							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/sublist.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/sublists'){ echo 'active'; }else{ echo ''; } ?>">

								<a href="<?php echo ADMIN_ROOT_URL ?>sublists">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-file"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Manage Subjects </span>
										</div>
									</div>
								</a>
							</li>

							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/scores.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/scores'){ echo 'active'; }else{ echo ''; } ?>">

							<a href="<?php echo ADMIN_ROOT_URL ?>scores">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-list"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Mock Scores </span>
										</div>
									</div>
								</a>
							</li>

                            <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/custom_scores' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/custom_scores'){ echo 'active'; }else{ echo ''; } ?>">

                                <a href="<?php echo ADMIN_ROOT_URL ?>custom_scores">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-reddit"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title"> Custom Scores </span>
                                        </div>
                                    </div>
                                </a>
                            </li>

							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/p_scores.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/practice_scores'){ echo 'active'; }else{ echo ''; } ?>">

							<a href="<?php echo ADMIN_ROOT_URL ?>practice_scores">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-marker"></i>
										</div>
										<div class="item-inner">
											<span class="title"> Practice Scores </span>
										</div>
									</div>
								</a>
							</li>





							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/pin_usage.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/pin_logins'){ echo 'active'; }else{ echo ''; } ?>">
							<a href="<?php echo ADMIN_ROOT_URL ?>pin_logins">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-rocket"></i>
										</div>
										<div class="item-inner">
											<span class="title">  Pin Logins </span>
										</div>
									</div>
								</a>
							</li>


							<li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/settings.php' || $_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/settings'){ echo 'active'; }else{ echo ''; } ?>">
								<a href="<?php echo ADMIN_ROOT_URL ?>settings">
									<div class="item-content">
										<div class="item-media">
											<i class="ti-settings"></i>
										</div>
										<div class="item-inner">
											<span class="title">  Settings </span>
										</div>
									</div>
								</a>
							</li>

                            <li class="<?php if($_SERVER['REQUEST_URI'] == REQUEST_ROOT.'admin/manage_the_pins'){ echo 'active'; }else{ echo ''; } ?>">
                            <a href="<?php echo ADMIN_ROOT_URL ?>manage_the_pins">
                                    <div class="item-content">
                                        <div class="item-media">
                                            <i class="ti-new-window"></i>
                                        </div>
                                        <div class="item-inner">
                                            <span class="title">  Manage Pins </span>
                                        </div>
                                    </div>
                                </a>
                            </li>


                        </ul>
						<!-- end: CORE FEATURES -->
						
					</nav>
					</div>
			</div>