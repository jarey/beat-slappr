<?php 
    require_once "api/classes/base64.inc.php";

    function getFiles($dir) {
        $b64 = new Base64();
        if ($handle = opendir($dir)) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != ".." && !preg_match("/wav/", $file)) {
                    $file = $dir . '/' . $file;
                    if(is_dir($file)) {
                        getFiles($file);
                    }else if(is_file($file) && preg_match("/(ogg|mp3)$/", $file)) {
                        echo "<span class='fileHeading'>" . $file . " (" . filesize($file) . " bytes)</span><br /><textarea readonly='readonly' onfocus='this.select(); return false;' onclick='this.select(); return false;'>" . $b64->encode($file) . "</textarea>";
                    }
                }
            }
            closedir($handle);
        }
    }
?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Beat Slappr Encoder</title>
        <style>
            body {
                font-family: arial;
                color: #2a2a2a;
                background-color: #fafafa;
            }
            
            h1 {
                background-color:#E1DF16;
                padding: 5px;
            }

            .fileHeading {
                font-size: 12px;
                font-weight: bold;
            }

            textarea {
                width: 100%;
                height: 30px;
                margin-bottom: 20px;
                border: #ccc 1px solid;
            }
        </style>        
    </head>
    <body>
        <h1>Beat Slappr - Base64 Encoder</h1>
        <?php
            $dir = 'includes/system sound kit src';
            getFiles($dir);
        ?>
    </body>
</html>
