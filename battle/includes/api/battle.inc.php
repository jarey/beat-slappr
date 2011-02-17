<?php
 
    require_once('../../../config.php');
    require_once('../../../api/soundcloud.php');
    require_once('../../../api/classes/db.inc.php');
    require_once('../../../api/classes/battle.inc.php');

    if(isset($_REQUEST['cmd'])) {
        $cmd = $_REQUEST['cmd'];
    }else {
        echo "No command specified.";
        return false;    
    }

    if($cmd == "sync") {

        $soundcloud = new Soundcloud(SOUNDCLOUD_API_CLIENT_ID, SOUNDCLOUD_API_CLIENT_SECRET, SOUNDCLOUD_API_REDIRECT_URL);
        $tracks = $soundcloud->execute('groups/20839/tracks?consumer_key=' . SOUNDCLOUD_API_CLIENT_ID . '&format=json', '', 'GET');
        $battleObj = new Battle();
        $battleObj->syncTracks($tracks);    
        echo loadBattle();

    }else if($cmd == "vote" && $_POST) {

        $postArr = $_POST;
        $battleObj = new Battle();
        $battleObj->voteOnTrack($postArr);
        echo loadBattle();

    }else if($cmd == "load") {

        echo loadBattle();    

    }else {

        echo "Invalid command.";
        return false;

    }

    function loadBattle() {
        $battleObj = new Battle();

        $battle = $battleObj->loadBattle();
        $leader = $battleObj->getLeaderBoard();

        $str =  "
        <div id='track-1'>
            <object height='81' width='300'> 
                <param name='movie' value='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" . $battle[0]->track_id . "'></param> 
                <param name='allowscriptaccess' value='always'></param> 
                <embed allowscriptaccess='always' height='81' src='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" . $battle[0]->track_id . "' type='application/x-shockwave-flash' width='300'></embed> 
            </object>
            <br /><span id='trackTitle_" . $battle[0]->track_id . "'><a href='http://soundcloud.com/" . $battle[0]->user_permalink . "/" . $battle[0]->track_permalink . "'>" . $battle[0]->track_name . "</a> by <a href='http://soundcloud.com/" . $battle[0]->user_permalink . "'>" . $battle[0]->user_name . "</a></span><br />
            <input type='button' onclick='vote(" . $battle[0]->track_id . ", " . $battle[1]->track_id . ");' value='Vote for this pattern' />
        </div>
        <span id='vs'>VS</span>
        <div id='track-2'>
            <object height='81' width='300'>                 
                <param name='movie' value='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" . $battle[1]->track_id . "'></param> 
                <param name='allowscriptaccess' value='always'></param> 
                <embed allowscriptaccess='always' height='81' src='http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" . $battle[1]->track_id . "' type='application/x-shockwave-flash' width='300'></embed> 
            </object>
            <br /><span id='trackTitle_" . $battle[1]->track_id . "'><a href='http://soundcloud.com/" . $battle[1]->user_permalink . "/" . $battle[1]->track_permalink . "'>" . $battle[1]->track_name . "</a> by <a href='http://soundcloud.com/" . $battle[1]->user_permalink . "'>" . $battle[1]->user_name . "</a></span><br />
            <input type='button' onclick='vote(" . $battle[1]->track_id . ", " . $battle[0]->track_id . ");' value='Vote for this pattern' />
        </div>
        -----";
        foreach($leader as $data) {
            $str .= "
            <tr>
                <td>" . $data->wins . "0</td>
                <td><a href='http://soundcloud.com/" . $data->user_permalink . "/" . $data->track_permalink . "'>" . $data->track_name . "</a></td>
                <td><a href='http://soundcloud.com/" . $data->user_permalink . "'>" . $data->user_name . "</a></td>
            </tr>";
        }
        return $str;
    }
?>
