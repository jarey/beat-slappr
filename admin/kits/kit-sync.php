#!/usr/bin/php
<?php
    /******************************************************************/
    /***KIT SYNC SCRIPT - TO BE RUN FROM CLI AND FROM APP ROOT PATH!***/
    /******************************************************************/

    require_once "config.php";
    require_once "api/classes/kit.inc.php";

    $kitAPI = new Kit();


    $downloadDir = "download/kits/";
    $kitArr = $kitAPI->getKits();
    foreach($kitArr as $key => $val) {
        $kitId = $val['id'];
        $kitChannels = $kitAPI->getKitChannels($kitId, 'ogg');
        mkdir($downloadDir . $kitId);
        $channelArr = array();
        foreach($kitChannels as $key => $val) {
            $fileName = $downloadDir . $kitId . '/' . $val['channel'] . '.ogg';
            $fp = fopen($fileName, 'wb');
            fwrite($fp, base64_decode($val['src']));
            fclose($fp);
            $channel = exec("soxi -c " . $fileName);
            array_push($channelArr, $channel);
        }

        $maxChannels = max($channelArr);
        if($maxChannels > 1) {
            foreach($channelArr as $key => $val) {
                if($val ==1) {
                    $fileName = $downloadDir . $kitId . '/' . $key . ".ogg";
                    exec("sox " . $fileName . " " . $fileName . " remix 1 1");
                }
            }
        }
    }
?>
