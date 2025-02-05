<?php
session_start(); // セッションの開始

session_start();

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['stage_id'])) {
    $_SESSION['stage_id'] = $data['stage_id']; // セッション保存
    echo json_encode(['success' => true, 'session' => $_SESSION]); // セッションの内容も確認
} else {
    echo json_encode(['success' => false, 'message' => 'STAGE_IDが送信されていません。']);
}
