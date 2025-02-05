<?php
// セッションを開始
session_start();

// 現在のURLを取得
$currentUrl = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

// URLをセッションに保存
$_SESSION['previous_path'] = $currentUrl;
?>