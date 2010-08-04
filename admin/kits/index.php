<?php 
    require_once "../includes/config/config.inc.php";

    require_once APP_PATH . "admin/includes/templates/main.tpl.php";
    require_once APP_PATH . "/api/classes/system.inc.php";

    $systemAPI = new System();
    $template = new MainTemplate();

    if($_POST) {
        $newKitName = $_POST['newKitName'];
        $systemAPI->newKit($newKitName);
    }

    if($_GET) {
        $deleteId = $_GET['delete'];
        $systemAPI->deleteKit($deleteId);
        header('Location: .');
    }

    $systemKits = $systemAPI->getKits();
    $tableStr = "<table>";
    foreach($systemKits as $systemKit) {
        $tableStr .= "
            <tr>
                <td>" . $systemKit['name'] . "</td>
                <td><a href='edit/?id=" . $systemKit['id'] . "'>Edit</a></td>
                <td><a href='#' onclick='deleteKit(" . $systemKit['id'] . "); return false;'>Delete</a></td>
            </tr>";
    }
    $tableStr .= "</table>";

    $data['title'] = "Beat Slappr Admin - System Kits";
    $data['headerTitle'] = "Beat Slappr - Admin";
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
            System Kits:<br />
            $tableStr
        </div>
        <div class='contentBlock'>
            Create System Kit:<br />
            <form method='post' action=''>
                <input type='text' name='newKitName' />
                <input type='submit' value='Create' />
            </form>
        </div>    
        <div class='contentBlock'>
            <a href='rebuild'>Rebuild All System Kits</a>
        </div>
    ";

    $template->render($data);
?>
