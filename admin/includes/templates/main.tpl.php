<?php
    class MainTemplate {
        private $baseDir;
        private $menuArr;
        
        function __construct() {
            $this->baseDir = "/beat-slappr/admin";
            $this->menuArr = array(
                "divSystemKits" => array(
                    "name"  => "System Kits",
                    "href"  => $this->baseDir . "/kits"
                ),
                "divSystemPatterns" => array(
                    "name"  => "System Patterns",
                    "href"  => $this->baseDir . "/patterns"
                ),
                "divBase64Encoder" => array(
                    "name"  => "Base64 Encoder",
                    "href"  => $this->baseDir . "/base64"
                )
            );
        }

        public function render($data) {
            echo "
            <!DOCTYPE HTML>
            <html>
                <head>
                    <title>" . $data['title'] . "</title>
                    <link rel='stylesheet' href='" . $this->baseDir . "/includes/style/style.css' type='text/css' media='screen' />
                </head>
                <body>
                    <div id='divHeader'>
                        <div id='divHeaderTitle'><a href='" . $this->baseDir . "'>" . $data['headerTitle'] . "</a></div>
                        <div id='divHeaderMenu'>";
                            foreach($this->menuArr as $key => $val) {
                                if($data['menu'] == $key) {
                                    $active = " class='activeMenu'";
                                    $href = $val['name'];
                                }else {
                                    $active = " class='inactiveMenu'";
                                    $href = "<a href='" . $val['href'] . "'>" . $val['name'] . "</a>";
                                }
                                echo "<div id='" . $key . "'" . $active . ">" . $href . "</div>";
                            }
                        echo "
                        </div>
                    </div>
                    <div id='divContent'>" . $data['content'] . "</div>
                </body>
            </html>";
        }
    }
?>
