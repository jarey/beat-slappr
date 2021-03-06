<?php
    session_start();

    require_once("config.php");
    require_once("api/classes/kit.inc.php");
    require_once("api/classes/pattern.inc.php");

    $kit = new Kit();
    $kitArr = $kit->getKits();
    
    $pattern = new Pattern();
    if (isset($_SESSION['user_id'])) {
        $patternArr = $pattern->get("all");
    }else {
        $patternArr = $pattern->get("system");
    }    

    $sharePattern = "";
    if($_GET) {
        require_once("api/classes/pattern.inc.php");
        
        $sharePattern = new Pattern();
        if($_GET['p']) {
            $p = $_GET['p'];
        }
        $sharePattern = $sharePattern->getSharedPattern($p);
    }
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <meta name="description" content="<?php echo APP_NAME; ?> - HTML5/JavaScript Drum Machine and Sequencer" />
        <title><?php echo APP_NAME; ?> - HTML5/JavaScript Drum Machine and Sequencer</title>
        <link rel="stylesheet" href="includes/style/style.css" type="text/css" media="screen" />
        <?php
            if(DEV) {
                // Get all the files from showcase-all.list
                $dir = 'includes/scripts/';
                $jsFileArr = file($dir . 'js.list');
                $count = sizeof($jsFileArr);
                for ($i=0; $i<$count; $i++) {
                    $jsFileArr[$i] = preg_replace('/([\r\n])+/i', '', $jsFileArr[$i]);
                    if(strlen($jsFileArr[$i])) {
                        echo "<script src='" . $dir . $jsFileArr[$i] . "'></script>\n";
                    }
                }
            }else {
                echo "<script src='includes/scripts/script.js'></script>";
            }
        ?>
        <script type="text/javascript">
            <?php
                if(isset($_SESSION['email'])) {
                    echo "u=1;";
                }else {
                    echo "u='';";
                }

                if($kitArr) {
                    echo "kA=" . json_encode($kitArr) . ";";
                }

                if($patternArr) {
                    if (isset($_SESSION['user_id'])) {
                        echo "upa=" . json_encode($patternArr['data']['user']) . ";";
                    }else {
                        echo "upa='';";
                    }
                    echo "spa=" . json_encode($patternArr['data']['system']) . ";";
                }

                if($sharePattern) {
                    echo "p=$sharePattern;";
                }else if($patternArr) {
                    $defaultPatternIndex = 0;
                    $defaultPatternArr = $patternArr['data']['system'];
                    $defaultPatternCount = count($defaultPatternArr);
                    if(DEFAULT_PRESET == "random") {
                        $defaultPatternIndex = rand(0, ($defaultPatternCount-1));
                    }else {
                        for($n=0; $n<$defaultPatternCount; $n++) {
                            if($defaultPatternArr[$n]->name == DEFAULT_PRESET) {
                                $defaultPatternIndex = $n;
                                break;
                            }
                        }
                    }
                    echo "p=" . json_encode($patternArr['data']['system'][$defaultPatternIndex]) . ";";
                }
            ?>

            <?php if(!DEV) { ?>
                var _gaq = _gaq || [];
                _gaq.push(['_setAccount', 'UA-3259969-2']);
                _gaq.push(['_trackPageview']);

                (function() {
                    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                })();

                var htA=htA||[],
                    hURL=hURL||"//<?php echo $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"]; ?>hotlinks/";
                htA.push(['a','12345']);
                (function(){
                    var s,d;
                    s=document.createElement('script');s.type='text/javascript';s.async=true;
                    s.src=document.location.protocol+hURL+"tracker.js";
                    d=document.getElementsByTagName('script')[0];d.parentNode.insertBefore(s, d);
                })();
            <?php } ?>
        </script>
        <link href="includes/images/ps-logo.ico" rel="shortcut icon" />
    </head>
    <body>
        <div id="divStatusBar">
            <div id="divStatusBarWrapper">
                <div id="divStatusBarLeft">
                    <div style="float: left;">
                        Patternsketch is experimental. Works best in Firefox 4.
                    </div>
                    <div id="divSocialLinks">
                        <table>
                            <tr>
                                <td><a href="http://twitter.com/share" class="twitter-share-button" data-text="Patternsketch - a browser based drum machine/sequencer #html5" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>&nbsp;</td>
                                <td style="padding-top:2px;"><iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FPatternsketch%2F147656558625964&amp;layout=button_count&amp;show_faces=false&amp;width=100&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe></td>
                            </tr>
                        </table>
                    </div>    
                </div>
                <div id="divStatusBarRight">
                    <div id="divGuestAccount" <?php echo (isset($_SESSION['user_id'])) ? "style='display: none;'" : ""; ?>>
                        <label id='lblLogin' class='lblLink'>Login</label>&nbsp;&nbsp;&nbsp;<label id='lblSignUp' class='lblLink'>Sign Up</label>
                    </div>
                    <div id="divUserAccount" <?php echo (isset($_SESSION['user_id'])) ? "" : "style='display: none;'"; ?>>
                    <?php if (isset($_SESSION['user_id'])) { ?>
                        <?php echo $_SESSION['email']; ?>&nbsp;&nbsp;&nbsp;<label class='lblLink' onclick='sampler.logout();'>Logout</label>
                    <?php } ?>
                    </div>
                    <div><label id='lblAboutUs' class='lblLink'><a href='#about'>About</label></a>&nbsp;&nbsp;&nbsp;</div>
                    <div><label id='lblBattle' class='lblLink'><a href='<?php echo APP_URL; ?>battle'>Battle!</label></a>&nbsp;&nbsp;&nbsp;</div>
                </div>
            </div>
        </div>
        <div id="divLeftCol">
            <img id='imgLogo' src='includes/images/ps-logo.jpg' alt='PatternSketch' /><br />

	        <div id="features">
		        <dl id="create">
			        <dd><h2>Create</h2></dd>
			        <dd><p>Sketch patterns using sounds from one of the available audio kits.</p></dd>
		        </dl>
		        <dl id="share">
			        <dd><h2>Share</h2></dd>
			        <dd><p>Save your creations online, and share with your friends to collaborate on new musical ideas.</p></dd>
		        </dl>
		        <dl id="download">
			        <dd><h2>Export</h2></dd>
			        <dd><p>Export your pattern loop as a WAV, OGG, MP3 file directly to your computer or send to <strong>SoundCloud</strong> and continue working on your ideas.</p></dd>
		        </dl>
	        </div>
	        <br />
            <label style="font-size: 12px; color: #E82930;">made with</label>
            <div class="madeWith">html5 + javascript</div>
        </div>
        <div id="divRightCol">
            <div id="divWrapper">
                <div id="divKitPatternRow">
                    <div class="dataHeader">
                        <div class="left">
                            <label class='labelText'>Kit</label>
                            <a id='aKitModal' class='comboWrapper'>
                                <span class='comboLeft'></span>
                                <span id='currentKit' class='comboCenter'></span>
                                <span class='comboRight'></span>
                            </a>
                            <div style='float: left; height: 1px; width: 15px;'></div>
                            <label class='labelText'>Pattern</label> 
                            <a id='aPatternModal' class='comboWrapper'>
                                <span class='comboLeft'></span>
                                <span id='currentPattern' class='comboCenter'></span>
                                <span class='comboRight'></span>
                            </a>
                        </div>
                        <div class="right" style='float: right; margin-right: 2px;'>
                            <div id="divDownloadPattern" class="samplerButton downloadIcon" title="Download Pattern">Export Audio</div>
                            <div id="divSharePattern" class="samplerButton shareIcon" title="Share Pattern">Share</div>
                            <div id="divSavePattern" class="samplerButton saveIcon" title="Save Pattern">Save</div>
                        </div>
                    </div>
                </div>
                <div id="divShuttleRow">
                    <div id="divViewBarOutterWrapper">
                        Edit Bar
                        <div id="divViewBarInnerWrapper"> 
                            <div class="viewBar">1</div>
                            <div class="viewBar">2</div>
                            <div class="viewBar">3</div>
                            <div class="viewBar">4</div>
                        </div>
                    </div>
                    <div id="shuttleWidgetWrapper">
                        <div class="widgetWrapper">
                            Steps
                            <div id="divSteps"></div>
                        </div>
                        <div class="widgetWrapper">
                            Tempo
                            <div id="divTempo"></div>
                        </div>
                        <div class="widgetWrapper">
                            Master Vol
                            <div id="divVolume"></div>
                        </div>
                    </div>                
                    <div id="divShuttleButtonWrapper">
                        <div id="divClearPattern" class="shuttleButton btnClearPattern" title="Clear Pattern"></div>
                        <div id="divPlayPause" class="shuttleButton btnPlay" title="Play    [space]"></div>
                        <div id="divJumpToStart" class="shuttleButton btnStart" title="Jump to Beginning    [left arrow]"></div>
                    </div>
                </div>
                <div id="divSequencerRow">
                    <div id="divSequencerLeftCol">
                        <div id="divInstrumentSpacer"></div>
                        <div id="divInstrument">
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">Q</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">W</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">E</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">R</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">T</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">U</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">I</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">O</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">A</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">S</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">D</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">F</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">G</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">J</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div>
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">K</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                            <div style="border-bottom: 0;">
                                <div class="instrumentName"></div>
                                <div class="instrumentBtnWrapper">
                                    <div class="drumPad">L</div>
                                    <div class="channelContentWrapper">
                                        <div class="channelMute" title="Mute">M</div>
                                        <div class="channelSolo" title="Solo">S</div>
                                    </div>
                                    <div class="volumeLabel"><img src="includes/images/vol.png" /></div>
                                    <div class="divVolumeWidget"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="divSequencerRightCol">
                        <div id="divSequencerPositionWrapper">
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                            <div class="sequencerPositionLED"></div>
                        </div>
                        <div id="divStepWrapper">
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                            <div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep clsStepOne"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                                <div class="clsStep"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="divAboutWrapper">
                <a name="about"></a><br />
	            <h1>Patternsketch</h1>
	            <p>Patternsketch is an HTML5 and Javascript audio sequencer and drum machine. With it, you can create audio patterns, play them back, adjust playback tempo, volume, and change the audio kit. You can also save, export, and collaborate with your friends.</p>

	            <p>Patternsketch is an excercise in imagining what browser based music tools could be, and an exploration in the possibilities of new web technologies. It was built with Javascript (no frameworks) and HTML5 (no flash).</p>
	            <p>The goal of this project was to create a tool that musicians and casual music fans could use to create music patterns and collaborate on rhythmic ideas with friends. We recognize the performance is currently unacceptable for serious use, but look forward to updates in browser technology to make tools like this a viable option for music lovers.</p>
	            <p>Patternsketch works best in Firefox and Chrome. For a technical look at the inner-workings, <a href="http://webappmatic.com/5/patternsketch-html5-and-javascript-audio-sequencer/">see our posts on how we made it</a>.</p>
	            <p>Questions?  Comments?  Email us:  patternsketch [at] gmail [dot] com</p>
            </div>
        </div>
    </body>
</html> 
