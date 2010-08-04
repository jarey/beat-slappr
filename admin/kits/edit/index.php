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
                            <textarea name='channelOgg[]' onfocus='this.select(); return false;' onclick='this.select(); return false;'>" . $kitChArr[$n]['ogg']  . "</textarea>
                        </td>
                        <td>
                            <textarea name='channelMp3[]' onfocus='this.select(); return false;' onclick='this.select(); return false;'>" . $kitChArr[$n]['mp3']  . "</textarea>
                        </td>
                    </tr>";
                }
                $tableStr .= "
                </table>
                <input type='submit' value='Save Changes' />
            </form>";
            $data['content'] = $tableStr;
        }else {
            $data['content'] = "<span class='error'>Invalid System Kit</span>";        
        }
    }else {
        $data['content'] = "<span class='error'>Invalid System Kit</span>";
    }

    $template->render($data);
?>
