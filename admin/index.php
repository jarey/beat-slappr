<?php 
    session_start();

    require_once "../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    if($_SESSION['user_id'] && $_SESSION['email'] == SYSTEM_ADMIN_EMAIL) {
        $template = new MainTemplate();

        $data['title'] = APP_NAME . " Admin";
        $data['headerTitle'] = APP_NAME . " - Admin";
        $data['content'] = "
            <div id='divHomeWrapper'>
                <a href='kits'>Manage Kits</a><br /><br />
                <a href='patterns'>Manage Patterns</a><br /><br />
                <a href='base64'>Base64 Encoder</a>
            </div>
        ";

        $template->render($data);
    }
?>
