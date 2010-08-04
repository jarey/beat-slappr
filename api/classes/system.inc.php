<?php
    class System {
        function __construct() {
            $this->db = new SQLite3(APP_PATH . "includes/db/main.db.sqlite");
        }

        public function newKit($name) {
            if($this->db->exec("INSERT INTO system_sound_kit (name) VALUES('$name')")) {
                $id = $this->db->lastInsertRowID();
                for($n=0; $n<MAX_CHANNELS; $n++) {
                    $this->db->exec("INSERT INTO system_sound_kit_channel (id, channel) VALUES($id, $n)");
                }
                return true;
            }else {
                return false;
            }
        }

        public function deleteKit($id) {
            if($this->db->exec("DELETE FROM system_sound_kit WHERE id=" . $id)) {
                $this->db->exec("DELETE FROM system_sound_kit_channel WHERE id=" . $id);
                return true;
            }else {
                return false;
            }
        }

        public function getKits() {
            $result = $this->db->query("SELECT id, name from system_sound_kit ORDER BY name");
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

            $result = $this->db->query("SELECT name, channel, " . $format . " FROM system_sound_kit_channel WHERE id=" . $id . " ORDER BY channel ASC");
            return $this->_getAllRows($result);
        }
        
        public function updateKitChannel($id, $channel, $name, $ogg, $mp3) {
            if($this->db->exec("UPDATE system_sound_kit_channel SET name='$name', ogg='$ogg', mp3='$mp3' WHERE id=$id AND channel=$channel")) {
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
    }
?>
