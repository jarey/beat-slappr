<?php
    if($_REQUEST) {
        if($_REQUEST['sequence'] && $_REQUEST['format'] && ($_REQUEST['format'] == "wav" || $_REQUEST['format'] == "mp3" || $_REQUEST['format'] == "ogg")) {
            require_once("config.php");
            require_once("api/classes/kit.inc.php");

            $outFormat = $_REQUEST['format'];
            $fileDir = "download/";
            $outFileName = md5(microtime(true) . rand(1, 1024));

            if($outFormat == "mp3") {
                $outFile = $fileDir . $outFileName . ".wav";
            }else {
                $outFile = $fileDir . $outFileName . ".$outFormat";
            }

            $mimeType = "audio/$outFormat";

            $kit = new Kit();

            $sequenceArr = json_decode($_REQUEST['sequence']);
            $outName = $sequenceArr->name;
            
            $downloadFileName = "$outName.$outFormat";
                        
            $soundArr = array();
            $kitChannels = $kit->getKitChannels($sequenceArr->kit->id, 'ogg');
            foreach($sequenceArr->pattern as $key => $val) {
                foreach($val as $iKey => $iVal) {
                    $soundArr[$iVal] = "";
                }
            }
            foreach($soundArr as $key => $val) {
                $soundArr[$key] = getSoundFile($key, $fileDir, $kitChannels[$key]['src']);
            }
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
        
        $execStr = "sox -m ";
        $execStr .= getStepSounds($sequenceArr, $fileDir, $soundArr, 0);
        for($n = 1; $n < $patternStepEnd; $n++) {

            foreach($sequenceArr->pattern[$n] as $key => $val) {
                $execStr .= ' "|sox ' . $fileDir . $soundArr[$val] . ' -p pad ' . round(($stepTimeInterval * $n), 3) . ' 1"';
            }
        }

        system($execStr . ' ' . $outFile . ' norm 0 trim 0 ' . $patternTimeLength);

        if($outFormat == "mp3") {
            $mimeType = "audio/mpeg";
            $mp3File = $fileDir . $outFileName . ".mp3";
            
            system('lame -h -b192 --cbr --nogap ' . $outFile . ' ' . $mp3File);
            
            unlink($outFile);
            $outFile = $mp3File;
        }

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
        foreach($soundArr as $key => $value) {
            unlink($fileDir . $soundArr[$key]);
        }
    }

    /***UTILITY FUNCTIONS***/

    function getStepSounds($sequence, $dir, $soundArr, $step) {
        $str = "";
        foreach($sequence->pattern[$step] as $key => $val) {
            $str .= $dir . $soundArr[$val] . ' ';
        }
        $str = trim($str);
        if($str) {
            return $str;
        }else {
            return false;
        }
    }
    
    function getSoundFile($channel, $dir, $b64) {
        $fileStr = base64_decode($b64);
        $fileName = md5(microtime(true) . '-' . rand(1,1024) . '-' . $channel) . '.ogg';

        $fp = fopen($dir . $fileName, 'wb');
        fwrite($fp, $fileStr);
        fclose($fp);

        return $fileName;
    }
?>
