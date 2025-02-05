<?php
session_start();
$id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$name = isset($_SESSION['name']) ? $_SESSION['name'] : "ゲスト";
/*------------------パス保存---------------- */
$previous_path = $_SERVER['REQUEST_URI'];
$_SESSION['previous_path'] = $previous_path;
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/retro.css">
  <title>Bell Tree</title>
</head>
<body>
  <header class="retro-header">
    <div class="score-board">
      <!-- <span class="score">TIME 00</span> -->
      <?php if (!$id) { ?>
        <span class="login"><a href="../php/login.php">LOGIN</a></span>
<?php } else { ?>
  <span class="login"><a href="../php/logout.php">LOGOUT</a></span>
<?php } ?>
      
      <span class="ranking"><a href="../php/ranking.php">RANKING</a></span>
      <span class="setting"><a href="#" id="setting-button">SETTING</a></span>
    </div>
  </header>
  <main>
    <h1 class="game-title hidden">Bell Tree</h1>
    <p class="login-name hidden">
      <?php

      if (isset($_SESSION['name'])) {
          echo htmlspecialchars($_SESSION['name']) . "さん、こんにちは！！";
      } else {
          echo "ゲストさん、こんにちは！！";
      }
      ?>
    </p>
    <div class="main-image hidden">
      <img src="../img/Big-suzukiMigi.png" alt="Suzuki Character" class="character-image">
    </div>
    <div class="instructions hidden">
      <p>PUSH START BUTTON</p>
      <p>Let's Go Program World</p>
    </div>
    <p class="copyright hidden">©2024~2025 3JZ T5 INC.</p>
    <a href="../php/stage.php" class="start-button hidden" id="start-button">Start</a>

  </main>

  <!-- モーダル -->
  <div id="settings-modal" class="modal hidden">
    <div class="modal-content">
      <h2>Sound Settings</h2>
      <label>
        BGM Volume:
        <input type="range" id="bgm-volume" min="0" max="100" value="50">
      </label>
      <div>
        <button id="bgm-toggle">BGM ON or OFF</button>
      </div>
      <button id="close-modal">Close</button>
    </div>
  </div>
</body>
<script src="../js/AudioManager.js" type="module"></script>
<script src="../js/setting.js" type="module"></script>
<script type="module" src="../js/bgm-control.js"></script>
</html>
<?php
if (!file_exists('stage.php')) {
    header('Location: 404.html');
    exit;
}
?>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const mainElements = [
    document.querySelector(".game-title"),
    document.querySelector(".login-name"),
    document.querySelector(".main-image"),
  ];
  const simultaneousElements = [
    document.querySelector(".instructions"),
    document.querySelector(".copyright"),
    document.querySelector(".start-button"),
  ];


  mainElements.forEach((el, index) => {
    if (el) {
      setTimeout(() => {
        el.classList.add("fade-in");
      }, index * 500);
    }
  });

  
  const delay = mainElements.length * 500; 
  setTimeout(() => {
    simultaneousElements.forEach((el) => {
      if (el) {
        el.classList.add("fade-in");
      }
    });
  }, delay);
});


</script>