<?php
$bd = new mysqli("sql.freedb.tech", "freedb_servidor", "@nBpXu4m9f%H&QR", "freedb_database", 3306);
function Query($query)
{
    global $bd;
    if (strlen($query) > 0) {
        $result = $bd->query($query);
        if (isset($result->num_rows)) { // SELECT
            $arrRes = array();
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $arrRes[] = $row;
                }
            }
            return $arrRes;
        } else if ($result === TRUE) { // INSERT, DELETE, UPDATE
            if ($last_id = $bd->insert_id) {
                return $last_id;
            }
            return 1;
        }
        return 0;
    } else {
        die("ERROR: Invalid Query");
    }
}

header('Content-Type: application/json');
echo json_encode(Query($_GET["query"]));
?>