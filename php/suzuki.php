<?php
session_start();

// セッションデータの取得
$id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$name = isset($_SESSION['name']) ? $_SESSION['name'] : "ゲスト";
$stage_id = isset($_SESSION['stage_id']) ? $_SESSION['stage_id'] : 'default-stage';
$previous_path = $_SERVER['REQUEST_URI'];
$_SESSION['previous_path'] = $previous_path;
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <title>mario sample</title>
</head>

<body>
  <header class="retro-header">
    <div class="score-board">
      <?php if (!$id) { ?>
        <span class="login"><a href="../php/login.php">LOGIN</a></span>
      <?php } else { ?>
        <span class="login"><a href="../php/logout.php">LOGOUT</a></span>
      <?php } ?>
      <span class="home"><a href="../php/home.php">HOME</a></span>
      <span id="map-popup-btn" class="map-popup">MAP</span>
      <span class="ranking"><a href="../php/ranking.php">RANKING</a></span>
      <span class="setting"><a href="../html/how-to.html">HOW TO</a></span>
      <span class="setting"><a href="#" id="setting-button">SETTING</a></span>
    </div>
  </header>
  <div id="timer-display">Time: 0 s</div>
  <div id="life-display" class="life-container">
  <span id="life-text">Life:</span>
  <img src="../img/school/icon.png" alt="Life Icon">
  <img src="../img/school/icon.png" alt="Life Icon">
  <img src="../img/school/icon.png" alt="Life Icon">
</div>


  <canvas id="can"></canvas>



  <div id="popup-overlay" style="display: none;">
    <div id="life-popup">
      <span id="life-message">残りのライフ：</span>
      <div id="life-icons"></div>
    </div>
  </div>




  <div id="goal-popup" style="display: none;">ゴール！！</div>
  <!-- ゴール時のポップアップ -->
  <div id="goal-dialog" class="goal-dialog hidden">
    <div class="goal-dialog-content">
      <p>ゴールしました！おめでとうございます！</p>
      <button id="score-screen-btn">スコア画面へ</button>
    </div>
  </div>


  <div id="sidebar">

    <div id="program-area" class="program-area">
      ドラッグしてここにドロップ
    </div>
    <div id="block-palette" class="block-palette">
      <div class="block" draggable="true" data-command="1">前進</div>
      <div class="block" draggable="true" data-command="2">後退</div>
      <div class="block" draggable="true" data-command="3">ジャンプ</div>
      <div class="block" draggable="true" data-command="loop-start">[ ループ開始</div>
      <div class="block" draggable="true" data-command="loop-end">] ループ終了</div>
      <div class="block" draggable="true" data-command="if-condition">if (条件)</div>

      <div class="block" draggable="true" data-command="4">停止</div>
    </div>
  </div>

  <footer>
    <div class="footer">
      <button id="start-btn" class="footer-btn">
        <span>スタート</span>
      </button>
      <!-- <button id="stop-btn" class="footer-btn">
        <span>ストップ</span>
      </button> -->
      <button id="reset-btn" class="footer-btn">
        <span>リセット</span>
      </button>
    </div>
  </footer>

  <!-- リセットボタン押下時のモーダル -->
  <div id="reset-modal" class="modal hidden">
    <div class="modal-content">
      <p>注意！本当にリセットしますか？</p>
      <button id="confirm-reset" class="modal-btn">リセットする</button>
      <button id="cancel-reset" class="modal-btn">取り消す</button>
    </div>
  </div>



  <!-- SETTINGのモーダル -->
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

  <!-- マップモーダル -->
  <div id="map-modal" class="modal hidden">
    <div class="modal-content">
      <button id="close-map-btn" class="close-map-btn">×</button>
      <img id="map-image" src="../img/<?= $stage_id ?>.png" alt="マップ画像" class="map-image" />
    </div>
  </div>
  <?php
echo "<script>console.log('stage_id:', '{$stage_id}');</script>";
?>



  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js"></script>
  <script src="../js/AudioManager.js" type="module"></script>
<script src="../js/setting.js" type="module"></script>
  <!-- <script src="../js/mapget.js"></script> -->
  <script src="../js/save_algorithm.js"></script>
  <!-- <script src="../js/soundsMG.js"></script> -->
  <script type="module" src="../js/gamelojic.js"></script>
  <script src="../js/const.js"></script>
  <script src="../js/item.js"></script>
  <script src="../js/block.js"></script>
  <script src="../js/map/<?= $stage_id ?>.js"></script>
  <!-- <script src="../js/map.js"></script> -->
  <script src="../js/script.js"></script>
  <script src="../js/ojisan.js"></script>
  <script src="../js/cutin.js"></script>
</body>
</html>