<?php
    //require_once 'exception.inc.php';
    
    class DB {
        //PROPERTIES
        private $connection;
        private $result;
                
        //METHODS
        public function __construct($hostname, $database, $username, $password) {
            if(!$this->connection = mysql_connect($hostname, $username, $password)) {
                return false;
            }
            if(!mysql_select_db($database, $this->connection)) {
                throw new MySQLException("Unknown database.", mysql_errno());
            }
        }
        
        public function query($query) {
            if($this->result = mysql_query($query, $this->connection)) {
                return true;
            }else {
                return false;
            }
        }
        
        public function getRowCount() {
            $rowCount = mysql_num_rows($this->result);
            if($rowCount === false) {
                return false;
            }
            return $rowCount;
        }
        
        public function getRow($resultType='assoc') {
            $resultType = $this->_resultType($resultType);
            $row = mysql_fetch_array($this->result, $resultType);
        	if(!$row) {
                return false;
        	}
        	return $row;
        }
        
        public function getAll($resultType='assoc') {
            $resultType = $this->_resultType($resultType);        
            $rowCount = $this->getRowCount();
    		$resultArr = array();

            for($n=0; $n<$rowCount; $n++) {
    		    $row = $this->getRow($resultType);
    			$resultArr[$n] = $row;
    		}
    		return $resultArr;
        }
        
        public function resetPointer() {
            if(!mysql_data_seek($this->result, 0)) {
                return false;
            }
        }
        
        private function _resultType($resultType) {
            if($resultType == 'num') {
                $resultType = MYSQL_NUM;
            }else {
                $resultType = MYSQL_ASSOC;
            }
            return $resultType;
        }
    }
?>
