<!DOCTYPE HTML>
<html>
    <head>
        <style>
            body {
                margin: 0;
                overflow: hidden;
            }

            .file {
                width: 60px;
                filter: alpha(opacity=0);
                opacity: 0;
                z-index: 10;
            }
            
            input {
                position: absolute;
                width: 60px;
                height: 24px;
                font-size: 14px;
                line-height: 24px;
            }
        </style>
    </head>
    <body>
        <form method='post' action='' enctype='multipart/form-data'>
            <input type='file' class='file' name='uploadedFile' onchange='this.parentNode.submit();' />
            <input type='button' value='Upload' />
        </form>
        <?php
            if($_FILES) {
                require_once "../../../api/classes/base64.inc.php";
                $uploadedFile = $_FILES['uploadedFile']['tmp_name'];
                $uploadedFileSize = filesize($uploadedFile);

                $channel = $_GET['c'];
                $format = $_GET['f'];

                if($uploadedFileSize && ($channel >= 0) && $format) {
                    if($uploadedFileSize <= 1048576) {
                        $base64 = new Base64();

                        echo "
                        <script type='text/javascript'>
                            window.top.document.getElementById('channel" . $format . $channel . "').innerHTML = '" . $base64->encode($uploadedFile) . "';
                        </script>";
                    }else {
                        echo "
                        <script type='text/javascript'>
                            alert('File must be no larger than 1MB.');
                        </script>";
                    }
                }else {
                    echo "
                    <script type='text/javascript'>
                        alert('There was an error uploading the sound.');
                    </script>";
                }
            }
        ?>
    </body>
</html>
