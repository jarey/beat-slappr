<?php 
    require_once "../../config.php";
    require_once APP_PATH . "account/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/user.inc.php";

    $template = new MainTemplate();
    $user = new User();

    $data['title'] = "Beat Slappr - Reset Password";
    $data['headerTitle'] = "Beat Slappr - Reset Password";

    if($_POST && $_POST['email'] && $_POST['t'] && $_POST['password'] && $_POST['confirmPassword']) {
        $email = $_POST['email'];
        $token = $_POST['t'];
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];

        /***FORM VALIDATION TO GO HERE***/

        $updateAccountPassword = $user->updatePassword($email, $token, $password, true);
        if($updateAccountPassword['success']) {
            $data['content'] = "Your password has been reset.";
        }else {
            $data['content'] = "There was an error updating this account's password.";
        }
    }else if($_GET && $_GET['email'] && $_GET['t']) {
        $email = $_GET['email'];
        $token = $_GET['t'];
        if($user->accountUpdatable($email, $token, 1)) {
            $data['content'] = "
                <div style='width: 200px; margin: 50px auto;'>
                    <form method='post' action=''>
                        <input type='hidden' name='email' value='$email' />
                        <input type='hidden' name='t' value='$token' />
                        <label>New Password:</label> <input type='password' name='password' /><br /><br />
                        <label>Confirm New Password:</label> <input type='password' name='confirmPassword' /><br /><br />
                        <input type='Submit' value='Reset Password' />
                    </form>
                </div>
            ";
        }else {
            $data['content'] = "<span class='error'>Invalid Account.</span>";
        }
    }else {
        $data['content'] = "<span class='error'>Missing required parameters.</span>";
    }

    $template->render($data);
?>
