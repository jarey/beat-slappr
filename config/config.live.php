<?php

    /**********************/
    /***LIVE CONFIG FILE***/
    /**********************/


    /************************************/
    /***DEFINES THE APPLICATION'S NAME***/
    /************************************/

    define("APP_NAME", "PatternSketch");


    /***************************************************/
    /***DEFINES THE APPLICATION ADMIN'S EMAIL ADDRESS***/
    /***************************************************/

    DEFINE("SYSTEM_ADMIN_EMAIL", "admin@patternsketch.com");


    /*************************************************/
    /***DEFINES THE APPLICATION'S BCC EMAIL ADDRESS***/
    /*************************************************/

    DEFINE("SYSTEM_BCC_EMAIL", "bcc@patternsketch.com");


    /*********************************************/
    /***DEFINES THE SERVER'S DOCUMENT ROOT PATH***/
    /*********************************************/

    define("DOC_PATH", $_SERVER['DOCUMENT_ROOT']);


    /************************************************
    DEFINES THE APPLICATION'S DISK PATH ON THE SERVER
    Example: /var/www/mysite.com
    ************************************************/

    define("APP_PATH", DOC_PATH . "/");


    /**************************************************
    DEFINES THE APPLICATION'S BASE URL ON THE WEBSERVER
    Example: http://mysite.com/
    **************************************************/
    $appURL = 'http';
    if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
        $appURL .= "s";
    }
    $appURL .= "://" . $_SERVER['SERVER_NAME'];

    define("APP_URL", $appURL . "/");


    /***********************************************************************/
    /***DEFINES THE MAXIMUM NUMBER OF AUDIO CHANNELS IN AN INSTRUMENT KIT***/
    /***********************************************************************/

    define("MAX_CHANNELS", 16);


    /***********************/
    /***DATABASE SETTINGS***/
    /***********************/

    define("DB_HOSTNAME", "localhost");
    define("DB_NAME", "patternsketch");
    define("DB_USERNAME", "PatternSketch");
    define("DB_PASSWORD", "h25WamDpsn6ZrZVw");


    /**************************/
    /***ENVIRONMENT SETTINGS***/
    /**************************/  

    define("DEV", false);
?>
