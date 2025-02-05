<?php
session_start();

// DB接続情報
putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    try {
        // PDOを使ってデータベースに接続
        $pdo = new PDO($dsn, $dbuser, $dbpass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // ユーザー名の重複をチェック
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM USERS WHERE NAME = :name");
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->fetchColumn() > 0) {
            $_SESSION['signup_error'] = 'すでに名前が登録済みです';
            header("Location: ../php/signup.php");
            exit;
        }

        // パスワード確認
        if ($password !== $confirm_password) {
            $_SESSION['signup_error'] = 'パスワードが一致しません';
            header("Location: ../php/signup.php");
            exit;
        }

        // パスワードをハッシュ化
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // ユーザーを挿入
        $stmt = $pdo->prepare("INSERT INTO USERS (NAME, HASHED_PASSWORD) VALUES (:NAME, :HASHED_PASSWORD)");
        $stmt->bindParam(':NAME', $name, PDO::PARAM_STR);
        $stmt->bindParam(':HASHED_PASSWORD', $hashed_password, PDO::PARAM_STR);
        $stmt->execute();

        // 挿入された行のUSER_IDを取得
        $stmt = $pdo->prepare("SELECT USER_ID FROM USERS WHERE NAME = :NAME");
        $stmt->bindParam(':NAME', $name, PDO::PARAM_STR);
        $stmt->execute();
        $user_id = $stmt->fetchColumn();

        // セッションにユーザー情報を保存
        $_SESSION['user_id'] = $user_id;
        $_SESSION['name'] = $name;
        $_SESSION['logged_in'] = true;

        // サインアップ成功ページにリダイレクト
        header("Location: ../php/signupOK.php");
        exit;
    } catch (PDOException $e) {
        $_SESSION['signup_error'] = 'データベースエラー: ' . $e->getMessage();
        header("Location: ../php/signup.php");
        exit;
    }
}
