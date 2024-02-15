<?php
@session_start();
global $arrConfig;

include_once $arrConfig['dir_site'] . '/include/db.inc.php';

$arrConfig['servername'] = 'localhost';
$arrConfig['username'] = '12itm210';
$arrConfig['password'] = '12itm210654b582fc439d';
$arrConfig['dbname'] = '12itm210_portfolio';

$DataBase = new Database($arrConfig['servername'], $arrConfig['username'], $arrConfig['password'], $arrConfig['dbname']);

// acessos FrontOffice
$arrConfig['url_site'] = 'http://web.colgaia.local/12itm210/portfolio';
$arrConfig['dir_site'] = 'W:\www\portfolio';
?>