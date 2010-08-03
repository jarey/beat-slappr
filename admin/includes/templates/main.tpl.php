<?php
    class MainTemplate {
        private $menuArr;
        
        function __construct() {
            $this->menuArr = array(
                "divSystemKits" => array(
                    "name"  => "System Kits",
                    "href"  => APP_URL . "admin/kits"
                ),
                "divSystemPatterns" => array(
                    "name"  => "System Patterns",
                    "href"  => APP_URL . "admin/patterns"
                ),
                "divBase64Encoder" => array(
                    "name"  => "Base64 Encoder",
                    "href"  => APP_URL . "admin/base64"
                )
            );
        }

        public function render($data) {
            echo "
            <!DOCTYPE HTML>
            <html>
                <head>
                    <title>" . $data['title'] . "</title>
                    <link rel='stylesheet' href='" . APP_URL . "admin/includes/style/style.css' type='text/css' media='screen' />
                </head>
                <body>
                    <div id='divHeader'>
                        <div id='divHeaderTitle'><a href='" . APP_URL . "admin'>" . $data['headerTitle'] . "</a></div>
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
