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
    if(isset($_REQUEST['type'])) {
        $type = $_REQUEST['type'];
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
    if(isset($_REQUEST['from'])) {
        $from = $_REQUEST['from'];
    }
    if(isset($_REQUEST['to'])) {
        $to = $_REQUEST['to'];
    }
    if(isset($_REQUEST['items'])) {
        $items = $_REQUEST['items'];
    }    

    if(!$cmd) {
        echo "No command specified.";
        return;
    }

    switch($cmd) {
        case "rename":
            if($from && $to) {
                $rename = $pattern->rename($from, $to);
                echo json_encode($rename);
            }else {
                echo "Missing Required Parameters";
                return;
            }
        break;
        case "delete":
            if($items) {
                $delete = $pattern->delete($items);
                echo json_encode($delete);
            }else {
                echo "Missing Required Parameters";
                return;
            }
        break;
        case "get":
            if($type) {
                $patterns = $pattern->get($type);
                echo json_encode($patterns);
            }else {
                echo "Missing Required Parameters";
                return;
            }
        break;
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
