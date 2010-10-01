<?php
    if($_FILES) {
        require_once "../../../config.php";
        require_once "../../../api/classes/base64.inc.php";
        $maxUploadSize = 1048576;
        $file = $_FILES['uploadedFile'];
        $uploadedFile = $file['tmp_name'];
        $uploadedFileSize = $file['size'];
        $uploadedExtension = substr($file['name'], -3);
        $channel = $_GET['c'];
        $downloadDir = "../../../download/";

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

        $outStr = "
        <script type='text/javascript'>
            var parentDoc = window.top.document;

            function initPlayerControls() {
                parentDoc.getElementById('cmdPlay" . $channel . "').disabled = false;
                parentDoc.getElementById('cmdClear" . $channel . "').disabled = false;
                parentDoc.getElementById('uploadedFile" . $channel . "').style.display='block';
                parentDoc.getElementById('cmdUpload" . $channel . "').style.display='block';
                parentDoc.getElementById('imgLoader" . $channel . "').style.display='none';
            }";

        if($uploadedExtension == 'ogg') {

            //CREATE MP3 FROM OGG HERE

            $wavFile = $downloadDir . genFileName() . '.wav';
            $mp3File = $downloadDir . genFileName() . '.mp3';

            system('ffmpeg -i ' . $uploadedFile . ' ' . $wavFile);
            system('lame -h ' . $wavFile . ' ' . $mp3File);

            $outStr .= "
                parentDoc.getElementById('channelOgg" . $channel . "').innerHTML = '" . $base64->encode($uploadedFile) . "';
                parentDoc.getElementById('channelMp3" . $channel . "').innerHTML = '" . $base64->encode($mp3File) . "';
                initPlayerControls();";

            unlink($wavFile);
            unlink($mp3File);

        }else if($uploadedExtension == 'mp3') {

            //CREATE OGG FROM MP3

            $wavFile = $downloadDir . genFileName() . '.wav';
            $oggFile = $downloadDir . genFileName() . '.ogg';

            system('ffmpeg -i ' . $uploadedFile . ' ' . $wavFile);
            system('sox ' . $wavFile  . ' ' . $oggFile);

            $outStr .= "
                parentDoc.getElementById('channelMp3" . $channel . "').innerHTML = '" . $base64->encode($uploadedFile) . "';
                parentDoc.getElementById('channelOgg" . $channel . "').innerHTML = '" . $base64->encode($oggFile) . "';
                initPlayerControls();";

            unlink($wavFile);
            unlink($oggFile);

        }else if($uploadedExtension == 'wav') {

            //CREATE OGG AND MP3 FROM WAV

            $wavFile = $downloadDir . genFileName() . '.wav';
            $oggFile = $downloadDir . genFileName() . '.ogg';
            $mp3File = $downloadDir . genFileName() . '.mp3';

            copy($uploadedFile, $wavFile);

            system('sox ' . $wavFile . ' ' . $oggFile);
            system('lame -h ' . $wavFile . ' ' . $mp3File);

            $outStr .= "
                parentDoc.getElementById('channelOgg" . $channel . "').innerHTML = '" . $base64->encode($oggFile) . "';
                parentDoc.getElementById('channelMp3" . $channel . "').innerHTML = '" . $base64->encode($mp3File) . "';
                initPlayerControls();";

            unlink($wavFile);
            unlink($oggFile);
            unlink($mp3File);

        }else {
            $outStr .= "
                alert('Invalid format.  Allowable formats are .wav, .ogg and .mp3');";
        }
        $outStr .= "</script>";
        echo $outStr;
    }

    function genFileName() {
        return md5(microtime(true) . '-' . rand(1, 16384));
    }
?>
