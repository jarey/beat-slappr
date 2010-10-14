<?php
    require_once '../config.php';
    require_once 'classes/kit.inc.php';

    $kit = new Kit();

    if(isset($_REQUEST['cmd'])) {
        $cmd = $_REQUEST['cmd'];
    }
    if(isset($_REQUEST['id'])) {
        $id = $_REQUEST['id'];
    }
    if(isset($_REQUEST['format'])) {
        $format = $_REQUEST['format'];
    }

    if(!isset($cmd)) {
        echo "No command specified.";
        return;
    }

    switch($cmd) {
        case "getKits":
            $kits = $kit->getKits();
            echo json_encode($kits);
        break;
        case "getKitChannels":
            if(isset($id) && isset($format)) {
                $channels = $kit->getKitChannels($id, $format);
                echo json_encode($channels);
            }else {
                echo "Missing Required Parameters";
                return;
            }
        break;
        default:
            echo "That command is not implemented.";
            return;
    }
?>
