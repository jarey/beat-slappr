<?php

    require_once('config.php');

    /******************/
    /***RETURN IMAGE***/
    /******************/

    header('Content-type: image/gif');
    echo base64_decode("R0lGODdhAQABAIABAAAAAP///ywAAAAAAQABAAACAkQBADs=");


    /**********************/
    /***GET VISITOR INFO***/
    /**********************/

    if(isset($_SERVER['REMOTE_ADDR'])) {
        $clientIP = $_SERVER['REMOTE_ADDR'];    
    }else {
        $clientIP = "";
    }

    if(isset($_GET['r'])) {
        $referringSite = $_GET['r'];
    }else {
        $referringSite = "";
    }

    if(isset($_GET['u'])) {
        $pageVisited = preg_replace("/^(.*)" . HOTLINKS_APP_PATH . "/", "", $_GET['u']);
    }else {
        $pageVisited = "";
    }


    /**********************************/
    /***STORE VISITOR INFO IN THE DB***/
    /**********************************/

    if($clientIP && $pageVisited) {
        $db = new PDO('sqlite:' . HOTLINKS_DB_PATH .'hotlinks.db.sqlite');
        $db->exec("INSERT INTO visits (client_ip, page_visited, referring_site, timestamp) VALUES('" . $clientIP . "', '" . $pageVisited . "', '" . $referringSite . "', current_timestamp)");
    }
?>
