<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Not Found</title>
  <link rel="stylesheet" href="../css/404.css">
</head>
<body>
  <?php
  // 404ステータスを送信
  http_response_code(404);
  ?>
  <div class="container">
    <h1 class="error-title">404</h1>
    <p class="error-message">お探しのページが見つかりません。</p>
    <div class="error-actions">
      <a href="../php/home.php" class="error-button">Home Back</a>
    </div>
    <div class="error-animation">
      <img src="../img/Mrszuki.png" alt="Lost Character" class="error-image">
      <p class="blinking-text">迷子になっちゃった！</p>
    </div>
  </div>
</body>
</html>
