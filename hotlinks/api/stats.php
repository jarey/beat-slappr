<?php
    if(isset($_REQUEST['dateRange'])) {
        $dateRange = $_REQUEST['dateRange'];
    }else {
        return false;
    }

    if(isset($_REQUEST['statType'])) {
        $statType = $_REQUEST['statType'];
        if($statType != "page_visited" && $statType != "referring_site" && $statType != "visitors") {
            return false;
        }
    }else {
        return false;
    }

    require_once("../config.php");

    switch($dateRange) {
        case "today":
            $where = " WHERE strftime('%Y-%m-%d', timestamp) = strftime('%Y-%m-%d', current_timestamp)";
        break;
        case "week":
            $where = " WHERE strftime('%Y-%W', timestamp) = strftime('%Y-%W', current_timestamp)";
        break;
        case "month":
            $where = " WHERE strftime('%Y-%m', timestamp) = strftime('%Y-%m', current_timestamp)";
        break;
        case "year":
            $where = " WHERE strftime('%Y', timestamp) = strftime('%Y', current_timestamp)";
        break;
        case "all":
            $where = "";
        break;
        case "custom":
            if(isset($_REQUEST['from']) && isset($_REQUEST['to'])) {
                $from = explode('/', $_REQUEST['from']);
                $to = explode('/', $_REQUEST['to']);
                $where = " WHERE timestamp BETWEEN '" . $from[2] . "-" . $from[0] . "-" . $from[1] . " 00:00:00' AND '" . $to[2] . "-" . $to[0] . "-" . $to[1] . " 23:59:59'";
            }else {
                return false;
            }
        break;
        default:
            return false;
        break;
    }

    $db = new SQLite3(HOTLINKS_DB_PATH . "hotlinks.db.sqlite");

    if($statType == "page_visited" || $statType == "referring_site") {
        $sql = "SELECT unique_visitors." . $statType . " AS page, unique_visits, total_visits
                FROM (SELECT " . $statType . ", COUNT(client_ip) AS unique_visits FROM (SELECT " . $statType . ", client_ip FROM visits" . $where . " GROUP BY " . $statType . ", client_ip) GROUP BY " . $statType . ") AS unique_visitors,
                     (SELECT " . $statType . ", COUNT(client_ip) AS total_visits FROM visits" . $where . " GROUP BY " . $statType . ") AS total_visitors
                WHERE unique_visitors." . $statType . " = total_visitors." . $statType . "";

        $result = $db->query($sql);

        $resultArr = getAllRows($result);
        $uniqueTotal = 0;
        $visitTotal = 0;
        foreach($resultArr as $key => $val) {
            $uniqueTotal += $val['unique_visits'];
            $visitTotal += $val['total_visits'];
        }

        echo json_encode(array("unique_total" => $uniqueTotal, "visit_total" => $visitTotal, "data" => $resultArr));
    }else if($statType == "visitors") {
        $sql = "SELECT client_ip, page_visited, referring_site, timestamp FROM visits" . $where;
        $result = $db->query($sql);
        $resultArr = getAllRows($result);

        echo json_encode(array("unique_total" => "", "visit_total" => count($resultArr), "data" => $resultArr));
    }
    
    function getAllRows($result) {
        $resultArr = array();
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            array_push($resultArr, $row);
        }
        return $resultArr;        
    }
?>
