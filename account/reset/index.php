<?php 
    require_once "../../config.php";
    require_once APP_PATH . "account/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/user.inc.php";

    $template = new MainTemplate();
    $user = new User();

    $errorStr = "";

    $data['title'] = "Beat Slappr - Reset Password";
    $data['headerTitle'] = "Beat Slappr - Reset Password";

    if($_POST) {
        if($_POST['email'] && $_POST['t'] && $_POST['password'] && $_POST['confirmPassword']) {
            $email = $_POST['email'];
            $token = $_POST['t'];
            $password = $_POST['password'];
            $confirmPassword = $_POST['confirmPassword'];

            /***FORM VALIDATION***/
            $validationArr = array();
            if(!preg_match("/^[A-Za-z0-9]+$/", $password)) {
                $validationArr[] = "Password can only contain the following characters: 'A-Z, a-z, 0-9'";
            }
            if(strlen($password) < 5) {
                $validationArr[] = "Password must be at least 5 characters.";
            }
            if($password != $confirmPassword) {
                $validationArr[] = "Passwords do not match.";        
            }

            if(count($validationArr)) {
                $errorStr = implode("<br />", $validationArr);
            }else {
                $updateAccountPassword = $user->updatePassword($email, $token, $password, true);
                if($updateAccountPassword['success']) {
                    $data['content'] = "Your password has been reset.";
                    $template->render($data);
                    return;
                }else {
                    $errorStr = "There was an error updating this account's password.";
                }
            }
        }else {
            $errorStr = "You must enter a value for all fields.";
        }
    }
    
    if($_GET && $_GET['email'] && $_GET['t']) {
        $email = $_GET['email'];
        $token = $_GET['t'];
        if($user->accountUpdatable($email, $token, 1)) {
            $data['content'] = "
                <div style='width: 500px; text-align: center; margin: 50px auto;'>
                    <span class='error'>$errorStr</span>
                    <form method='post' action=''>
                        <input type='hidden' name='email' value='$email' />
                        <input type='hidden' name='t' value='$token' />
                        <label>New Password:</label><br /><input type='password' id='password' name='password' /><br /><br />
                        <label>Confirm New Password:</label><br /><input type='password' name='confirmPassword' /><br /><br />
                        <input type='Submit' value='Reset Password' />
                    </form>
                </div>
                <script type='text/javascript'>
                    document.getElementById('password').focus();
                </script>
            ";
        }else {
            $data['content'] = "<span class='error'>Invalid Account.</span>";
        }
    }else {
        $data['content'] = "<span class='error'>Missing required parameters.</span>";
    }

    $template->render($data);
?>
