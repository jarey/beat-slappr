<?php
    class System {
        function __construct() {
            $this->db = new SQLite3("../includes/db/main.db.sqlite");
        }
        
        public function getKits() {
            $result = $this->db->query("SELECT id, name from system_sound_kit ORDER BY name");
            return $this->_getAllRows($result);
        }
        
        public function getKitChannels($id) {
            $result = $this->db->query("SELECT * FROM system_sound_kit_channel WHERE id=" . $id);
            return $this->_getAllRows($result);
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
