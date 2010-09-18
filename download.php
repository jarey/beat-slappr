<?php
    if($_REQUEST) {
        if($_REQUEST['sequence'] && $_REQUEST['format'] && ($_REQUEST['format'] == "wav" || $_REQUEST['format'] == "mp3" || $_REQUEST['format'] == "ogg")) {

            $outFormat = $_REQUEST['format'];
            $fileDir = "download/";
            $outFileName = md5(microtime(true) . rand(1, 1024));

            if($outFormat == "mp3") {
                $outFile = $fileDir . $outFileName . ".wav";
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
        
        $execStr = "sox -m ";

        $kitId = $sequenceArr->kit->id;
        for($n = 0; $n < $patternStepEnd; $n++) {
            foreach($sequenceArr->pattern[$n] as $key => $val) {
                $execStr .= ' "|sox -v ' . ($sequenceArr->chVol->$val / 1000) . ' ' . $fileDir . $kitId . '/' . $val . '.ogg -p pad ' . round(($stepTimeInterval * $n), 3) . ' 1"';
            }
        }

        system($execStr . ' ' . $outFile . ' gain -n trim 0 ' . $patternTimeLength);

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

    }
?>
