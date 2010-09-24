<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <title></title>
        <style>
            body {
                margin: 0;
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
        <form method='post' id='frmUpload' action='' enctype='multipart/form-data'>
            <input type='file' class='file' name='uploadedFile' onchange='doUpload(this);' />
            <input type='button' id='cmdUpload' value='Upload' />
            <img src='../../../includes/images/ajax-loader.gif' style='display: none;' id='imgLoader' />
        </form>
        <?php
            if($_FILES) {
                require_once "../../../api/classes/base64.inc.php";
                $uploadedFile = $_FILES['uploadedFile']['tmp_name'];
                $uploadedFileSize = filesize($uploadedFile);

                $channel = $_GET['c'];

                if($uploadedFileSize && $channel >= 0) {
                    if($uploadedFileSize <= 1048576) {
                        $base64 = new Base64();

                        echo "
                        <script type='text/javascript'>
                            window.top.document.getElementById('channelOgg" . $channel . "').innerHTML = '" . $base64->encode($uploadedFile) . "';
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
        <script type='text/javascript'>
            function $(el) {
                return document.getElementById(el);
            }

            function doUpload(scope) {
                scope.style.display="none";
                $("cmdUpload").style.display="none";
                $("imgLoader").style.display="block";
                $("frmUpload").submit();
            }
        </script>
    </body>
</html>
