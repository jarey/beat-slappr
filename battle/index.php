 <?php
 
    require_once('../config.php');
    require_once('../api/classes/db.inc.php');
    
    class SoundcloudRating {
        private $db;

        function __construct() {
            $this->db = new DB(DB_HOSTNAME, DB_NAME, DB_USERNAME, DB_PASSWORD);
        }

        public function get_group_tracks() {
    		$ch = curl_init();
    	  	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    	  	curl_setopt($ch, CURLOPT_POST, 1);
    	  	curl_setopt($ch, CURLOPT_URL, 'http://api.soundcloud.com/groups/20839/tracks?consumer_key=jwtest');
    	  	curl_setopt($ch, CURLOPT_POSTFIELDS, '');
    	  	$result = curl_exec($ch);
    		curl_close($ch);	

    		$xml = new SimpleXMLElement($result, LIBXML_NOCDATA);
    		foreach($xml as $x) {
                $this->db->query("INSERT INTO `soundcloud_tracks` (track_id,permalink,title,username) values (".$x->id.",'".$x->permalink."','".$x->title."','".$x->user->username."')");
		    }
    	}

        public function load_battle() {
            $query = $this->db->query("SELECT * FROM `soundcloud_tracks` ORDER BY rand() LIMIT 2");
            $result = $this->db->getAll($query);
            return $result;
        }

        public function vote_on_track($post) {
            $query = $this->db->query('INSERT INTO `soundcloud_battle` (winning_id,losing_id) values ('.$post['winning_track_id'].','.$post['losing_track_id'].')');
        }

        public function show_leader_board() {
            $query = $this->db->query('SELECT count(winning_id) as wins, winning_id, title, username, permalink  FROM `soundcloud_battle`, `soundcloud_tracks` WHERE `soundcloud_tracks`.track_id = `soundcloud_battle`.winning_id GROUP BY winning_id ORDER BY count(winning_id) DESC LIMIT 5');
            $result = $this->db->getAll($query);
            return $result;
        }        
    }
    
    $sc = new SoundcloudRating();

    if($_POST) {
        $postArr = $_POST;
        $sc->vote_on_track($postArr);
    }

    $battle = $sc->load_battle();
    $leader = $sc->show_leader_board();
    
    
?>
<html>
<head>
    <title>PatterSketch Beat Battle</title>
    
    <style type="text/css">

    
    body { background: #efefef; }

    a {
        color: #000;
    }
    #body {
        width: 800px;
        margin: 50px auto;
    }

    #title {
        background: url(../includes/images/ps-logo-trans.png) no-repeat 0 0px;
        font-size: 60px;
        margin-bottom: 80px;
        padding-left: 130px;
        paddding-top: 50px !important;
        height: 120px;
    }

    input {
        border: none;
        background: #fff;
        border: 1px solid #ccc;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        padding: 10px;
        text-align: center;
        margin: 30px 0 0 80px;
        color: yellow
        font-size:30px;
        cursor: pointer;
    }

    input:hover {
        background: #efefef;
    }

    #track-1 {
        float: left;
        width: 310px;
    }

    h1 {
        float: left;
        margin-left: 40px;
        font-size: 90px;
        color: #999 ;
    }

    #track-2 {float: right;}
    #lower {clear: both;}

    #lower h1 {
        border-top: 1px solid #000;
        width: 800px;
        float: none;
        margin-top: 20px;
        font-size: 20px;
        margin-left: 0px;
        color: #000;
    }

    #credit {
        margin-top: 100px;
        border-top: 1px solid #ccc;
        padding-top:10px;
        color: #777;
        font-size: 12px;
        font-family: helvetica;
    }
    </style>
</head>

<body>
      <div id="body">

            <div id="title">Soundcloud Beat Battle</div>
            
            <div id="track-1">
                <object height="81" width="300"> 
                    <param name="movie" value="http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F<?php echo $battle[0]['track_id'];?>"></param> 
                    <param name="allowscriptaccess" value="always"></param> 
                    <embed allowscriptaccess="always" height="81" src="http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F<?php echo $battle[0]['track_id'];?>" type="application/x-shockwave-flash" width="300"></embed> 
                </object>
                <br /><span><a href="http://soundcloud.com/<?php echo $battle[0]['username'];?>/<?php echo $battle[0]['permalink'];?>"><?php echo $battle[0]['title']; ?></a> by <a href="http://soundcloud.com/<?php echo $battle[0]['username'];?>"><?php echo $battle[0]['username']; ?></a></span>
                
                <form method="post">
                    <input type="hidden" name="winning_track_id" value="<?php echo $battle[0]['track_id']; ?>" />
                    <input type="hidden" name="losing_track_id" value="<?php echo $battle[1]['track_id']; ?>" />
                    <input type="submit" value="Vote for this pattern" />
                </form>
            </div>
            
            <h1>VS</h1>

            <div id="track-2">
                <object height="81" width="300">                 
                    <param name="movie" value="http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F<?php echo $battle[1]['track_id'];?>"></param> 
                    <param name="allowscriptaccess" value="always"></param> 
                    <embed allowscriptaccess="always" height="81" src="http://player.soundcloud.com/player.swf?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F<?php echo $battle[1]['track_id'];?>" type="application/x-shockwave-flash" width="300"></embed> 
                </object>
                <br /><span><a href="http://soundcloud.com/<?php echo $battle[1]['username'];?>/<?php echo $battle[1]['permalink'];?>"><?php echo $battle[1]['title']; ?></a> by <a href="http://soundcloud.com/<?php echo $battle[1]['username'];?>"><?php echo $battle[1]['username']; ?></a></span>
                
            
                <form method="post">
                    <input type="hidden" name="winning_track_id" value="<?php echo $battle[1]['track_id']; ?>" />
                    <input type="hidden" name="losing_track_id" value="<?php echo $battle[0]['track_id']; ?>" />
                    <input type="submit" value="Vote for this pattern" />
                </form>            
            </div>
                
            <div id='lower'>
                <p style='text-align:center;margin-top:20px;font-size:16px;background:#ffffcc;padding:5px;display:inline-block;margin-left: 250px;'>Join the battle by <a href='/'>submitting your own beat</a>!</p>
                <br />
                <h1>Leaderboard</h1>
                <table>
                    <tr><td style='width:50px'>Score</td><td style='width:150px'>Title</td><td style='width:150px'>Soundcloud User</td></tr>
                    <?php
                        foreach($leader as $data) {
                            echo "<tr><td >".$data['wins']."0</td><td><a href='http://soundcloud.com/".$data['username']."/".$data['permalink']."'>".$data['title']."</a></td><td><a href='http://soundcloud.com/".$data['username']."'>".$data['username']."</a></td></tr>";
                        }                
                    ?>
                </table>
            </div>
            <div id='credit'>Submitted by Haig Papaghanian and Miguel Senquiz for <a href='http://wiki.musichackday.org/index.php?title=PatternSketch'>#musichackday 2011</a></div>            

        </div>
</body>
</html>
