<section>
  <h2 class="login-title">Signup</h2>
  <?php
  session_start();
  if (isset($_SESSION['signup_error'])) {
    echo '<p class="error-message">' . htmlspecialchars($_SESSION['signup_error'], ENT_QUOTES, 'UTF-8') . '</p>';
    unset($_SESSION['signup_error']); // エラー表示後、セッションから削除
  }
  ?>
  <!DOCTYPE html>
  <html lang="ja">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="../css/signup.css"> -->
    <link rel="stylesheet" href="../css/login.css">
    <!-- <link rel="stylesheet" href="../css/top.css"> -->
    <title>SignUp</title>
  </head>

  <body>
    <form action="/game/php/set_signup.php" method="POST" id="signupForm"> <!-- サインアップフォーム -->
      <div class="form-group">
        <input type="text" placeholder="Name" id="name" name="name" required>
      </div>
      <div class="form-group">
        <input type="password" placeholder="Password" id="password" name="password" required>
      </div>
      <div class="form-group">
        <input type="password" placeholder="Confirm Password" id="confirm_password" name="confirm_password" required>
      </div>
      <div>
        <input type="submit" class="login-btn" value="Sign Up">
      </div>
    </form>
    <div class="form-group">
      <a href="/game/php/login.php" class="signup-link">Already have an account? Login here</a>
    </div>
</section>
</body>

</html>