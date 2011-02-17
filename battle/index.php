<?php
    require_once('../config.php');
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <meta name="description" content="<?php echo APP_NAME; ?> - Beat Battle" />
        <title><?php echo APP_NAME; ?> - Beat Battle</title>
        <link rel="stylesheet" href="includes/style/style.css" type="text/css" media="screen" />
        <script src="includes/scripts/kodiak.js"></script>
        <script type="text/javascript">
            var ajax = new Kodiak.Data.Ajax();

            function $(el) {
                return document.getElementById(el);            
            }

            function loadResponse(obj) {
                var response = obj.response.split('-----');
                $('divMainWrapper').innerHTML = response[0];
                $('tblLeaderBoard').innerHTML = response[1];
            }

            function vote(winner, loser) {
                $('divMainWrapper').innerHTML = "<img src='../includes/images/ajax-loader-large.gif' />";
                 ajax.request({
                    url:    'includes/api/battle.inc.php',
                    method: 'post',
                    parameters: {
                        cmd: 'vote',
                        winning_track_id: winner,
                        losing_track_id: loser
                    },
                    handler: loadResponse
                });
            }

            window.onload = function() {
                 ajax.request({
                    url:    'includes/api/battle.inc.php',
                    method: 'post',
                    parameters: {cmd: 'sync'},
                    handler: loadResponse
                });
            };
        </script>
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
                <img src="../includes/images/ajax-loader-large.gif" />
            </div>
            <div id='lower'>
                <div id='divJoinMesg'>Join the battle by <a href='<?php echo APP_URL; ?>'>submitting your own beat</a>!</div>
                <br />
                <h1>Leaderboard</h1>
                <table>
                    <thead>
                        <tr>
                            <th style='width:100px'>Score</td>
                            <th style='width:350px'>Title</td>
                            <th style='width:250px'>Soundcloud User</td>
                        </tr>
                    </thead>
                    <tbody id="tblLeaderBoard"></tbody>
                </table>
            </div>
            <div id='credit'>Submitted by Haig Papaghanian and Miguel Senquiz for <a href='http://wiki.musichackday.org/index.php?title=PatternSketch'>#musichackday 2011</a></div>            
        </div>
    </body>
</html>
