<?php
class Database
{
    public $bd;

    function __construct($ip, $user, $pass, $database, $port = 3306)
    {
        $this->bd = new mysqli($ip, $user, $pass, $database, $port);
        if ($this->bd->connect_error) {
            die("Erro: " . $this->bd->connect_error);
        }
        $this->bd->set_charset('utf8');
    }

    function Query($query)
    {
        if (strlen($query) > 0) {
            $result = $this->bd->query($query);
            if (isset($result->num_rows)) { // SELECT
                $arrRes = array();
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $arrRes[] = $row;
                    }
                }
                return $arrRes;
            } else if ($result === TRUE) { // INSERT, DELETE, UPDATE
                if ($last_id = $this->bd->insert_id) {
                    return $last_id;
                }
                return 1;
            }
            return 0;
        } else {
            die("ERROR: Invalid Query");
        }
    }
}
?>