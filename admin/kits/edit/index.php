<?php 
    require_once "../../../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/base64.inc.php";
    require_once APP_PATH . "api/classes/kit.inc.php";

    $template = new MainTemplate();
    $kitAPI = new Kit();

    $keyMapArr = array(
        0 => "Q",
        1 => "W",
        2 => "E",
        3 => "R",
        4 => "T",
        5 => "U",
        6 => "I",
        7 => "O",
        8 => "A",
        9 => "S",
        10 => "D",
        11 => "F",
        12 => "G",
        13 => "J",
        14 => "K",
        15 => "L"
    );

    $data['title'] = APP_NAME . " Admin";
    $data['headerTitle'] = APP_NAME . " - Admin";
    $data['menu'] = "divSystemKits";

    if($_POST) {
        for($n=0; $n<MAX_CHANNELS; $n++) {
            $kitAPI->updateKitChannel($_POST['id'], $_POST['channelId'][$n], $_POST['channelName'][$n], $_POST['channelOgg'][$n], $_POST['channelMp3'][$n]);
        }
        header('Location: ../');
    }

    if($_GET) {
        $id = $_GET['id'];    
        $kitChArr = $kitAPI->getKitChannels($id);
        if($kitChArr) {
            $tableStr = "
            <form method='post' action=''>
                <input type='hidden' name='id' value='$id' />
                <table>
                    <tr>
                        <th style='width: 80px;'>Channel</th>
                        <th>Name</th>
                        <th>ogg</th>
                        <th>mp3</th>
                    </tr>";
                    for($n=0; $n<MAX_CHANNELS; $n++) {
                        $tableStr .= "
                        <tr>
                            <td>
                                <select name='channelId[]' value='" . $n . "'>";
                                    for($m=0; $m<MAX_CHANNELS; $m++) {
                                        if($n == $m) {
                                            $default = "selected='selected'";
                                        }else {
                                            $default = "";
                                        }
                                        $tableStr .= "<option value='$m' $default>$m - " . $keyMapArr[$m] . "</option>";
                                    }
                                $tableStr .= "
                                </select>
                            </td><td>
                                <input type='text' name='channelName[]' value='" . $kitChArr[$n]['name'] . "' />
                            </td>
                            <td>
                                <iframe id='upload_target" . $n . "' src='" . APP_URL . "admin/includes/scripts/sound-upload.php?c=" . $n . "&f=Ogg'></iframe>
                                <textarea name='channelOgg[]' id='channelOgg" . $n . "' style='display: none;'>" . $kitChArr[$n]['ogg']  . "</textarea>
                                <input type='button' value='>' onclick='playAudio(" . $n . ", \"Ogg\", this);' id='cmdPlayOgg" . $n . "' />
                                <audio id='audOgg" . $n . "' onended='audioEnded(" . $n . ", \"Ogg\");'></audio>
                            </td>
                            <td>
                                <iframe id='upload_target" . $n . "' src='" . APP_URL . "admin/includes/scripts/sound-upload.php?c=" . $n . "&f=Mp3'></iframe>
                                <textarea name='channelMp3[]' id='channelMp3" . $n . "' style='display: none;'>" . $kitChArr[$n]['mp3']  . "</textarea>
                                <input type='button' value='>' onclick='playAudio(" . $n . ", \"Mp3\", this);' id='cmdPlayMp3" . $n . "' />
                                <audio id='audMp3" . $n . "'></audio>
                            </td>
                        </tr>";
                    }
                $tableStr .= "
                </table>
                <input type='submit' value='Save Changes' />
            </form>";
            $data['content'] = "
                <script type='text/javascript'>
                    function _$(el) {
                        return document.getElementById(el);
                    }

                    function playAudio(index, format, scope) {
                        var audioEl = _$('aud' + format + index);
                        var srcEl = _$('channel' + format + index);
                        var mime;

                        if(format == 'Ogg') {
                            mime = 'ogg';
                        }else if(format == 'Mp3') {
                            mime = 'mpeg';
                        }

                        if((audioEl.canPlayType('audio/' + mime) == 'no') || (audioEl.canPlayType('audio/' + mime) == '')) {
                            alert('Your browser can\'t play audio of this format.');
                            return false;
                        }

                        scope.disabled = true;
                        audioEl.src = 'data:audio/' + mime + ';base64,' + srcEl.innerHTML;
                        audioEl.load();
                        audioEl.play();
                    }

                    function audioEnded(index, format) {
                        var btn = _$('cmdPlay' + format + index);
                        btn.disabled = false;
                    }
                </script>" .
                $tableStr;
        }else {
            $data['content'] = "<span class='error'>Invalid System Kit</span>";        
        }
    }else {
        $data['content'] = "<span class='error'>Invalid System Kit</span>";
    }

    $template->render($data);
?>
