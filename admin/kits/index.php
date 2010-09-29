<?php 
    session_start();

    require_once "../../config.php";

    require_once APP_PATH . "admin/includes/templates/main.tpl.php";
    require_once APP_PATH . "/api/classes/kit.inc.php";

    if(!isset($_SESSION['user_id']) || $_SESSION['email'] != SYSTEM_ADMIN_EMAIL) {
        header('Location: ../login.php');
    }

    $kitAPI = new Kit();
    $template = new MainTemplate();

    if($_POST) {
        $action = $_POST['action'];
        if($action == 'newKit') {
            $newKitName = $_POST['newKitName'];
            $newKitStatus = $kitAPI->newKit($newKitName);
            $newKitSuccess = $newKitStatus['success'] ? 'success' : 'error';
        }else if($action == 'syncKits') {
            $downloadDir = "../../download/kits/";
            $kitArr = $kitAPI->getKits();
            foreach($kitArr as $key => $val) {
                $kitId = $val['id'];
                $kitChannels = $kitAPI->getKitChannels($kitId, 'ogg');
                mkdir($downloadDir . $kitId);
                $channelArr = array();
                foreach($kitChannels as $key => $val) {
                    $fileName = $downloadDir . $kitId . '/' . $val['channel'] . '.ogg';
                    $fp = fopen($fileName, 'wb');
                    fwrite($fp, base64_decode($val['src']));
                    fclose($fp);
                    $channel = exec("soxi -c " . $fileName);
                    array_push($channelArr, $channel);
                }

                $maxChannels = max($channelArr);
                if($maxChannels > 1) {
                    foreach($channelArr as $key => $val) {
                        if($val ==1) {
                            $fileName = $downloadDir . $kitId . '/' . $key . ".ogg";
                            exec("sox " . $fileName . " " . $fileName . " remix 1 1");
                        }
                    }
                }
            }
        }
    }

    if($_GET) {
        $deleteId = $_GET['delete'];
        $kitAPI->deleteKit($deleteId);
        header('Location: .');
    }

    $systemKits = $kitAPI->getKits();
    $tableStr = "<table>";
    foreach($systemKits as $systemKit) {
        $tableStr .= "
            <tr>
                <td width='80%'><span class='clsTableText'>" . $systemKit['name'] . "</span></td>
                <td width='10%'><a href='edit/?id=" . $systemKit['id'] . "'><span class='smallLink'>[edit]</span></a></td>
                <td width='10%'><a href='#' onclick='deleteKit(" . $systemKit['id'] . "); return false;'><span class='smallLink'>[delete]</span></a></td>
            </tr>";
    }
    $tableStr .= "</table>";

    $data['title'] = APP_NAME . " Admin";
    $data['headerTitle'] = APP_NAME . " - Admin";
    $data['menu'] = "divSystemKits";
    $data['content'] = "
        <script type='text/javascript'>
            function deleteKit(id) {
                var c = confirm('Are you sure you want to delete this kit?  This can\'t be undone!');
                if(c) {
                    window.location='?delete=' + id;
                }
            }
        </script>
        <div class='contentBlock'>
            <div class='contentBlockHeader'>Create Kit</div>
            <div class='contentBlockBody'>
                <span class='$newKitSuccess'>" . $newKitStatus['mesg'] . "</span>
                <form method='post' action=''>
                    <input type='hidden' name='action' value='newKit' />
                    <input type='text' name='newKitName' />
                    <input type='submit' value='Create' />
                </form>
            </div>
        </div>
        <div class='contentBlock'>
            <div class='contentBlockHeader'>Kits</div>
            <div class='contentBlockBody'>$tableStr</div>
        </div>
        <div class='contentBlock'>
            <div class='contentBlockHeader'>Synchronize Kits</div>
            <div class='contentBlockBody'>
                <form method='post' action=''>
                    <input type='hidden' name='action' value='syncKits' />
                    <input type='submit' value='Sync Now' />
                </form>
            </div>
        </div>
    ";

    $template->render($data);
?>
