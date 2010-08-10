<?php
    class System {
        private $adminEmail = SYSTEM_ADMIN_EMAIL;
        private $adminId;

        function __construct() {
            if(!$this->connection = mysql_connect(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD)) {
                throw new Exception("Couldn't connect to database server.");
            }
            if(!mysql_select_db(DB_NAME, $this->connection)) {
                throw new MySQLException("Unknown database.");
            }

            $this->adminId = $this->getAdminId();
        }

        public function newKit($name) {
            if(mysql_query("INSERT INTO sound_kits (name, user_id) VALUES('$name', " . $this->adminId . ")")) {
                $id = mysql_insert_id();
                for($n=0; $n<MAX_CHANNELS; $n++) {
                    mysql_query("INSERT INTO sound_kit_channels (id, channel) VALUES($id, $n)");
                }
                return true;
            }else {
                return false;
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
            $result = mysql_query("SELECT id, name from sound_kits WHERE user_id=" . $this->adminId . " ORDER BY name");
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
            $result = mysql_query("SELECT id FROM users WHERE email='" . $this->adminEmail . "'", $this->connection);
            $row = mysql_fetch_assoc($result);
            return $row['id'];
        }
    }
?>
