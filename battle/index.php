 <?php
 
    require_once('../config.php');
    require_once('../api/soundcloud.php');
    require_once('../api/classes/db.inc.php');
    require_once('../api/classes/battle.inc.php');

    $battleObj = new Battle();

    if($_POST) {
        $postArr = $_POST;
        $battleObj->voteontrack($postArr);
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
