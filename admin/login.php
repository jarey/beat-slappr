<?php 
    session_start();

    require_once "../config.php";
    require_once "../api/classes/user.inc.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    if($_GET) {
        if(isset($_GET['c'])) {
            $c = $_GET['c'];
            if($c == "logout") {
                $user = new User();
                $user->logout();
            }
        }
    }

    if($_POST) {
        $u = $_POST['u'];
        $p = $_POST['p'];
        $login = array("success" => false, "mesg" => "Invalid username and/or password.");

        if($u && $p && $u == SYSTEM_ADMIN_EMAIL) {
            $user = new User();
            $p = md5($p);
            $login = $user->login($u, $p);
        }
    }

    if($_SESSION['user_id'] && $_SESSION['email'] == SYSTEM_ADMIN_EMAIL) {
        header('Location: .');
    }

    $template = new MainTemplate();

    $data['title'] = APP_NAME . " Admin";
    $data['headerTitle'] = APP_NAME . " - Admin";
    $data['menu'] = "hidden";
    $data['content'] = "
        <div id='divHomeWrapper'>";
            if(isset($login) && !$login['success']) {
                $data['content'] .= "<span class='error'>" . $login['mesg'] . "</span>";
            }
            $data['content'] .= "
            <form method='post' action=''>
                Username:<br /><input type='text' id='txtUsername' name='u' /><br />
                Password:<br /><input type='password' name='p' /><br /><br />
                <input type='submit' value='login' />
            </form>
        </div>
        <script type='text/javascript'>
            document.getElementById('txtUsername').focus();
        </script>
    ";

    $template->render($data);
?>
