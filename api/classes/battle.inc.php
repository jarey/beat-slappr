<?php
    class Battle {
    
        private $db;

        function __construct() {
            $this->db = new DB(DB_HOSTNAME, DB_NAME, DB_USERNAME, DB_PASSWORD);
        }

        function getTracks() {
            $result = $this->db->query("SELECT * FROM `soundcloud_tracks`");
            return $this->db->getAll();
        }

        function addTrack($track) {
            $result = $this->db->query("INSERT INTO `soundcloud_tracks` (track_id,permalink,title,username) values (".$track->id.",'".addslashes($track->permalink)."','".addslashes($track->title)."','".addslashes($track->user->username)."')");
            if($result) {
                return true;
            }else {
                return false;
            }
        }

        function updateTrack($track) {
            $result = $this->db->query("UPDATE `soundcloud_tracks` SET `permalink`='" . addslashes($track->permalink) . "', `title`='" . addslashes($track->title) . "', `username`='" . ($track->user->username) . "' WHERE `track_id`=" . $track->id);
            if($result) {
                return true;
            }else {
                return false;
            }
        }

        function deleteTrack($id) {
            $result = $this->db->query("DELETE FROM `soundcloud_tracks` WHERE `track_id`=$id");
            if($result) {
                return true;
            }else {
                return false;
            }        
        }

        function syncTracks($tracks) {
            $existingTracks = $this->getTracks();

            foreach($existingTracks as $existingTrack) {
                $track = $this->_trackExistsInObj($tracks, $existingTrack['track_id']);
                if($track) {
                    $this->updateTrack($track);
                }else {
                    $this->deleteTrack($existingTrack['track_id']);
                }
            }

            foreach($tracks as $track) {
                if(!$this->_trackExistsInDB($track->id)) {
                    $this->addTrack($track);
                }
            }
        }

        public function loadBattle() {
            $query = $this->db->query("SELECT * FROM `soundcloud_tracks` ORDER BY rand() LIMIT 2");
            $result = $this->db->getAll($query);
            if($result) {
                return $result;
            }else {
                return false;
            }
        }

        public function getLeaderBoard() {
            $query = $this->db->query('SELECT count(winning_id) as wins, winning_id, title, username, permalink  FROM `soundcloud_battle`, `soundcloud_tracks` WHERE `soundcloud_tracks`.track_id = `soundcloud_battle`.winning_id GROUP BY winning_id ORDER BY count(winning_id) DESC LIMIT 20');
            $result = $this->db->getAll($query);
            return $result;
        }        

        public function voteOnTrack($post) {
            $result = $this->db->query('INSERT INTO `soundcloud_battle` (winning_id,losing_id) values (' . $post['winning_track_id'] . ',' . $post['losing_track_id'] . ')');
            if($result) {
                return true;
            }else {
                return false;
            }
        }

        function _trackExistsInObj(&$tracks, $id) {
            foreach($tracks as $track) {
                if($track->id == $id) {
                    return $track;
                }
            }
            return false;
        }

        function _trackExistsInDB($id) {
            $result = $this->db->query("SELECT `track_id` FROM `soundcloud_tracks` WHERE `track_id`=$id");
            if($this->db->getRowCount()) {
                return true;
            }else {
                return false;
            }
        }
    }
?>
