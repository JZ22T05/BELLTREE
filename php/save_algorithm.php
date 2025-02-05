<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php';

// エラー設定
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// デバッグ用ログ
error_log("セッションID: " . session_id());
error_log("セッションデータ: " . print_r($_SESSION, true));

// デフォルトで未ログイン状態を設定
if (!isset($_SESSION['logged_in'])) {
    $_SESSION['logged_in'] = false;
}

// リクエストデータを取得
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// JSONデコードエラーをチェック
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'JSONデコードエラー: ' . json_last_error_msg()]);
    exit;
}

// セッションにノードデータを保存
if (isset($data['nodes'])) {
    $_SESSION['node_data'] = $data['nodes'];
    error_log("セッションに保存されたノードデータ: " . print_r($data['nodes'], true));
}

// タイムをセッションに保存
if (isset($data['clearTime'])) {
    $_SESSION['clear_time'] = $data['clearTime'];
    error_log("セッションに保存されたクリアタイム: " . $data['clearTime']);
}

// リクエストのactionキーを確認
if (isset($data['action']) && $data['action'] === "get_session_data") {
    echo json_encode([
        'success' => true,
        'user_id' => $_SESSION['user_id'] ?? null,
        'stage_id' => $_SESSION['stage_id'] ?? null,
        'logged_in' => $_SESSION['logged_in'],
    ]);
    exit;
}

// SQLデータの処理
if (!isset($data['sql'])) {
    echo json_encode(['success' => false, 'message' => 'SQLデータが提供されていません。']);
    exit;
}

$sql = $data['sql'];

try {
    $pdo = dbConnect();
    $pdo->beginTransaction();

    if ($_SESSION['logged_in'] === true) {
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        // ALGORITHM_ID の取得
        $algorithmStmt = $pdo->query("SELECT MAX(ALGORITHM_ID) AS ALGORITHM_ID FROM ALGORITHM");
        $algorithmResult = $algorithmStmt->fetch(PDO::FETCH_ASSOC);
        $algorithmId = $algorithmResult['ALGORITHM_ID'];

        // CLEAR_ID の取得
        $clearStmt = $pdo->query("SELECT MAX(CLEAR_ID) AS CLEAR_ID FROM STAGE_CLEAR_HISTORY WHERE ALGORITHM_ID = $algorithmId");
        $clearResult = $clearStmt->fetch(PDO::FETCH_ASSOC);
        $clearId = $clearResult['CLEAR_ID'];

        // セッションに保存
        $_SESSION['algorithm_id'] = $algorithmId;
        $_SESSION['clear_id'] = $clearId;

        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'アルゴリズムが保存されました。',
            'algorithm_id' => $algorithmId,
            'clear_id' => $clearId,
        ]);
    } else {
        $pdo->commit();
        echo json_encode([
            'success' => true,
            'message' => 'ユーザー未ログインのため、SQL保存はスキップされました。',
        ]);
    }
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("データベースエラー: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'データベースエラー: ' . $e->getMessage()]);
}
exit;



// session_start();
// header('Content-Type: application/json');
// require_once 'db_connect.php';

// // エラー設定（ブラウザに表示せず、ログに記録）
// ini_set('display_errors', 0);
// ini_set('log_errors', 1);
// error_reporting(E_ALL);

// // デバッグ用ログ
// error_log("セッションID: " . session_id());
// error_log("セッションデータ: " . print_r($_SESSION, true));

// // デフォルトで未ログイン状態を設定
// if (!isset($_SESSION['logged_in'])) {
//     $_SESSION['logged_in'] = false;
// }

// // リクエストデータを取得
// $input = file_get_contents('php://input');
// $data = json_decode($input, true);

// // JSONデコードエラーをチェック
// if (json_last_error() !== JSON_ERROR_NONE) {
//     echo json_encode(['success' => false, 'message' => 'JSONデコードエラー: ' . json_last_error_msg()]);
//     exit;
// }

// // セッションにノードデータとタイム保存
// if (isset($data['nodes'])) {
//     $_SESSION['node_data'] = $data['nodes'];
//     error_log("セッションに保存されたノードデータ: " . print_r($data['nodes'], true));
// }

// if (isset($data['elapsedTime'])) {
//     $_SESSION['elapsed_time'] = $data['elapsedTime']; // タイムをセッションに保存
//     error_log("セッションに保存されたタイム: " . $data['elapsedTime']);
// }

// // リクエストのactionキーを確認
// if (isset($data['action']) && $data['action'] === "get_session_data") {
//     echo json_encode([
//         'success' => true,
//         'user_id' => $_SESSION['user_id'] ?? null,
//         'stage_id' => $_SESSION['stage_id'] ?? null,
//         'logged_in' => $_SESSION['logged_in'],
//     ]);
//     exit;
// }

// // SQLデータの処理
// if (!isset($data['sql'])) {
//     echo json_encode(['success' => false, 'message' => 'SQLデータが提供されていません。']);
//     exit;
// }

// $sql = $data['sql'];

// try {
//     $pdo = dbConnect();
//     $pdo->beginTransaction();

//     if ($_SESSION['logged_in'] === true) {
//         $stmt = $pdo->prepare($sql);
//         $stmt->execute();

//         // ALGORITHM_ID の取得
//         $algorithmStmt = $pdo->query("SELECT MAX(ALGORITHM_ID) AS ALGORITHM_ID FROM ALGORITHM");
//         $algorithmResult = $algorithmStmt->fetch(PDO::FETCH_ASSOC);
//         $algorithmId = $algorithmResult['ALGORITHM_ID'];

//         // CLEAR_ID の取得
//         $clearStmt = $pdo->query("SELECT MAX(CLEAR_ID) AS CLEAR_ID FROM STAGE_CLEAR_HISTORY WHERE ALGORITHM_ID = $algorithmId");
//         $clearResult = $clearStmt->fetch(PDO::FETCH_ASSOC);
//         $clearId = $clearResult['CLEAR_ID'];

//         // セッションに保存
//         $_SESSION['algorithm_id'] = $algorithmId;
//         $_SESSION['clear_id'] = $clearId;

//         $pdo->commit();

//         echo json_encode([
//             'success' => true,
//             'message' => 'アルゴリズムが保存されました。',
//             'algorithm_id' => $algorithmId,
//             'clear_id' => $clearId,
//         ]);
//     } else {
//         $pdo->commit();
//         echo json_encode([
//             'success' => true,
//             'message' => 'ユーザー未ログインのため、SQL保存はスキップされました。',
//         ]);
//     }
// } catch (PDOException $e) {
//     $pdo->rollBack();
//     error_log("データベースエラー: " . $e->getMessage());
//     echo json_encode(['success' => false, 'message' => 'データベースエラー: ' . $e->getMessage()]);
// }
// exit; // 応答の後に追加の出力を防ぐ
