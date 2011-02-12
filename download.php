<?php
    session_start();
    if($_REQUEST) {
        if($_REQUEST['sequence'] && $_REQUEST['format'] && ($_REQUEST['format'] == "wav" || $_REQUEST['format'] == "mp3" || $_REQUEST['format'] == "ogg" || $_REQUEST['format'] == 'soundcloud')) {

            $outFormat = $_REQUEST['format'];
            $fileDir = "download/";
            $outFileName = md5(microtime(true) . rand(1, 1024));

            if($outFormat == "mp3") {
                $outFile = $fileDir . $outFileName . ".wav";
            }else if($outFormat == "soundcloud") {
                $outFile = $fileDir . $outFileName . ".ogg";
                $outFormat = "ogg";

                $soundcloud = true;
                require_once('api/soundcloud.php');
            }else {
                $outFile = $fileDir . $outFileName . ".$outFormat";
            }

            $fileDir .= "kits/";

            $mimeType = "audio/$outFormat";

            $sequenceArr = json_decode($_REQUEST['sequence']);
            $outName = $sequenceArr->name;
            
            $downloadFileName = "$outName.$outFormat";

        }else {
            return false;
        }

        $stepTimeInterval = (60 / $sequenceArr->tempo) / 4; //Assumes there are 4 steps in a beat.

        if($_REQUEST['stepStart']) {
            $patternStepStart = $_REQUEST['stepStart'];
        }else {
            $patternStepStart = 1;
        }
        
        if($_REQUEST['stepEnd']) {
            $patternStepEnd = $_REQUEST['stepEnd'];
        }else {
            $patternStepEnd = count($sequenceArr->pattern);
        }
        $patternTimeLength = round(($patternStepEnd * $stepTimeInterval), 3);
        
        $execStr = "sox -M ";
        $ch = 1;
        $delayArr = array();
        $remixArrL = array();
        $remixArrR = array();

        $kitId = $sequenceArr->kit->id;
        $kitChannelCount = exec("soxi -c " . $fileDir . $kitId . '/0.ogg');

        for($n = 0; $n < $patternStepEnd; $n++) {
            foreach($sequenceArr->pattern[$n] as $key => $val) {
                $execStr .= ' -v ' . ($sequenceArr->chVol->$val / 100) . ' ' . $fileDir . $kitId . '/' . $val . '.ogg';

                $delay = round(($stepTimeInterval * $n), 3);
                for($m=1; $m<=$kitChannelCount; $m++) {
                    array_push($delayArr, $delay);
                }

                array_push($remixArrL, $ch);
                $ch++;
                if($kitChannelCount == 2) {
                    array_push($remixArrR, $ch);
                    $ch++;
                }
            }
        }

        $execStr .= ' ' . $outFile;
        $execStr .= ' pad 0 ' . $patternTimeLength;
        $execStr .= ' delay ' . implode(" ", $delayArr);
        $execStr .= ' remix ' . implode(",", $remixArrL);

        if($kitChannelCount == 2) {
            $execStr .= ' ' . implode(",", $remixArrR);
        }

        $execStr .= ' trim 0 ' . $patternTimeLength . ' gain -n';

        system($execStr);

        if($outFormat == "mp3") {
            $mimeType = "audio/mpeg";
            $mp3File = $fileDir . $outFileName . ".mp3";
            
            system('lame -h -b192 --cbr --nogap ' . $outFile . ' ' . $mp3File);
            
            unlink($outFile);
            $outFile = $mp3File;
        }

        if(!$soundcloud) {
            header('Content-Description: File Transfer');
            header('Content-Type: ' . $mimeType);
            header('Content-Disposition: download; filename="' . $downloadFileName . '"');
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($outFile));
            ob_clean();
            flush();
            readfile($outFile);
            unlink($outFile);
        }else {
            //If a soundcloud temporary file exists, delete it.
            if(isset($_SESSION['soundcloud_tmp_file']) && is_file($_SESSION['soundcloud_tmp_file'])) {
                unlink($_SESSION['soundcloud_tmp_file']);
            }
            $_SESSION['soundcloud_tmp_file'] = $outFile;

            $soundcloud = new Soundcloud('p9Gc43VitK23sjVtWIv1Q', '4b67WnZRU9jgh3EuOG8predltaXPGyxtsQZMKvuUKI', 'http://localhost/patternsketch/soundcloud_upload.php');
            echo $soundcloud->getAuthorizeUrl() . "&display=popup";
        }
    }
?>
