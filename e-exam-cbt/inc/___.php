<?php
$filename="inc/functions.php";if(file_exists($filename)){$last_modified=date("Y-m-d",filemtime($filename));if($last_modified!='2019-01-22'){redirect('modified');}}else {redirect('modified');}?>