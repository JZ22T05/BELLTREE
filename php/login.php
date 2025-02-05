<?php
session_start();

// データベース接続設定
putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

$error_message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 前後の空白を取り除く
    $name = trim($_POST['name']);
    $password = trim($_POST['password']); // クライアント側から受け取ったパスワードもtrimする

    try {
        $pdo = new PDO($dsn, $dbuser, $dbpass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // ユーザー名で検索
        $stmt = $pdo->prepare("SELECT USER_ID, NAME, HASHED_PASSWORD FROM USERS WHERE NAME = :name");
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->execute();

        // ユーザー情報を取得
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // ユーザーが見つかった場合
        if ($user) {
            // password_verifyを使ってパスワードとハッシュを比較
            if (password_verify($password, $user['HASHED_PASSWORD'])) {
                // セッションにユーザー情報を保存
                $_SESSION['user_id'] = $user['USER_ID'];
                $_SESSION['name'] = $user['NAME'];

                // ようこそメッセージを一時的にセッションに保存
                $_SESSION['welcome_message'] = "ようこそ " . htmlspecialchars($user['NAME'], ENT_QUOTES, 'UTF-8') . " さん";
                $_SESSION['logged_in'] = true;

                // home.php にリダイレクト
                header("Location: home.php");
                exit;
            } else {
                $error_message = "パスワードが間違っています。";
            }
        } else {
            $error_message = "ユーザーが見つかりません。";
        }
    } catch (PDOException $e) {
        $error_message = "データベースエラー: " . $e->getMessage();
    } finally {
        $pdo = null;
    }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/login.css">
    <link rel="stylesheet" href="../css/top.css">
    <title>Login</title>
</head>
<body>
    <section>
        <h2 class="login-title">Login</h2>

        <!-- エラーメッセージの表示 -->
        <?php if (!empty($error_message)) : ?>
            <script>
                alert("<?= htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8'); ?>");
            </script>
        <?php endif; ?>

        <form action="login.php" method="POST">
            <div class="form-group">
                <input type="text" placeholder="Name" id="name" name="name" required>
            </div>
            <div class="form-group">
                <input type="password" placeholder="Password" id="password" name="password" required>
            </div>
            <div>
                <input type="submit" value="Login" class="login-btn">
            </div>
        </form>
        <div class="form-group">
            <a href="/game/php/signup.php" class="signup-link">Signup</a>
        </div>
    </section>
</body>
</html>