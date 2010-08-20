<?php
    require_once("config.php");
    require_once("api/classes/pattern.inc.php");
    
    $pattern = new Pattern();
    $patternArr = $pattern->get("system");
    
    $sharePattern = "";
    if($_GET) {
        require_once("api/classes/pattern.inc.php");
        
        $sharePattern = new Pattern();
        if($_GET['p']) {
            $p = $_GET['p'];
        }
        $sharePattern = $sharePattern->getSharedPattern($p);
    }

    session_start();
?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>Beat Slappr</title>
        <link rel="stylesheet" href="includes/style/style.css" type="text/css" media="screen" />
        <script type="text/javascript" src="includes/scripts/index.js"></script>
        <script type="text/javascript" src="includes/scripts/kits.js"></script>
        <script type="text/javascript" src="includes/scripts/patterns.js"></script>
        <script type="text/javascript" src="includes/scripts/account.js"></script>
        <script type="text/javascript" src="includes/scripts/md5.js"></script>
        <script type="text/javascript" src="includes/scripts/util.js"></script>
        <script type="text/javascript" src="includes/scripts/audio.js"></script>
        <script type="text/javascript" src="includes/scripts/stepwidget.js"></script>
        <script type="text/javascript" src="includes/scripts/kodiak.js"></script>
        <script type="text/javascript" src="includes/scripts/toolbox.js"></script>
        <script type="text/javascript">
            <?php
                if($_SESSION['email']) {
                    echo "u=1;";
                }

                if($patternArr) {
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
                        &nbsp;&nbsp;<label id='lblSavePattern' class='lblLink'>save</label>&nbsp;&nbsp;<label id='lblSharePattern' class='lblLink'>share</label>
                    </div>
                    <div id="divLoginWrapper" style="float: right;">
                        <div id="divGuestAccount" <?php echo ($_SESSION['user_id']) ? "style='display: none;'" : ""; ?>>
                            <label id='lblLogin' class='lblLink'>login</label> | <label id='lblSignUp' class='lblLink'>sign up</label>
                        </div>
                        <div id="divUserAccount" <?php echo ($_SESSION['user_id']) ? "" : "style='display: none;'"; ?>">
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
                <div id="divInstrument">
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">Q</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">W</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">E</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">R</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">T</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">U</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">I</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">O</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">A</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">S</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">D</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">F</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">G</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">J</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div>
                        <div class="instrumentName"></div>
                        <div class="drumPad">K</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                    <div style="border-right: 0;">
                        <div class="instrumentName"></div>
                        <div class="drumPad">L</div>
                        <div class="channelContentWrapper">
                            <div class="channelMute" title="Mute">M</div>
                            <div class="channelSolo" title="Solo">S</div>
                        </div>
                        Vol
                        <div class="divVolumeWidget"></div>
                    </div>
                </div>
                <div id="divSequencer">
                    <div id="divStepWrapper">
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
        <div style="width: 200px; margin: 60px auto 0 auto;">
            Debug Controls
            <input type="button" value="Get Sequence" onclick="$('txtSequence').value = getPattern();" /> <input type="button" value="Set Sequence" onclick="setPattern($('txtSequence').value);" /><br />
            <textarea id="txtSequence"></textarea>
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
            <div id='divGuestPatternWrapper'>
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
            <h4>This is the save pattern window.</h4>
        </textarea>
        <textarea id="txtSharePatternWindow" style="display: none;">
            <h3>Share Pattern<h3><br /><br />
            <div id="divSharePatternMesg" class='error'></div>
            <form action="" onsubmit="return false;" id="frmSharePattern">
                <div id="divGuestUser" style="display: <?php echo ($_SESSION['user_id']) ? "none" : "block"; ?>;">
                    <label class="labelText">Your email:</label><br />
                    <input type="text" class="modalText" id="txtUserEmail" /><br /><br />
                </div>
                <label class="labelText">Share with: <span style="font-weight: normal;">(separate multiple email addresses with commas)</span></label>
                <input type="text" id="txtShareWithEmail" class="modalText" /><br /><br />
                <input type="submit" id="cmdSharePattern" value="share" /> <img id="imgSharePatternLoader" style="display: none;" src="includes/images/ajax-loader.gif" />
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
