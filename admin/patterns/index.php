<?php 
    session_start();

    require_once "../../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    if(!isset($_SESSION['user_id']) || $_SESSION['email'] != SYSTEM_ADMIN_EMAIL) {
        header('Location: ../login.php');
    }

    $template = new MainTemplate();

    $data['title'] = APP_NAME . " Admin";
    $data['headerTitle'] = APP_NAME . " - Admin";
    $data['menu'] = "divSystemPatterns";
    $data['content'] = "Under Construction";

    $template->render($data);
?>
