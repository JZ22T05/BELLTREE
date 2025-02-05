<?php
// セッションを開始
session_start();

// セッションデータからstage_idを取得（デフォルト値: null）
$stage_id = isset($_SESSION['stage_id']) ? $_SESSION['stage_id'] : null;

// JSONとして出力
header('Content-Type: application/json');
echo json_encode(['stage_id' => $stage_id]);
?>