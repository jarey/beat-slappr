<?php
    require_once '../config.php';
    require_once 'classes/user.inc.php';
    require_once 'classes/pattern.inc.php';

    session_start();

    $user = new User();
    $pattern = new Pattern();

    if(isset($_REQUEST['cmd'])) {
        $cmd = $_REQUEST['cmd'];
    }
    if(isset($_REQUEST['email'])) {
        $email = $_REQUEST['email'];
    }
    if(isset($_REQUEST['password'])) {
        $password = $_REQUEST['password'];
    }

    if(!$cmd) {
        echo "No command specified.";
        return;
    }

    switch($cmd) {
        case "login":
            if($email && $password) {
                $login = $user->login($email, $password);
                $login['pattern'] = $pattern->get("user");
                echo json_encode($login);
            }else {
                echo "Missing Required Parameters";
                return;
            }
        break;
        case "logout":
            $logout = $user->logout();
            echo json_encode($logout);
        break;
        case "create":
            if($email) {
                $create = $user->create($email);
                echo json_encode($create);
            }else {
                echo "Missing Required Parameters";
                return;
            }
        break;
        case "resetPassword":
            if($email) {
                $resetPwd = $user->resetPassword($email);
                echo json_encode($resetPwd);
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
