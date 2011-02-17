 <?php
 
    require_once('../config.php');
    require_once('../api/soundcloud.php');
    require_once('../api/classes/db.inc.php');
    require_once('../api/classes/battle.inc.php');

    $soundcloud = new Soundcloud(SOUNDCLOUD_API_CLIENT_ID, SOUNDCLOUD_API_CLIENT_SECRET, SOUNDCLOUD_API_REDIRECT_URL);
    $battleObj = new Battle();

    $tracks = $soundcloud->execute('groups/20839/tracks?consumer_key=' . SOUNDCLOUD_API_CLIENT_ID . '&format=json', '', 'GET');
    $battleObj->syncTracks($tracks);

    if($_POST) {
        $postArr = $_POST;
        $battleObj->voteOnTrack($postArr);
    }

    $battle = $battleObj->loadBattle();
    $leader = $battleObj->getLeaderBoard();
    
    
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <meta name="description" content="<?php echo APP_NAME; ?> - Beat Battle" />
        <title><?php echo APP_NAME; ?> - Beat Battle</title>
        <link rel="stylesheet" href="includes/style/style.css" type="text/css" media="screen" />
        <?php if(!DEV) { ?>
            <script type="text/javascript">
                var _gaq = _gaq || [];
                _gaq.push(['_setAccount', 'UA-3259969-2']);
                _gaq.push(['_trackPageview']);

                (function() {
                    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                })();

                var htA=htA||[],
                    hURL=hURL||"//<?php echo $_SERVER["SERVER_NAME"]; ?>/hotlinks/";
                htA.push(['a','12345']);
                (function(){
                    var s,d;
                    s=document.createElement('script');s.type='text/javascript';s.async=true;
                    s.src=document.location.protocol+hURL+"tracker.js";
                    d=document.getElementsByTagName('script')[0];d.parentNode.insertBefore(s, d);
                })();
            </script>
        <?php } ?>
    </head>
    <body>
        <div id="body">
            <div id="title"><h1>Soundcloud Beat Battle</h1></div>
            <div id="divMainWrapper">
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
                <span id="vs">VS</span>
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
            </div>
            <div id='lower'>
                <div id='divJoinMesg'>Join the battle by <a href='<?php echo APP_URL; ?>'>submitting your own beat</a>!</div>
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
