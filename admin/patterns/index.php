<?php 
    require_once "../../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    $template = new MainTemplate();

    $data['title'] = "Beat Slappr Admin - System Patterns";
    $data['headerTitle'] = "Beat Slappr - Admin";
    $data['menu'] = "divSystemPatterns";
    $data['content'] = "Under Construction";

    $template->render($data);
?>
