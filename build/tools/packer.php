#!/usr/bin/php
<?php
    require 'jsmin-1.1.1.php';

    $args = getopt("i:o:d:");
    $fileArr = explode(" ", $args['i']);

    for($n=0; $n<count($fileArr); $n++) {
        $file = $fileArr[$n];
        $fh = fopen($file, 'r');
        $fileData .= fread($fh, filesize($file));
        fclose($fh);
        if($args['d']) {
            echo "Removing file '$file'...\n";
            unlink($file);
        }
    }
    $outputStr = JSMin::minify($fileData);
    $fh = fopen($args['o'], 'w');
    fwrite($fh, $outputStr);
    fclose($fh);
    echo "Minification completed successfully.\n";
?>
