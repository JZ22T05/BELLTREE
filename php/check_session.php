<?php
session_start();
header('Content-Type: text/plain');

// セッションが空の場合のメッセージ
if (empty($_SESSION)) {
    echo "セッションにデータがありません。\n";
} else {
    echo "セッションデータ:\n";
    print_r($_SESSION);
}

// デバッグ用: セッションIDの確認
echo "\nセッションID:\n";
echo session_id();
?>