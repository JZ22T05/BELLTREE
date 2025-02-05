<?php
session_start();

$id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$build_id = $_SESSION['id'] ?? '不明';
$img = $_SESSION['img'] ?? '../img/school/1.jpg'; // デフォルト画像パス
/*------------------パス保存---------------- */
$previous_path = $_SERVER['REQUEST_URI'];
$_SESSION['previous_path'] = $previous_path;
/*------------------------------------------*/
if ($build_id === '不明') {
  echo "セッションIDが取得できませんでした。<br>";
}

// データベース接続設定
putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

$stages = [];
$err = "";

// データベースからステージ情報を取得
try {
  $dbh = new PDO($dsn, $dbuser, $dbpass);

  $query = 'SELECT * FROM stage WHERE BUILDING_NUMBER = :id';
  $stmt = $dbh->prepare($query);
  $stmt->bindValue(':id', $build_id, PDO::PARAM_STR);
  $stmt->execute();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $floor = $row['FLOOR_NUMBER'];
    $stages[$floor][] = [

      'BUILDING_NUMBER' => $row['BUILDING_NUMBER'],
      'STAGE_ID' => $row['STAGE_ID'],
      'STAGE_NAME' => $row['STAGE_NAME'],
      'DESCRIPTION' => $row['DESCRIPTION'],
    ];
  }

  krsort($stages); // 階層を降順に並べ替え
  $stmt = null;
  $dbh = null;
} catch (PDOException $e) {
  $err = $e->getMessage();
  echo "エラー: " . $err . "<br>";
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Building Layout</title>
  <link rel="stylesheet" href="../css/building.css">
</head>

<body>
  <header class="retro-header">
    <div class="score-board">
      <?php if (!$id) { ?>
        <span class="login"><a href="/game/php/login.php">LOGIN</a></span>
      <?php } else { ?>
        <span class="login"><a href="/game/php/logout.php">LOGOUT</a></span>
      <?php } ?>
      <span class="home"><a href="/game/php/home.php">HOME</a></span>
      <span class="ranking"><a href="/game/php/ranking.php">RANKING</a></span>
      <span class="setting"><a href="#" id="setting-button">SETTING</a></span>
    </div>
  </header>

  <main class="container">
    <div class="building-image">
      <img src="<?= htmlspecialchars($img, ENT_QUOTES, 'UTF-8'); ?>" alt="Main Building">
    </div>
    <div class="column">
      <?php if ($build_id == 1) { ?>
        <div class="goukan-name">本館</div>
      <?php } else { ?>
        <div class="goukan-name"><?= $build_id ?>号館</div>
      <?php } ?>
      <div class="scroll">
        <?php if (!empty($stages)) : ?>
          <?php foreach ($stages as $floor => $floorStages) : ?>
            <div class="kaisuu">
              <h2>
                <?= ($floor > 0) ? "{$floor}F" : (($floor == 0) ? "地下1F" : "地下" . abs($floor) . "F");?>
              </h2>
              <div class="kyousitu">
                <?php foreach ($floorStages as $stage) : ?>
                  <p>
                    <a href="../php/suzuki.php"
                      class="stage-link"
                      data-stage-id="<?= htmlspecialchars($stage['STAGE_ID'], ENT_QUOTES, 'UTF-8'); ?>">
                      <?= htmlspecialchars($stage['STAGE_NAME'], ENT_QUOTES, 'UTF-8'); ?>
                    </a>
                  </p>
                <?php endforeach; ?>
              </div> 
            </div>
          <?php endforeach; ?>
         
        <?php else : ?>
          <p>ステージ情報がありません。</p>
        <?php endif; ?>

      </div>
    </div>
    <!-- モーダル -->
    <div id="settings-modal" class="modal hidden">
      <div class="modal-content">
        <h2>Sound Settings</h2>
        <label>
          BGM Volume:
          <input type="range" id="bgm-volume" min="0" max="100" value="50">
        </label>
        <div>
          <button id="bgm-toggle">BGM OFF</button>
        </div>
        <button id="close-modal">Close</button>
      </div>
    </div>
    <footer>
      <div class="footer">
        <div class="copyright">©2024~2025 3JZ T5 INC.</div>
      </div>
    </footer>
  </main>
</body>
<script type="module" src="../js/AudioManager.js"></script>
<script type="module" src="../js/setting.js"></script>
<script type="module" src="../js/stagedl.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".stage-link").forEach((link) => {
    const stageId = link.dataset.stageId;
    const scriptPath = `../js/map/${stageId}.js`;

    fetch(scriptPath, { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          link.classList.add("disabled-stage"); // クラスを追加
        }
      })
      .catch(() => {
        link.classList.add("disabled-stage"); // エラー時も追加
      });
  });
});

</script>
</html>