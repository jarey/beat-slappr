<?php
    class Base64 {
        public function encode($file) {
            if($file && is_file($file)) {
                $fh = fopen($file, 'rb');
                $buffer = fread($fh, filesize($file));
                fclose($fh);

                $b64 = base64_encode($buffer);
                return $b64;
            }else {
                return false;
            }
        }
        
        public function decode($str) {
            return base64_decode($str);
        }
    }
?>
