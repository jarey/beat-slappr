<?php
    class Kit {
        function __construct() {
            if(!$this->connection = mysql_connect(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD)) {
                throw new Exception("Couldn't connect to database server.");
            }
            if(!mysql_select_db(DB_NAME, $this->connection)) {
                throw new MySQLException("Unknown database.");
            }
        }

        public function newKit($name) {
            if(!$name) {
                return array("success" => false, "mesg" => "Invalid kit name.");
            }
            $result = mysql_query("SELECT id FROM sound_kits WHERE name='$name'");
            $rowCount = mysql_num_rows($result);
            if($rowCount < 1) {
                if(mysql_query("INSERT INTO sound_kits (name, user_id) VALUES('$name', " . $this->getAdminId() . ")")) {
                    $id = mysql_insert_id();
                    for($n=0; $n<MAX_CHANNELS; $n++) {
                        mysql_query("INSERT INTO sound_kit_channels (id, channel) VALUES($id, $n)");
                    }
                    return array("success" => true, "mesg" => "Kit successfully created.");
                }else {
                    return array("success" => false, "mesg" => "There was an error creating the kit.");
                }
            }else {
                return array("success" => false, "mesg" => "Kit already exists.");
            }
        }

        public function updateKitChannel($id, $channel, $name, $ogg, $mp3) {
            if(mysql_query("UPDATE sound_kit_channels SET name='$name', ogg='$ogg', mp3='$mp3' WHERE id=$id AND channel=$channel")) {
                return true;
            }else {
                return false;
            }
        }

        public function deleteKit($id) {
            if(mysql_query("DELETE FROM sound_kits WHERE id=" . $id)) {
                mysql_query("DELETE FROM sound_kit_channels WHERE id=" . $id);
                return true;
            }else {
                return false;
            }
        }

        public function getKits() {
            $result = mysql_query("SELECT id, name from sound_kits WHERE user_id=" . $this->getAdminId() . " ORDER BY name");
            return $this->getAllRows($result);
        }
        
        public function getKitChannels($id, $format="") {
            if($format) {
                if($format == "mp3" || $format == "ogg") {
                    $format .= " AS src";
                }else {
                    echo "Invalid Format";
                    return;
                }
            }else {
                $format = "mp3, ogg";
            }            

            $result = mysql_query("SELECT name, channel, " . $format . " FROM sound_kit_channels WHERE id=" . $id . " ORDER BY channel ASC");
            return $this->getAllRows($result);
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

        private function getAdminId() {
            $result = mysql_query("SELECT id FROM users WHERE email='" . SYSTEM_ADMIN_EMAIL . "'", $this->connection);
            $row = mysql_fetch_assoc($result);
            return $row['id'];
        }
    }
?>
