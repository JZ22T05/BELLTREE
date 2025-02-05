<?php
session_start();
header('Content-Type: application/json');

// POSTリクエストでステージIDを保存する処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // リクエストボディを取得
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // ステージIDが提供されているか確認
    if (isset($data['stage_id'])) {
        $_SESSION['stage_id'] = $data['stage_id']; // ステージIDをセッションに保存
        echo json_encode(['success' => true, 'message' => 'ステージIDがセッションに保存されました。']);
        exit;
    } else {
        echo json_encode(['success' => false, 'message' => 'ステージIDが送信されていません。']);
        exit;
    }
}

// URLパラメータからID、info、imgを取得し、セッションに保存
if (isset($_GET['id']) && isset($_GET['info']) && isset($_GET['img'])) {
    $_SESSION['id'] = $_GET['id'];
    $_SESSION['info'] = $_GET['info'];
    $_SESSION['img'] = $_GET['img'];

    // ユーザーIDとユーザーNAMEもセッションに保存
    if (isset($_SESSION['user_id']) && isset($_SESSION['name'])) {
        $_SESSION['saved_user_id'] = $_SESSION['user_id'];
        $_SESSION['saved_user_name'] = $_SESSION['name'];
    }
    header('Location: stagedl.php'); // 保存後、stagedl.phpへリダイレクト
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'IDまたは情報が指定されていません。']);
    exit;
}
?>