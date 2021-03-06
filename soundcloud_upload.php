<?php
    session_start();
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <title>Soundcloud Upload</title>
        <style>
            body {
                font-family: arial;
                color: #111;
                background-color: #f6f6f6;
                margin: 0;
            }

            a {
                color: #0858D3;
                cursor: pointer;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }

            #divUploadWrapper {
                font-size: 14px;
                width: 420px;
                margin: 30px auto 0 auto;
                padding: 10px;
                background-color: #ddd;
                -moz-border-radius: 5px;
                -webkit-border-radius: 5px;
            }

            table {
                width: 100%            
            }

            .labelAlign {
                text-align: right;
            }

            input[type=text] {
                width: 100%;
            }
            
            #divSubmitWrapper {
                width: 189px;
                margin: 25px auto 0 auto;
            }
            
            .errorMesg {
                font-weight: bold;
                color: #ff0000;
            }
        </style>
    </head>
    <?php
        if($_POST && $_GET) {

            require_once('config.php');
            require_once('api/soundcloud.php');
            require_once('api/classes/db.inc.php');
            require_once('api/classes/battle.inc.php');
            require_once('api/classes/pattern.inc.php');

            $soundcloud = new Soundcloud(SOUNDCLOUD_API_CLIENT_ID, SOUNDCLOUD_API_CLIENT_SECRET, SOUNDCLOUD_API_REDIRECT_URL);
            $accessToken = $soundcloud->accessToken($_GET['code']);

            $title = (isset($_POST['title'])) ? $_POST['title'] : "";
            $description = (isset($_POST['description'])) ? $_POST['description'] : "";
            $downloadable = (isset($_POST['downloadable'])) ? "true" : "false";
            
            if($title) {
                $user = 'soundcloud';
                $sequence = $_SESSION['sequenceArr'];
                $hash = md5($user . $sequence + rand());
                $shareUrl = APP_URL . "?p=" . $hash;

                $options = array(
                    "asset_data"   => "@" . APP_PATH . $_SESSION['soundcloud_tmp_file'],
                    "title"        => $title,
                    "description"  => $description . "\n<a href='$shareUrl'>$shareUrl</a>",
                    "sharing"      => "public",
                    "streamable"   => "true",
                    "downloadable" => $downloadable
                );


                //UPLOAD TRACK TO SOUNDCLOUD
                $result = $soundcloud->execute('tracks.json', 'track', 'POST', $options, 'multipart/form-data');
                $permalink = $result->permalink_url;


                //ADD NEWLY UPLOADED TRACK INFO TO DB
                //$tracks = $soundcloud->execute('groups/20839/tracks?format=json', '', 'GET');
                $battle = new Battle();
                $battle->addTrack($result);

                //ASSOCIATE NEWLY UPLOADED TRACK WITH GROUP
                $soundcloud->execute('groups/20839/contributions/' . $result->id, '', 'PUT');


                //SAVE PATTERN IN `shared_patterns` TABLE
                $patternAPI = new Pattern();
                $patternAPI->share($user, $sequence, $hash);


                //DELETE TRACK FROM DISK AND CLEAR SESSION VARIABLES
                unlink($_SESSION['soundcloud_tmp_file']);
                $_SESSION['soundcloud_tmp_file'] = "";
                $_SESSION['sequenceArr'] = "";

                $success = true;
            }else {
                $error = true;
            }
        }
    ?>

    <body>
        <div id="divUploadWrapper">
            <?php if(!$success) { ?>
                <form action="" method="post">
                    <table>
                        <tr>
                            <td></td>
                            <td><?php echo (isset($error)) ? "<span class='errorMesg'>Title must be specified</span>" : ""; ?></td>
                        </tr>
                        <tr>
                            <td class="labelAlign">Title<span class="errorMesg">*</span></td>
                            <td><input type="text" name="title" /></td>
                        </tr>
                        <tr>
                            <td class="labelAlign">Description</td>
                            <td><input type="text" name="description" /></td>
                        </tr>
                        <tr>
                            <td class="labelAlign">Downloadable?</td>
                            <td><input type="checkbox" name="downloadable" checked="checked" /></td>
                        </tr>
                    </table>
                    <div id="divSubmitWrapper"><input type="image" src="includes/images/small-download-to-sc.png" onclick="this.src='includes/images/ajax-loader.gif'; document.getElementById('divSubmitWrapper').style.width='16px';" alt="Submit button"></div>
                </form>
            <?php }else { ?>
                <div style="width: 100%; text-align: center;">
                    Your pattern has been uploaded to SoundCloud!<br />
                    <a href="<?php echo $permalink; ?>" target="_blank">Go listen to it here</a>
                </div>
            <?php } ?>
        </div>
    </body>
</html>
