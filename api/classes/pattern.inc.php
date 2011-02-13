<?php
    class Pattern {
        function __construct() {
            if(!$this->connection = mysql_connect(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD)) {
                throw new Exception("Couldn't connect to database server.");
            }
            if(!mysql_select_db(DB_NAME, $this->connection)) {
                throw new MySQLException("Unknown database.");
            }
        }
        
        public function save($name, $pattern, $init=false) {
            if(isset($_SESSION['user_id']) || $init) {
                if($init) {
                    $id = $init;
                }else {
                    $id = $_SESSION['user_id'];
                }

                $name = addslashes($name);
                if(!$this->_patternExists($name, $id)) {
                    if(mysql_query("INSERT INTO `patterns` (`user_id`, `name`, `pattern`) VALUES($id, '$name', '$pattern')")) {
                        return array("success" => true, "action" => "added", "uid" => $id, "mesg" => "The pattern has been saved.");
                    }else {
                        return array("success" => false, "mesg" => "There was an error adding the pattern.");
                    }
                }else {
                    if(mysql_query("UPDATE `patterns` SET `pattern`='$pattern' WHERE `name`='$name' AND `user_id`=$id")) {
                        return array("success" => true, "action" => "updated", "mesg" => "Pattern updated.");
                    }else {
                        return array("success" => false, "mesg" => "There was an error updating the pattern.");
                    }
                }
            }else {
                return array("success" => false, "mesg" => "Invalid session.");
            }
        }

        public function rename($from, $to) {
            if(isset($_SESSION['user_id'])) {
                $id = $_SESSION['user_id'];
                $from = addslashes($from);
                $to = addslashes($to);
                if(!$this->_patternExists($to, $id)) {
                    mysql_query("UPDATE `patterns` SET `name`='$to' WHERE `name`='$from' AND `user_id`=$id");
                    if(mysql_affected_rows() > 0) {
                        return array("success" => true, "mesg" => "Pattern successfully renamed.");
                    }else {
                        return array("success" => false, "mesg" => "There was an error renaming the pattern.");
                    }
                }else {
                    return array("success" => false, "mesg" => "A pattern with that name already exists.");
                }
            }else {
                return array("success" => false, "mesg" => "Invalid session.");                
            }
        }

        public function delete($items) {
            if(isset($_SESSION['user_id'])) {
                $id = $_SESSION['user_id'];
                $items = addslashes($items);
                $items = explode("|-|", $items);
                foreach($items as $item) {
                    mysql_query("DELETE FROM `patterns` WHERE `name`='$item' AND `user_id`=" . $id);
                }
                return array("success" => true, "mesg" => "Pattern(s) successfully deleted.");
            }else {
                return array("success" => false, "mesg" => "Invalid session.");                
            }        
        }

        public function get($type) {
            $resultArr = array();
            if($type == "system" || $type == "all") {
                $resultArr['system'] = array();
                $resultArr['system'] = $this->_getPatterns($this->getAdminId());
            }
            if($type == "user" || $type == "all") {
                if(isset($_SESSION['user_id'])) {
                    $resultArr['user'] = array();
                    $resultArr['user'] = $this->_getPatterns($_SESSION['user_id']);
                }else {
                    return array("success" => false, "mesg" => "Invalid session.");                
                }
            }
            if($resultArr) {
                return array("success" => true, "mesg" => "Successfully retreived patterns.", "data" => $resultArr);
            }else {
                return array("success" => false, "mesg" => "Invalid type.");
            }
        }

        public function share($user, $sequence, $hash, $recipients="") {
            if($user == "[user]") {
                if(isset($_SESSION['user_id'])) {
                    $user = $_SESSION['email'];
                }else {
                    return array("success" => false, "mesg" => "Invalid account.");
                }
            }
            if(mysql_query("INSERT INTO `shared_patterns` (`hash`, `user_id`, `sequence`) VALUES('$hash', '$user', '$sequence')")) {
                $shareArr = explode(",", $recipients);
                if(count($shareArr)) {
                    foreach($shareArr as $key => $value) {
                        $value = trim($value);
                        $this->sendShareEmail($user, $value, $hash);
                    }
                    return array("success" => true, "mesg" => "Your friends have been sent this beat.");
                }else {
                    return array("success" => false, "mesg" => "At least one recipient required.");
                }
            }else {
                return array("success" => false, "mesg" => "There was an error creating the shared pattern.");
            }
        }

        public function getSharedPattern($hash) {
            if($result = mysql_query("SELECT `sequence` FROM `shared_patterns` WHERE `hash`='$hash'")) {
                if(mysql_num_rows($result) == 1) {
                    $row = mysql_fetch_assoc($result);
                    return $row['sequence'];
                }else {
                    return false;
                }
            }else {
                return false;
            }
                    
        }

        /***PRIVATE METHODS***/

        private function sendShareEmail($sender, $recipient, $hash) {
            $to      = $recipient;
            $subject = $sender . ' wants to share a beat with you on ' . APP_NAME;

            $patternURL = APP_URL . "?p=$hash";
            $message = "To listen to $sender's beat, please click this <a href='" . $patternURL . "'>link</a>.";

            $headers  = 'MIME-Version: 1.0' . "\r\n" .
                        'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
                        'Bcc: ' . SYSTEM_BCC_EMAIL . "\r\n" .
                        'From: '. APP_NAME .' <'. SYSTEM_ADMIN_EMAIL .'>'. "\r\n" .
                        'Reply-To: '. SYSTEM_ADMIN_EMAIL . "\r\n" .
                        'X-Mailer: PHP/' . phpversion();

            mail($to, $subject, $message, $headers);
        }

        private function getAllRows($result) {
            $rowCount = mysql_num_rows($result);
    		$resultArr = array();

            for($n=0; $n<$rowCount; $n++) {
    		    $row = mysql_fetch_assoc($result);
    			$resultArr[$n] = $row;
    		}
    		return $resultArr;
        }

        private function _getPatterns($id) {
            $resultArr = array();
            $result = mysql_query("SELECT `name`, `pattern` FROM `patterns` WHERE user_id=$id");
            $result = $this->getAllRows($result);
            foreach($result as $key => $val) {
                $val['pattern'] = json_decode($val['pattern']);
                $val['pattern']->name = $val['name'];
                $resultArr[] = $val['pattern'];
            }
            return $resultArr;
        }

        

        private function _patternExists($name, $id) {
            $result = mysql_query("SELECT `name` FROM `patterns` WHERE `name`='$name' AND `user_id`=$id");
            $recordCount = mysql_num_rows($result);
            if($recordCount) {
                return true;
            }else {
                return false;
            }
        }

        private function getAdminId() {
            $result = mysql_query("SELECT id FROM users WHERE email='" . SYSTEM_ADMIN_EMAIL . "'", $this->connection);
            $row = mysql_fetch_assoc($result);
            return $row['id'];
        }
    }
?>
