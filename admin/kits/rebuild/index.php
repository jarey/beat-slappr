<?php 
    require_once "../../includes/config/config.inc.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/base64.inc.php";

    $template = new MainTemplate();
    $data['title'] = "Beat Slappr Admin - System Kit Rebuilder";
    $data['headerTitle'] = "Beat Slappr - Admin";
    $data['menu'] = "divSystemKits";


    $dir = '../../../includes/system sound kit src';
    $data['content'] = getFiles($dir, strlen($dir));

    $template->render($data);
    
    /******************************************************/

    function getFiles($dir, &$originalPath) {
        $b64 = new Base64();
        $str = "";
        if ($handle = opendir($dir)) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != ".." && !preg_match("/wav/", $file)) {
                    $file = $dir . '/' . $file;
                    if(is_dir($file)) {
                        $str .= getFiles($file, $originalPath);
                    }else if(is_file($file) && preg_match("/(ogg|mp3)$/", $file)) {
                        $str .= "<span class='fileHeading'>" . substr($file,$originalPath+1) . " (" . filesize($file) . " bytes)</span><br /><textarea readonly='readonly' onfocus='this.select(); return false;' onclick='this.select(); return false;'>" . $b64->encode($file) . "</textarea>";
                    }
                }
            }
            closedir($handle);
            return $str;
        }
    }
?>
