<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
  header("Location: ../php/login.php");
  exit;
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/login.css">
  <link rel="stylesheet" href="../css/top.css">
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const elements = document.querySelectorAll('.Welcome, .OK-thank, .thankyou, .login-btn');

      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('visible');
        }, index * 300);
      });
    });
  </script>
  <title>Bell Tree</title>


</head>

<body>
  <main class="OK">

    <section>
      <h1 class="Welcome fade-in">Welcome to Bell Tree,<?php echo htmlspecialchars($_SESSION['name'], ENT_QUOTES, 'UTF-8'); ?>!</h1>
      <div class="OK-thank fade-in">
        <p class="thankyou fade-in">Thank you for signing up for Bell Tree.</p>
        <p class="thankyou fade-in">Go to Home Page.</p>
      </div>
      <a href="/game/php/home.php" class="login-btn fade-in">Home</a>
    </section>
  </main>
</body>

</html>