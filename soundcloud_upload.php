<?php
    if($_POST && $_GET) {

        session_start();

        require_once('api/soundcloud.php');
        $soundcloud = new Soundcloud('p9Gc43VitK23sjVtWIv1Q', '4b67WnZRU9jgh3EuOG8predltaXPGyxtsQZMKvuUKI', 'http://localhost/patternsketch/soundcloud_upload.php');
        $accessToken = $soundcloud->accessToken($_GET['code']);

        $title = (isset($_POST['title'])) ? $_POST['title'] : "";
        $description = (isset($_POST['description'])) ? $_POST['description'] : "";
        $downloadable = (isset($_POST['downloadable'])) ? "true" : "false";

        $options = array(
            "asset_data"   => "@/var/www/patternsketch/" . $_SESSION['soundcloud_tmp_file'],
            "title"        => $title,
            "description"  => $description,
            "sharing"      => "public",
            "streamable"   => "true",
            "downloadable" => $downloadable
        );
        $result = $soundcloud->execute('tracks.json', 'track', 'POST', $options, 'multipart/form-data');
        print_r($result);

        //http://api.soundcloud.com/groups/123/contributions/44949549
    }else {
?>

<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <title>Soundcloud Upload</title>
    </head>
    <body>
        <form action="" method="post">
            Title <input type="text" name="title" /><br />
            Description <input type="text" name="description" />
            Downloadable? <input type="checkbox" name="downloadable" checked="checked" />
            <input type="submit" value="Upload to Soundcloud" /><br />
        </form>
    </body>
</html>

<?php
    }
?>
