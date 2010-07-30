<?php
    require_once 'classes/system.inc.php';

    $system = new System();

    $cmd = $_REQUEST['cmd'];
    $id = $_REQUEST['id'];
    
    if(!$cmd) {
        echo "No command specified.";
        return;
    }

    switch($cmd) {
        case "getKits":
            $kits = $system->getKits();
            echo json_encode($kits);
        break;
        case "getKitChannels":
            if($id) {
                $channels = $system->getKitChannels($id);
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
