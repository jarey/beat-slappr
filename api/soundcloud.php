<?php
   class Soundcloud {
        private $clientId;
        private $clientSecret;
        private $redirectUrl;
        private $authorizeUrl;
        private $accessToken;

        function __construct($clientId, $clientSecret, $redirectUrl) {
            $this->clientId = $clientId;
            $this->clientSecret = $clientSecret;
            $this->redirectUrl = urlencode($redirectUrl);

            $this->authorizeUrl = "https://soundcloud.com/connect?client_id=" . $this->clientId . "&redirect_uri=" . $this->redirectUrl . "&response_type=code";
        }

        public function getAuthorizeUrl() {
            return $this->authorizeUrl;
        }
        
        public function accessToken($code) {
            $str = "curl 'https://api.soundcloud.com/oauth2/token'";
            $str .= " -d 'client_id=" . $this->clientId . "'";
            $str .= " -d 'client_secret=" . $this->clientSecret . "'";
            $str .= " -d 'grant_type=authorization_code'";
            $str .= " -d 'redirect_uri=" . $this->redirectUrl . "'";
            $str .= " -d 'code=" . $code . "'";

            $token = json_decode(`$str`);
            $this->accessToken = $token->access_token;
            return $token;
        }
        
        public function execute($url, $resource, $method, $options=array(), $encType="application/x-www-form-urlencoded") {
            //SET UP THE ENCODING FLAG
            if($encType == "application/x-www-form-urlencoded") {
                $encFlag = "-d";
            }else if($encType == "multipart/form-data") {
                $encFlag = "-F";
            }else {
                return false;
            }
            
            if($method !== "GET" && $method != "POST" && $method != "PUT" && $method != "DELETE") {
                return false;
            }

            $str = "curl -X $method 'https://api.soundcloud.com/$url' " . $encFlag . " 'oauth_token=" . $this->accessToken . "'";
                
            foreach($options as $key => $val) {
                $val = str_replace('"', '\"', $val);
                $str .= " $encFlag $resource" . "[" . $key . "]" . "=\"$val\"";
            }

            return json_decode(`$str`);
        }
   }
?>
