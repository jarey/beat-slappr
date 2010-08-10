<?php
    class System {
        private $adminEmail = SYSTEM_ADMIN_EMAIL;
        private $adminId;

        function __construct() {
            $this->db = new SQLite3(APP_PATH . "includes/db/main.db.sqlite");
            $this->adminId = $this->getAdminId();
        }

        public function newKit($name) {
            if($this->db->exec("INSERT INTO sound_kits (name) VALUES('$name')")) {
                $id = $this->db->lastInsertRowID();
                for($n=0; $n<MAX_CHANNELS; $n++) {
                    $this->db->exec("INSERT INTO sound_kit_channels (id, channel) VALUES($id, $n)");
                }
                return true;
            }else {
                return false;
            }
        }

        public function deleteKit($id) {
            if($this->db->exec("DELETE FROM sound_kits WHERE id=" . $id)) {
                $this->db->exec("DELETE FROM sound_kit_channels WHERE id=" . $id);
                return true;
            }else {
                return false;
            }
        }

        public function getKits() {
            $result = $this->db->query("SELECT id, name from sound_kits WHERE user_id=" . $this->adminId . " ORDER BY name");
            return $this->_getAllRows($result);
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

            $result = $this->db->query("SELECT name, channel, " . $format . " FROM sound_kit_channels WHERE id=" . $id . " ORDER BY channel ASC");
            return $this->_getAllRows($result);
        }
        
        public function updateKitChannel($id, $channel, $name, $ogg, $mp3) {
            if($this->db->exec("UPDATE sound_kit_channels SET name='$name', ogg='$ogg', mp3='$mp3' WHERE id=$id AND channel=$channel")) {
                return true;
            }else {
                return false;
            }
        }

        private function _getAllRows($result) {
            $resultArr = array();
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                array_push($resultArr, $row);
            }
            return $resultArr;        
        }

        private function getAdminId() {
            $result = $this->db->querySingle("SELECT id FROM users WHERE email='" . $this->adminEmail . "'");
            return $result;
        }
    }
?>
