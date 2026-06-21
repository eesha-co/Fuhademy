<?php

$cars = ['car1', 'car2', 'car3'];

$length = count($cars);

$age=["Peter"=>"35","Ben"=>"37","Joe"=>"43"];

foreach($age as $x=>$x_value)
{
    echo $x . ", Age =" . $x_value . "yrs";
    echo "<br>";
}

//for($x = 0; $x < $length; $x++){
//    $n = $x+1;
//    echo "$n. ".$cars[$x]."<br>";
//}