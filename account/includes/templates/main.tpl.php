<?php
    class MainTemplate {
        private $menuArr;
        
        function __construct() {
            $this->menuArr = array();
        }

        public function render($data) {
            echo "
            <!DOCTYPE HTML>
            <html>
                <head>
                    <title>" . $data['title'] . "</title>
                    <link rel='stylesheet' href='" . APP_URL . "account/includes/style/style.css' type='text/css' media='screen' />
                </head>
                <body>
                    <div id='divHeader'>
                        <div id='divHeaderTitle'>" . $data['headerTitle'] . "</div>
                        <div id='divHeaderMenu'>";
                            foreach($this->menuArr as $key => $val) {
                                if(isset($data['menu']) && $data['menu'] == $key) {
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
