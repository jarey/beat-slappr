<?php 
    session_start();

    require_once "../../../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/base64.inc.php";
    require_once APP_PATH . "api/classes/kit.inc.php";

    if(!isset($_SESSION['user_id']) || $_SESSION['email'] != SYSTEM_ADMIN_EMAIL) {
        header('Location: ../../login.php');
    }

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
                <div class='contentBlock' style='width: 400px;'>
                    <table>
                        <tr>
                            <th>Channel</th>
                            <th>Name</th>
                            <th></th>
                            <th></th>
                            <th></th>
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
                                    <iframe id='upload_target" . $n . "' src='" . APP_URL . "admin/includes/scripts/sound-upload.php?c=" . $n . "'></iframe>
                                    <textarea name='channelOgg[]' id='channelOgg" . $n . "' style='display: none;'>" . $kitChArr[$n]['ogg']  . "</textarea>
                                    <textarea name='channelMp3[]' id='channelMp3" . $n . "' style='display: none;'>" . $kitChArr[$n]['mp3']  . "</textarea>
                                </td>
                                <td>";
                                    if($kitChArr[$n]['ogg'] || $kitChArr[$n]['mp3']) {
                                        $soundExists = "";
                                    }else {
                                        $soundExists = " disabled='true'";
                                    }
                                    $tableStr .= "
                                    <input type='button'" . $soundExists . " value='>' onclick='playAudio(" . $n . ", this);' title='Play' id='cmdPlay" . $n . "' />
                                    <audio id='aud" . $n . "' onended='audioEnded(" . $n . ");'></audio>
                                </td>
                                <td>
                                    <input type='button'" . $soundExists . " value='X' onclick='clearAudio(" . $n . ", this);' title='Delete' id='cmdClear" . $n . "' />
                                </td>
                            </tr>";
                        }
                    $tableStr .= "
                    </table><br />
                    <input type='submit' value='Save Changes' />
                </div>
            </form>";
            $data['content'] = "
                <script type='text/javascript'>
                    function _$(el) {
                        return document.getElementById(el);
                    }

                    function playAudio(index, scope) {
                        var audioEl = _$('aud' + index),
                            srcEl,
                            mime;

                        if((audioEl.canPlayType('audio/ogg') != 'no') && (audioEl.canPlayType('audio/ogg') !== '')) {
                            srcEl = _$('channelOgg' + index);
                            mime = 'ogg';
                        }else if((audioEl.canPlayType('audio/mpeg') != 'no') && (audioEl.canPlayType('audio/mpeg') !== '')) {
                            srcEl = _$('channelMp3' + index);
                            mime = 'mpeg';
                        }else {
                            alert('Your browser can\'t play audio in any of the required formats.');
                            return false;                        
                        }

                        if(srcEl.innerHTML) {
                            scope.disabled = true;
                            audioEl.src = 'data:audio/' + mime + ';base64,' + srcEl.innerHTML;
                            audioEl.load();
                            audioEl.play();
                        }
                    }

                    function clearAudio(index, scope) {
                        var clearCh = confirm('Are you sure you want to clear this channel?');
                        if(clearCh) {
                            _$('channelOgg' + index).innerHTML = '';
                            _$('channelMp3' + index).innerHTML = '';
                            _$('aud' + index).src = '';
                            _$('cmdPlay' + index).disabled = true;
                            scope.disabled = true;
                        }
                    }

                    function audioEnded(index) {
                        var btn = _$('cmdPlay' + index);
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
