<?php
session_start();

// セッションに保存されたパスにリダイレクト
if (isset($_SESSION['previous_path'])) {
    header('Location: ' . $_SESSION['previous_path']);
    exit;
} else {
    // セッションにパスがない場合のデフォルト動作
    header('Location: ../php/home.php');
    exit;
}
?>
