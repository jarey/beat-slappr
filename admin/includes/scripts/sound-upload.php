<?php
    if($_FILES) {
        require_once "../../../api/classes/base64.inc.php";
        $maxUploadSize = 1048576;
        $file = $_FILES['uploadedFile'];
        $uploadedFile = $file['tmp_name'];
        $uploadedFileSize = $file['size'];
        $uploadedExtension = substr($file['name'], -3);
        $channel = $_GET['c'];

        if(!$uploadedFileSize || ($channel < 0 || $channel >= MAX_CHANNELS)) {
            echo "
            <script type='text/javascript'>
                alert('There was an error uploading the sound.');
            </script>";
            return;                
        }

        if($uploadedFileSize > $maxUploadSize) {
            echo "
            <script type='text/javascript'>
                alert('File must be no larger than 1MB.');
            </script>";
            return;
        }

        $base64 = new Base64();

        if($uploadedExtension == 'ogg') {
            echo "
            <script type='text/javascript'>
                var parentDoc = window.top.document;
                parentDoc.getElementById('channelOgg" . $channel . "').innerHTML = '" . $base64->encode($uploadedFile) . "';

                parentDoc.getElementById('cmdPlay" . $channel . "').disabled = false;
                parentDoc.getElementById('cmdClear" . $channel . "').disabled = false;
                parentDoc.getElementById('uploadedFile" . $channel . "').style.display='block';
                parentDoc.getElementById('cmdUpload" . $channel . "').style.display='block';
                parentDoc.getElementById('imgLoader" . $channel . "').style.display='none';
            </script>";

            //CREATE MP3 FROM OGG HERE

        }else if($uploadedExtension == 'mp3') {
            //CREATE OGG FROM MP3
        }else if($uploadedExtension == 'wav') {
            //CREATE OGG AND MP3 FROM WAV
        }else {
            echo "
            <script type='text/javascript'>
                alert('Invalid format.  Allowable formats are .wav, .ogg and .mp3');
            </script>";
            return;
        }
    }
?>
