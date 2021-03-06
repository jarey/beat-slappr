<?php 
require_once "config.php";
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta name="description" content="Hotlinks - Realtime web statistics" />
<title>Hotlinks - Realtime web statistics</title>
<link rel="stylesheet" href="includes/style/style.css" type="text/css" media="screen" />
<?php
if(HOTLINKS_DEV) {
$dir = 'includes/scripts/';
$jsFileArr = file($dir . 'js.list');
$count = sizeof($jsFileArr);
for ($i=0; $i<$count; $i++) {
$jsFileArr[$i] = preg_replace('/([\r\n])+/i', '', $jsFileArr[$i]);
if(strlen($jsFileArr[$i])) {
echo "<script src='" . $dir . $jsFileArr[$i] . "'></script>\n";
}
}
}else {
echo "<script src='includes/scripts/script.js'></script>";
}
?>
<script type="text/javascript">
<?php
if(preg_match('/^https?:\/\//', HOTLINKS_APP_PATH)) {
echo "var appPath = '" . HOTLINKS_APP_PATH . "'";
}else {
echo "var appPath = 'http://" . HOTLINKS_APP_PATH . "'";
}
?>
</script>
</head>
<body>
<div id="divMainWrapper">
<div id="divTopBar">
<div>Today</div>
<div>This Week</div>
<div>This Month</div>
<div>This Year</div>
<div>All</div>
<div>Custom</div>
</div>
<select id="cmbStatType">
<option value="page_visited" selected="selected">&nbsp;Traffic</option>
<option value="referring_site">&nbsp;Top Referring Sites</option>
<option value="visitors">&nbsp;Visitors</option>
</select>
<div id="divGrid"></div>
<div id="divStatusBar">
<table>
<tr>
<td style="width: 558px;"><b>TOTAL</b></td>
<td style="width: 180px; text-align: right;"><b><label id="lblUniqueTotal"></label></b></td>
<td style="width: 140px; text-align: right;"><b><label id="lblVisitTotal"></label></b></td>
</tr>
</table>
</div>
</div>
</body>
</html>
