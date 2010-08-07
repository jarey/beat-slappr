<?php 
    require_once "../../config.php";
    require_once APP_PATH . "admin/includes/templates/main.tpl.php";

    if($_FILES) {
        require_once APP_PATH . "api/classes/base64.inc.php";
        $uploadedFile = $_FILES['encodeFile']['tmp_name'];
        $uploadedFileSize = filesize($uploadedFile);

        $encoded = "<div style='margin-top: 30px; text-align: center;'>";

        if($uploadedFileSize) {
            if($uploadedFileSize <= 1048576) {
                $base64 = new Base64();
                $encoded .= "<span class='fileHeading'>" . $_FILES['encodeFile']['name'] . " (" . $uploadedFileSize . ") bytes</span><br /><textarea readonly='readonly' onfocus='this.select(); return false;' onclick='this.select(); return false;'>" . $base64->encode($uploadedFile) . "</textarea>";
            }else {
                $encoded .= "<span class='error'>File must be no larger than 1MB.</span>";
            }
        }else {
            $encoded .= "<span class='error'>There was an error encoding the file.</span>";
        }
        
        $encoded .= "</div>";
    }
    /***********************MAIN*********************/
    $template = new MainTemplate();
    $data['title'] = "Beat Slappr Admin - Base64 Encoder";
    $data['headerTitle'] = "Beat Slappr - Admin";
    $data['menu'] = "divBase64Encoder";
    $data['content'] = "
        <div style='width: 300px; margin: 20px auto 0 auto; text-align: center;'>
            <form method='post' enctype='multipart/form-data' action=''>
                <span class='fileHeading'>File:</span> <input type='file' name='encodeFile' /><br /><br />
                <input type='submit' value='Encode File' />
            </form>
        </div>
    " . $encoded;

    $template->render($data);
?>
