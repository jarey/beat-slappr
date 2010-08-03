<?php 
    require_once "../includes/templates/main.tpl.php";

    $template = new MainTemplate();
    $data['title'] = "Beat Slappr Admin - System Kits";
    $data['headerTitle'] = "Beat Slappr - Admin";
    $data['menu'] = "divSystemKits";
    $data['content'] = "
        <div style='width: 200px; margin: 50px auto; text-align: center;'>
            <a href='add'>Add System Kits</a><br />
            <a href='edit'>Edit System Kit</a><br />
            <a href='delete'>Delete System Kit</a><br />
            <a href='rebuild'>Rebuild System Kits</a>
        </div>
    ";

    $template->render($data);
?>
