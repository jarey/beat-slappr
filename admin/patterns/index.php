<?php 
    require_once "../../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    $template = new MainTemplate();

    $data['title'] = APP_NAME . " Admin";
    $data['headerTitle'] = APP_NAME . " - Admin";
    $data['menu'] = "divSystemPatterns";
    $data['content'] = "Under Construction";

    $template->render($data);
?>
