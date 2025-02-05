<?php
session_start();
header('Content-Type: application/json');

// POSTリクエストの確認
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // リクエストボディを取得してデコード
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // STAGE_IDの存在を確認
    if (isset($data['stage_id'])) {
        $_SESSION['stage_id'] = $data['stage_id']; // セッションに保存

        // デバッグ用ログ（オプション）
        error_log("保存されたSTAGE_ID: " . $_SESSION['stage_id']);

        echo json_encode(['success' => true, 'message' => 'STAGE_IDがセッションに保存されました。']);
        exit;
    } else {
        echo json_encode(['success' => false, 'message' => 'STAGE_IDが送信されていません。']);
        exit;
    }
}

// POST以外のリクエスト
echo json_encode(['success' => false, 'message' => '無効なリクエスト方法です。']);
?>