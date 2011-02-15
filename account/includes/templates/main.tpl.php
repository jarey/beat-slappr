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
                    <link rel='stylesheet' href='" . APP_URL . "account/includes/style/style.css' type='text/css' media='screen' />";

                    if(!DEV) { ?>
                        <script type="text/javascript">
                            var _gaq = _gaq || [];
                            _gaq.push(['_setAccount', 'UA-3259969-2']);
                            _gaq.push(['_trackPageview']);

                            (function() {
                                var  ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                            })();

                            var htA=htA||[],
                                hURL=hURL||"//<?php echo $_SERVER["SERVER_NAME"]; ?>/hotlinks/";
                            htA.push(['a','12345']);
                            (function(){
                                var s,d;
                                s=document.createElement('script');s.type='text/javascript';s.async=true;
                                s.src=document.location.protocol+hURL+"tracker.js";
                                d=document.getElementsByTagName('script')[0];d.parentNode.insertBefore(s, d);
                            })();
                        </script>
                    <?php }

                echo "
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
