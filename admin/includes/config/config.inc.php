<?php

    /*********************************************/
    /***DEFINES THE SERVER'S DOCUMENT ROOT PATH***/
    /*********************************************/

    define("DOC_PATH", $_SERVER['DOCUMENT_ROOT']);


    /***************************************************/
    /***DEFINES THE APPLICATION ADMIN'S EMAIL ADDRESS***/
    /***************************************************/

    DEFINE("SYSTEM_ADMIN_EMAIL", "admin@beat-slappr.com");


    /************************************/
    /***DEFINES THE APPLICATION'S NAME***/
    /************************************/

    define("APP_NAME", "beat-slappr");


    /************************************************
    DEFINES THE APPLICATION'S DISK PATH ON THE SERVER
    Example: /var/www/mysite.com
    ************************************************/

    define("APP_PATH", DOC_PATH . "/" . APP_NAME . "/");


    /**************************************************
    DEFINES THE APPLICATION'S BASE URL ON THE WEBSERVER
    Example: /mysite.com
    **************************************************/

    define("APP_URL", "/" . APP_NAME . "/");


    /***********************************************************************/
    /***DEFINES THE MAXIMUM NUMBER OF AUDIO CHANNELS IN AN INSTRUMENT KIT***/
    /***********************************************************************/

    define("MAX_CHANNELS", 16);
?>
