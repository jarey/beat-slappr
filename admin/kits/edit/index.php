<?php 
    require_once "../../includes/config/config.inc.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";
    require_once APP_PATH . "api/classes/base64.inc.php";
    require_once APP_PATH . "api/classes/system.inc.php";

    $template = new MainTemplate();
    $systemAPI = new System();

    $data['title'] = "Beat Slappr Admin - Edit System Kit";
    $data['headerTitle'] = "Beat Slappr - Admin";
    $data['menu'] = "divSystemKits";

    if($_POST) {
        for($n=0; $n<MAX_CHANNELS; $n++) {
            $systemAPI->updateKitChannel($_POST['id'], $_POST['channelId'][$n], $_POST['channelName'][$n], $_POST['channelOgg'][$n], $_POST['channelMp3'][$n]);
        }
        header('Location: ../');
    }

    if($_GET) {
        $id = $_GET['id'];    
        $kitChArr = $systemAPI->getKitChannels($id);
        if($kitChArr) {
            $tableStr = "
            <form method='post' action=''>
                <input type='hidden' name='id' value='$id' />
                <table><tr><th>Channel</th><th>Name</th><th>ogg</th><th>mp3</th></tr>";
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
                                    $tableStr .= "<option value='$m' $default>$m</option>";
                                }
                            $tableStr .= "
                            </select>
                        </td><td>
                            <input type='text' name='channelName[]' value='" . $kitChArr[$n]['name'] . "' />
                        </td>
                        <td>
                            <iframe id='upload_target" . $n . "' src='" . APP_URL . "admin/includes/scripts/sound-upload.php?c=" . $n . "&f=Ogg'></iframe>
                            <textarea name='channelOgg[]' id='channelOgg" . $n . "' style='display: none;'>" . $kitChArr[$n]['ogg']  . "</textarea>
                        </td>
                        <td>
                            <iframe id='upload_target" . $n . "' src='" . APP_URL . "admin/includes/scripts/sound-upload.php?c=" . $n . "&f=Mp3'></iframe>
                            <textarea name='channelMp3[]' id='channelMp3" . $n . "' style='display: none;'>" . $kitChArr[$n]['mp3']  . "</textarea>
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
