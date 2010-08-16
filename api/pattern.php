<?php
    require_once '../config.php';
    require_once 'classes/pattern.inc.php';

    session_start();

    $pattern = new Pattern();

    if(isset($_REQUEST['cmd'])) {
        $cmd = $_REQUEST['cmd'];
    }
    if(isset($_REQUEST['user'])) {
        $user = $_REQUEST['user'];
    }
    if(isset($_REQUEST['sequence'])) {
        $sequence = $_REQUEST['sequence'];
    }
    if(isset($_REQUEST['hash'])) {
        $hash = $_REQUEST['hash'];
    }
    if(isset($_REQUEST['recipients'])) {
        $recipients = $_REQUEST['recipients'];
    }

    if(!$cmd) {
        echo "No command specified.";
        return;
    }

    switch($cmd) {
        case "share":
            if($user && $sequence && $hash && $recipients) {
                $share = $pattern->share($user, $sequence, $hash, $recipients);
                echo json_encode($share);
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
