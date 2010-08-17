<?php 
    require_once "../../config.php";
    require_once APP_PATH . "account/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/user.inc.php";

    session_start();

    $template = new MainTemplate();
    $user = new User();

    $errorStr = "";

    $data['title'] = "Beat Slappr - Activate Account";
    $data['headerTitle'] = "Beat Slappr - Activate Account";

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
                $updateAccountStatus = $user->updateAccountStatus($email, $token, 1);

                if($updateAccountStatus['success']) {
                    $updateAccountPassword = $user->updatePassword($email, '', $password, true);
                    if($updateAccountPassword['success']) {

                        //ACCOUNT SUCCESSFULLY ACTIVATED.  NOW LOGGING IN AND REDIRECTING TO HOMEPAGE.
                        $user->login($email, md5($password));
                        header('Location: ../../');
                        return;
                    }else {
                        $errorStr = "There was an error updating this account's password.";
                    }
                }else {
                    $errorStr = "There was an error updating this account's status.";
                }
            }
        }else {
            $errorStr = "You must enter a value for all fields.";
        }
    }
    
    if($_GET && $_GET['email'] && $_GET['t']) {
        $email = $_GET['email'];
        $token = $_GET['t'];
        if($user->accountUpdatable($email, $token, 0)) {
            $data['content'] = "
                <div style='width: 500px; text-align: center; margin: 50px auto;'>
                    <span class='error'>$errorStr</span>
                    <form method='post' action=''>
                        <input type='hidden' name='email' value='$email' />
                        <input type='hidden' name='t' value='$token' />
                        <label>Password:</label><br /><input type='password' id='password' name='password' /><br />
                        <label>Confirm Password:</label><br /><input type='password' name='confirmPassword' /><br /><br />
                        <input type='Submit' value='Activate Account' />
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
