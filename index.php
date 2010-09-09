<?php
    session_start();

    require_once("config.php");
    require_once("api/classes/kit.inc.php");
    require_once("api/classes/pattern.inc.php");

    $kit = new Kit();
    $kitArr = $kit->getKits();
    
    $pattern = new Pattern();
    if ($_SESSION['user_id']) {
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
        <title>Beat Slappr</title>
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
                if($_SESSION['email']) {
                    echo "u=1;";
                }

                if($patternArr) {
                    if ($_SESSION['user_id']) {
                        echo "upa=" . json_encode($patternArr['data']['user']) . ";";
                    }
                    echo "spa=" . json_encode($patternArr['data']['system']) . ";";
                }

                if($sharePattern) {
                    echo "p=$sharePattern;";
                }else if($patternArr) {
                    echo "p=" . json_encode($patternArr['data']['system'][0]) . ";";
                }
            ?>        
        </script>
    </head>
    <body>
        <div id="divWrapper">
            <div id="divKitPatternRow">
                <div class="dataHeader">
                    <div style="float: left; line-height: 24px;">
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
                        &nbsp;&nbsp;<label id='lblSavePattern' class='lblLink'>save</label>&nbsp;&nbsp;<label id='lblSharePattern' class='lblLink'>share</label>&nbsp;&nbsp;<label id='lblDownloadPattern' class='lblLink'>download</label>
                    </div>
                    <div id="divLoginWrapper" style="float: right;">
                        <div id="divGuestAccount" <?php echo ($_SESSION['user_id']) ? "style='display: none;'" : ""; ?>>
                            <label id='lblLogin' class='lblLink'>login</label> | <label id='lblSignUp' class='lblLink'>sign up</label>
                        </div>
                        <div id="divUserAccount" <?php echo ($_SESSION['user_id']) ? "" : "style='display: none;'"; ?>>
                        <?php if ($_SESSION['user_id']) { ?>
                            <?php echo $_SESSION['email']; ?> | <label class='lblLink' onclick='logout();'>Logout</label>
                        <?php } ?>
                        </div>
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
                    <div id="divPlayPause" class="shuttleButton btnPlay" title="Play"></div>
                    <div id="divJumpToStart" class="shuttleButton btnStart" title="Jump to Beginning"></div>
                    <div id="divLoopPosition" class="digitalDisplay shuttle"></div>
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
                                <div class="volumeLabel">Vol:</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
                                <div class="volumeLabel">Vol</div>
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
        <textarea id="txtKitWindow" style="display: none;">
            <?php
                echo "<div id='divKitWrapper' class='modalWrapper'>";
                    foreach($kitArr as $key => $val) {
                        echo "<div class='modalWrapperRow' onclick='setSystemKit(\"" . $val['name'] . "\"," . $val['id'] . ");'>" . $val['name'] . "</div>";
                    }
                echo "</div>";
            ?>
        </textarea>
        <textarea id="txtPatternWindow" style="display: none;">
            <div id="divPatternMesg" class='error' style='display: none;'></div>
            <div class='patternHeader'>My Patterns</div>
            <div id="divGuestPatternWrapper" class="guestWrapper">
                Log in now to create and edit your own patterns.<br /><br />
                <label class='lblLink' onclick='loginModal.show();'>login</label>&nbsp;&nbsp;&nbsp;&nbsp;<label class='lblLink' onclick='signupModal.show();'>sign up</label>
            </div>
            <div id='divMyPatternWrapper' style='display: none;'>
                <div id='divWithSelectedPatterns'>
                    Select: <label id='lblSelectAll' class='lblLink' style='font-weight: normal;'>all</label>, <label id='lblSelectNone' class='lblLink' style='font-weight: normal;'>none</label>&nbsp;&nbsp;|&nbsp;&nbsp;
                    With Selected: 
                    <input type="button" id="cmdRenamePattern" value="rename" class="withSelectedBtn" /> 
                    <input type="button" id="cmdDeletePattern" value="delete" class="withSelectedBtn" />
                </div>
                <div id='divUserPatterns' class='patternTable userPatternTable'></div>
            </div>
            <div class='patternHeader'>Preset Patterns</div>
            <div id='divPresetPatterns' class='patternTable presetPatternTable' style='margin-bottom: 0;'></div>
        </textarea>
        <textarea id="txtSavePatternWindow" style="display: none;">
            <h3>Save Pattern</h3><br /><br />
            <div id="divSavePatternMesg" class='error'></div>
            <div id="divGuestPatternSaveWrapper" class="guestWrapper">
                Log in now to save your pattern.<br /><br />
                <label class='lblLink' onclick='loginModal.show();'>login</label>&nbsp;&nbsp;&nbsp;&nbsp;<label class='lblLink' onclick='signupModal.show();'>sign up</label>
            </div>
            <div id="divUserPatternSaveWrapper">
                <form action="" onsubmit="return false;" id="frmSavePattern">
                    <label class="labelText">Name:</label>
                    <input type="text" id="txtSavePattern" class="modalText" /><br /><br />
                    <input type="submit" id="cmdSavePattern" value="save" /> <img id="imgSavePatternLoader" style="display: none;" src="includes/images/ajax-loader.gif" /> <input type="button" id="cmdCancelSave"  value="cancel" />
                </form>
            </div>
        </textarea>
        <textarea id="txtSharePatternWindow" style="display: none;">
            <h3>Share Pattern</h3><br /><br />
            <div id="divSharePatternMesg" class='error'></div>
            <form action="" onsubmit="return false;" id="frmSharePattern">
                <div id="divGuestUser" style="display: <?php echo ($_SESSION['user_id']) ? "none" : "block"; ?>;">
                    <label class="labelText">Your email:</label><br />
                    <input type="text" class="modalText" id="txtUserEmail" /><br /><br />
                </div>
                <label class="labelText">Share with: <span style="font-weight: normal;">(separate multiple email addresses with commas)</span></label>
                <input type="text" id="txtShareWithEmail" class="modalText" /><br /><br />
                <input type="submit" id="cmdSharePattern" value="share" /> <img id="imgSharePatternLoader" style="display: none;" src="includes/images/ajax-loader.gif" /> <input type="button" id="cmdCancelShare"  value="cancel" />
            </form>
        </textarea>
        <textarea id="txtDownloadPatternWindow" style="display: none;">
            <h3>Download Loop</h3><br /><br />
            <form action="download.php" method="post" onsubmit="return false;" name="frmDownloadPattern" id="frmDownloadPattern">
                <label class="labelText">Steps:</label><br />
                <input type="text" name="stepStart" maxlength="2" style="width: 30px;" value="1" /> - <input type="text" name="stepEnd" id="txtStepEnd" maxlength="2" style="width: 30px;" /><br /><br />
                <label class="labelText">Format:</label><br />
                <input type="radio" name="format" checked="checked" value="wav" /> wav<br />
                <input type="radio" name="format" value="ogg" /> ogg<br />
                <input type="radio" name="format" value="mp3" /> mp3 (may not loop properly)<br /><br />
                <input type="hidden" name="sequence" id="sequence" />
                <input type="submit" id="cmdDownloadPattern" value="download" /> <input type="button" id="cmdCancelDownload"  value="cancel" />
            </form>
        </textarea>
        <textarea id="txtLoginWindow" style="display: none;">
            <h3>Login</h3><br /><br />
            <div id="divLoginMesg" class='error'></div>
            <form action="" onsubmit="return false;" id="frmLogin">
                <label class='labelText'>email:</label><br /><input type="text" id="txtLoginEmail" class="modalText" /><br />
                <label class='labelText'>password:</label><br /><input type="password" id="txtLoginPassword" class="modalText" /><br /><br />
                <input type="submit" id="cmdLogin" value="login" /> <img id="imgLoginLoader" style="display: none;" src="includes/images/ajax-loader.gif" /> <label class="lblLink" onclick="signupModal.show();">sign up</label><br /><br />
            </form>
            <label id="lblForgotPassword" class="lblLink">forgot password</label>
        </textarea>
        <textarea id="txtForgotPasswordWindow" style="display: none;">
            <h3>Forgot Password</h3><br /><br />
            <div id="divResetMesg" class='error'></div>
            <form action="" onsubmit="return false;" id="frmResetPassword">
                <label class='labelText'>email:</label> <input type="text" id="txtResetEmail" class="modalText" /><br /><br />
                <input type="submit" id="cmdResetPassword" value="reset password" /> <img id="imgResetLoader" style="display: none;" src="includes/images/ajax-loader.gif" />
            </form>
        </textarea>
        <textarea id="txtSignupWindow" style="display: none;">
            <h3>Sign Up</h3><br /><br />
            <div id="divSignupMesg" class='error'></div>
            <form action="" onsubmit="return false;" id="frmSignup">
                <label class="labelText">email:</label> <input type="text" id="txtSignupEmail" class="modalText" /><br /><br />
                <input type="submit" id="cmdSignUp" value="sign up" /> <img id="imgSignupLoader" style="display: none;" src="includes/images/ajax-loader.gif" /> <label class="lblLink" onclick="loginModal.show();">login</label>
            </form>
        </textarea>
    </body>
</html> 
