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

    if($_GET) {
        $id = $_GET['id'];
        $kitName = $kitAPI->getKitName($id);
    }


    if($_POST) {
        $skipRedirect = false;
        if($kitName != $_POST['kitName']) {
            $renameSuccess = $kitAPI->updateKitName($_POST['id'], $_POST['kitName']);
            if(!$renameSuccess['success']) {
                $renameMesg = $renameSuccess['mesg'];
                $skipRedirect = true;
            }
            
        }
        for($n=0; $n<MAX_CHANNELS; $n++) {
            $kitAPI->updateKitChannel($_POST['id'], $_POST['channelId'][$n], $_POST['channelName'][$n], $_POST['channelOgg'][$n], $_POST['channelMp3'][$n]);
        }
        if(!$skipRedirect) {
            header('Location: ../');
        }
    }

    if($_GET) {
        $id = $_GET['id'];
        $kitChArr = $kitAPI->getKitChannels($id);
        if($kitChArr) {
            $tableStr = "
            <div class='contentBlock' style='width: 400px;'>
                <div class='contentBlockHeader'>
                    $kitName
                </div>
                <div id='kitBlock' class='contentBlockBody'>
                    <span class='label'>Kit Name:</span><br />
                    <input type='text' name='kitName' value='$kitName' /><span class='error'>$renameMesg</span><br /><br />
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
                                    <select name='channelId[$n]' value='" . $n . "'>";
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
                                    <input type='text' id='channelName" . $n . "' name='channelName[$n]' value='" . $kitChArr[$n]['name'] . "' />
                                </td>
                                <td>
                                    <iframe name='uploadTarget" . $n . "' src='#'></iframe>
                                    <div class='uploadFormWrapper'>
                                        <form method='post' id='frmUpload" . $n . "' enctype='multipart/form-data' target='uploadTarget" . $n . "'>
                                            <input type='file' class='file' name='uploadedFile' id='uploadedFile" . $n . "' onchange='doUpload(" . $n . ", this);' title='Upload' />
                                            <input type='button' id='cmdUpload" . $n . "' value='Upload' />
                                            <img src='../../../includes/images/ajax-loader.gif' style='display: none;' id='imgLoader" . $n . "' />
                                        </form>
                                    </div>

                                    <textarea name='channelOgg[$n]' id='channelOgg" . $n . "' style='display: none;'>" . $kitChArr[$n]['ogg']  . "</textarea>
                                    <textarea name='channelMp3[$n]' id='channelMp3" . $n . "' style='display: none;'>" . $kitChArr[$n]['mp3']  . "</textarea>
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
                                    <input type='button'" . $soundExists . " value='X' onclick='clearChannel(" . $n . ", this);' title='Delete' id='cmdClear" . $n . "' />
                                </td>
                            </tr>";
                        }
                    $tableStr .= "
                    </table><br />
                    <form id='frmSaveKit' method='post' action=''>
                        <input type='hidden' name='id' value='$id' />
                        <div id='divSaveKitData' style='display: none;'></div>
                        <input type='button' value='Save Changes' onclick='saveKit();' /> 
                        <input type='button' value='Cancel' onclick='window.location = \"../\";' />
                    </form>
                </div>
            </div>";
            $data['content'] = "
                <script type='text/javascript'>
                    function _$(el) {
                        return document.getElementById(el);
                    }

                    function saveKit() {
                        var kitBlock = _$('kitBlock'),
                            formElArr = kitBlock.getElementsByTagName('*'),
                            formEl,
                            n,
                            divSaveKitData = _$('divSaveKitData');

                        kitBlock.style.display = 'none';
                        for(n=(formElArr.length-1); n>=0; n--) {
                            formEl = formElArr[n];
                            if(formEl.hasAttribute('name')) {
                                divSaveKitData.appendChild(formEl);
                            }
                        }
                        _$('frmSaveKit').submit();
                    }

                    function doUpload(index, scope) {
                        var frmUpload = _$('frmUpload'  + index);
                        scope.style.display='none';
                        _$('cmdUpload' + index).style.display='none';
                        _$('imgLoader' + index).style.display='block';
                        frmUpload.action = '../../../admin/includes/scripts/sound-upload.php?c=' + index;
                        frmUpload.submit();
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

                    function clearChannel(index, scope) {
                        var clearCh = confirm('Are you sure you want to clear this channel?');
                        if(clearCh) {
                            _$('channelName' + index).value = '';
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
                "<a href='../'>&laquo; back to kits</a>" . 
                $tableStr . 
                "<a href='../'>&laquo; back to kits</a>";
        }else {
            $data['content'] = "<span class='error'>Invalid System Kit</span>";        
        }
    }else {
        $data['content'] = "<span class='error'>Invalid System Kit</span>";
    }

    $template->render($data);
?>
