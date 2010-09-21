<?php 
    session_start();

    require_once "../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    if($_SESSION['user_id'] && $_SESSION['email'] == SYSTEM_ADMIN_EMAIL) {
        header('Location: .');
    }

    $template = new MainTemplate();

    $data['title'] = APP_NAME . " Admin";
    $data['headerTitle'] = APP_NAME . " - Admin";
    $data['menu'] = "hidden";
    $data['content'] = "
        <div id='divHomeWrapper'>
            <form method='post' action=''>
                Username:<br /><input type='text' id='txtUsername' name='username' /><br />
                Password:<br /><input type='password' name='password' /><br /><br />
                <input type='submit' value='login' />
            </form>
        </div>
        <script type='text/javascript'>
            document.getElementById('txtUsername').focus();
        </script>
    ";

    $template->render($data);
?>
