<?php
$secret_code = 'benx-technologies';
if (strtoupper(PHP_OS) == strtoupper("LINUX")) {
    $ds      = shell_exec('udevadm info --query=all --name=/dev/sda | grep ID_SERIAL_SHORT');
    $serialx = explode("=", $ds);
    $serial  = $serialx[1];
    $licensi = md5('BENX' . '07081964464' . trim($serial) . $secret_code);
} else {
    if (!function_exists('GetVolumeLabel')) {
        function GetVolumeLabel($drive)
        {
            if (preg_match('#Volume Serial Number is (.*)\n#i', shell_exec('dir ' . $drive . ':'), $m)) {
                $volname = ' (' . $m[1] . ')';
            } else {
                $volname = '';
            }
            return $volname;
        }
    }
    $serial  = str_replace("(", "", str_replace(")", "", GetVolumeLabel("c")));
    $licensi = md5('BENX' . '07081964464' . trim($serial) . $secret_code);
}
$lisfile = $licensi . '.key';
if (!file_exists(__DIR__ . '/' . $lisfile)) {
    redirect('activate');
}
?>