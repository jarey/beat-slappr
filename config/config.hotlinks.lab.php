<?php

    /****************************************************************/
    /***DEFINE WHETHER CODE IS IN A DEVELOPMENT ENVIRONMENT OR NOT***/
    /****************************************************************/

    define("HOTLINKS_DEV", false);


    /********************************************/
    /***DEFINE THE DB PATH WITH TRAILING SLASH***/
    /********************************************/

    define("HOTLINKS_DB_PATH", "/var/www/patternsketch/");


    /***********************************************
        DEFINE THE BASE URL OF THE WEBSITE TO TRACK.
        IF ANY SLASHES ARE PRESENT, ESCAPE THEM.
        NO TRAILING SLASH.
        NO NEED TO PUT http://, https:// or www.  
        EXAMPLES:
        example.com
        example.com\/basepath
    ************************************************/

    define("HOTLINKS_APP_PATH", "haigo.dyndns.org\/patternsketch");

?>
