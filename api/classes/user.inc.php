<?php
    class User {

        function __construct() {
            if(!$this->connection = mysql_connect(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD)) {
                throw new Exception("Couldn't connect to database server.");
            }
            if(!mysql_select_db(DB_NAME, $this->connection)) {
                throw new MySQLException("Unknown database.");
            }
        }

        public function login($email,$pw) {
            $sessionExists = $this->sessionExists();
            if($sessionExists['success']) {
                $this->logout();
            }

            $result = mysql_query('SELECT * FROM `users` WHERE `email` = "'.$email.'" AND `password` = "'.$pw.'" AND `active`=1');
            if(mysql_num_rows($result) == 1) {
                $row = mysql_fetch_assoc($result);

                $_SESSION = array();
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['email'] = $row['email'];

                return array("success" => true, "mesg" => "Successfully logged in.", "user" => $email);
            }else {
                return array("success" => false, "mesg" => "Invalid username and/or password.");
            }
        }

        function logout() {
            if($this->sessionExists()) {
                $_SESSION = array();
                session_destroy();
                return array("success" => true, "mesg" => "Successfully logged out");
            }else {
                return array("success" => false, "mesg" => "No session to log out.");
            }
        }

        function create($email) {        
            if(!$this->accountExists($email)) {
                //Add user to the db
                $token = $this->createToken($email);
                mysql_query("INSERT INTO `users` (`email`, `active`, `token`) VALUES('$email', 0, '$token')");

                if(mysql_affected_rows() > 0) {
                    //Send the user a welcome email 
                    $this->sendWelcomeEmail($email, $token);
                }else {
                    return array("success" => false, "mesg" => "There was an error creating the account.  Please try again later.");
                }

                //Delete created accounts which haven't been activated and are older than 30 days.
                mysql_query("DELETE FROM `users` WHERE `active`=0 AND date_created < DATE_SUB(curdate(), INTERVAL 30 DAY)");

                return array("success" => true, "mesg" => "An email has been sent to '$email'.  Please click the link in the email to activate your account.");
            }else {
                return array("success" => false, "mesg" => "User already exists.");
            }
        }
        
        function resetPassword($email) {
            if($this->accountExists($email)) {
                $token = $this->createToken($email);
                mysql_query("UPDATE `users` SET `token`='$token' WHERE `email`='$email' AND `active`=1");
                if(mysql_affected_rows() > 0) {
                    $this->sendResetEmail($email, $token);
                    return array("success" => true, "mesg" => "An email has been sent to '$email' with directions for resetting your password.");
                }else {
                    return array("success" => false, "mesg" => "There was an error setting the reset token.");
                }
            }else {
                return array("success" => false, "mesg" => "The email address you provided was invalid.");
            }
        }

        function updateAccountStatus($email, $token, $active) {
            mysql_query("UPDATE `users` SET `active`=$active, `token`='' WHERE `email`='$email' AND `token`='$token'");
            if(mysql_affected_rows() > 0) {
                return array("success" => true, "mesg" => "Account status updated");
            }else {
                return array("success" => false, "mesg" => "There was an error updating account status.");
            }
        }

        function updatePassword($email, $token, $password, $md5=false) {
            if($md5) {
                $password = md5($password);
            }
            mysql_query("UPDATE `users` SET `password`='$password', `token`='' WHERE `email`='$email' AND `token`='$token'");
            if(mysql_affected_rows() > 0) {
                return array("success" => true, "mesg" => "Password successfully updated");
            }else {
                return array("success" => false, "mesg" => "There was an error updating the password.");
            }
        }


        function accountUpdatable($email, $token, $active) {
            $result = mysql_query('SELECT id FROM `users` WHERE `email` = "'.$email.'" AND `token` = "'.$token.'" AND `active`='.$active);
            if(mysql_num_rows($result) == 1) {
                return true;
            }else {
                return false;
            }
        }

        /***PRIVATE METHODS***/

        private function accountExists($email) {
            $result = mysql_query('SELECT email FROM `users` WHERE `email` = "'.$email.'"');
            if(mysql_num_rows($result) > 0) {
                return true;
            } else {
                return false;
            }
        }

        private function sessionExists() {
            if(isset($_SESSION['user_id'])) {
                return true;
            }else {
                return false;
            }
        }

        private function createToken($email) {
            return md5(microtime(true) . rand() . $email);        
        }

        /***PRIVATE METHODS FOR SENDING MAIL***/

        private function sendWelcomeEmail($email, $token) {
            $to      = $email;
            $subject = 'Welcome to ' . APP_NAME;

            $activationURL = APP_URL . "account/activate/?email=" . urlencode($email) . "&t=$token";
            $message = "To finish setting up your account, please click this <a href='" . $activationURL . "'>link</a>.";

            $headers  = 'MIME-Version: 1.0' . "\r\n" .
                        'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
                        'Bcc: ' . SYSTEM_BCC_EMAIL . "\r\n" .
                        'From: '. APP_NAME .' <'. SYSTEM_ADMIN_EMAIL .'>'. "\r\n" .
                        'Reply-To: '. SYSTEM_ADMIN_EMAIL . "\r\n" .
                        'X-Mailer: PHP/' . phpversion();

            mail($to, $subject, $message, $headers);
        }

        private function sendResetEmail($email, $token) {
            $to      = $email;
            $subject = 'Password reset - ' . APP_NAME;

            $activationURL = APP_URL . "account/reset/?email=" . urlencode($email) . "&t=$token";
            $message = "To reset your password, please click this <a href='" . $activationURL . "'>link</a>.";

            $headers  = 'MIME-Version: 1.0' . "\r\n" .
                        'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
                        'Bcc: ' . SYSTEM_BCC_EMAIL . "\r\n" .
                        'From: '. APP_NAME .' <'. SYSTEM_ADMIN_EMAIL .'>'. "\r\n" .
                        'Reply-To: '. SYSTEM_ADMIN_EMAIL . "\r\n" .
                        'X-Mailer: PHP/' . phpversion();

            mail($to, $subject, $message, $headers);
        }
    }
?>
