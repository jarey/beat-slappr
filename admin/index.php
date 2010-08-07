<?php 
    require_once "../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    $template = new MainTemplate();

    $data['title'] = "Beat Slappr Admin";
    $data['headerTitle'] = "Beat Slappr - Admin";
    $data['content'] = "
        <div style='width: 200px; margin: 50px auto; text-align: center;'>
            <a href='kits'>Manage System Kits</a><br /><br />
            <a href='patterns'>Manage System Patterns</a><br /><br />
            <a href='base64'>Base64 Encoder</a>
        </div>
    ";

    $template->render($data);
?>
