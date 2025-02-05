<?php
// データベース接続用の設定
putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

// DB接続関数
function dbConnect()
{
    try {
        $pdo = new PDO($GLOBALS['dsn'], $GLOBALS['dbuser'], $GLOBALS['dbpass']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        echo "<script>alert('データベース接続エラー: " . $e->getMessage() . "');</script>";
        exit;
    }
}
?>