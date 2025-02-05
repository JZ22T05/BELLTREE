<?php
/*----------------------------------------------------------------------- */
session_start();
$id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
/* --------------- $buildingId-------------*/
$buildingId = 1;
if (isset($_GET['building_id'])) {
  $buildingId = (int)$_GET['building_id'];
}
/*-----------------$stage_id-------------- */
$stage_id = isset($_SESSION['stage_id']) ? $_SESSION['stage_id'] : '01911';

/*----------------------------------------------------------------------- */

putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

$select_sql = '
   SELECT 
    SCH.USER_ID,
    U.NAME AS USER_NAME,
    SCH.CLEAR_TIME,
    SCH.STAGE_ID,
    SCH.ALGORITHM_ID,
    RANK() OVER (PARTITION BY SCH.STAGE_ID ORDER BY SCH.CLEAR_TIME ASC) AS RANKING
FROM 
    STAGE_CLEAR_HISTORY SCH
JOIN 
    USERS U ON SCH.USER_ID = U.USER_ID
WHERE 
    SCH.STAGE_ID = :stage_id
ORDER BY 
    RANKING ASC
';

$user_select_sql = '
   SELECT 
    SCH.USER_ID,
    U.NAME AS USER_NAME,
    SCH.CLEAR_TIME,
    SCH.STAGE_ID,
    SCH.ALGORITHM_ID,
    RANK() OVER (PARTITION BY SCH.STAGE_ID ORDER BY SCH.CLEAR_TIME ASC) AS RANKING
FROM 
    STAGE_CLEAR_HISTORY SCH
JOIN 
    USERS U ON SCH.USER_ID = U.USER_ID
WHERE 
    SCH.STAGE_ID = :stage_id AND SCH.USER_ID = :user_id
ORDER BY 
    RANKING ASC
';

$scores = [];
$err = "";

try {
  $dbh = new PDO($dsn, $dbuser, $dbpass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  /*---------------------セッションの stage_id から stage_name を取得---------------------*/
  if (!empty($stage_id)) {
    $get_stage_name_sql = '
    SELECT STAGE_NAME 
    FROM STAGE 
    WHERE STAGE_ID = :stage_id
    ';

    try {
      $stmt_stage_name_sql = $dbh->prepare($get_stage_name_sql);
      $stmt_stage_name_sql->bindParam(':stage_id', $stage_id, PDO::PARAM_STR);
      $stmt_stage_name_sql->execute();
      $result = $stmt_stage_name_sql->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        $stage_name = $result['STAGE_NAME']; // stage_name を取得
      } else {
        $stage_name = '不明なステージ'; // 該当なしの場合のデフォルト値
      }
    } catch (PDOException $e) {
      die("エラー: " . $e->getMessage());
    }
  }

  /*----------------------stage_name があるなら--------------------------------*/
  if (isset($_GET['stage_name'])) {
    $selected_stage_name = $_GET['stage_name'];
    $get_stage_id_sql = '
    SELECT STAGE_ID 
    FROM STAGE 
    WHERE STAGE_NAME = :stage_name
    ';

    try {
      $stmt = $dbh->prepare($get_stage_id_sql);
      $stmt->bindParam(':stage_name', $selected_stage_name, PDO::PARAM_STR);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        $stage_id = $result['STAGE_ID'];
      }
    } catch (PDOException $e) {
      die("エラー: " . $e->getMessage());
    }
  }
  /*----------------------------------------------------------------------- */
  if (isset($_GET['ranking']) && $_GET['ranking'] === 'user' && $id) {
    $stmt = $dbh->prepare($user_select_sql);
    $stmt->bindParam(':stage_id', $stage_id, PDO::PARAM_STR);
    $stmt->bindParam(':user_id', $id, PDO::PARAM_INT);
  } else {
    $stmt = $dbh->prepare($select_sql);
    $stmt->bindParam(':stage_id', $stage_id, PDO::PARAM_STR);
  }
  $stmt->execute();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $scores[] = [
      'USER_ID' => $row['USER_ID'],
      'NAME' => $row['USER_NAME'],
      'CLEAR_TIME' => $row['CLEAR_TIME'],
      'RANKING' => $row['RANKING'],
      'ALGORITHM_ID' => $row['ALGORITHM_ID']
    ];
  }
} catch (PDOException $e) {
  die("エラー: " . $e->getMessage());
}

/*---------------------プルダウン用-------------------------------------- */
$stage_names = [];
if ($buildingId) {
  $stage_sql = '
    SELECT STAGE_NAME
    FROM STAGE 
    WHERE BUILDING_NUMBER = :building_id
    ORDER BY BUILDING_NUMBER asc
    ';

  try {
    $stage_stmt = $dbh->prepare($stage_sql);
    $stage_stmt->bindParam(':building_id', $buildingId, PDO::PARAM_INT);
    $stage_stmt->execute();

    while ($row = $stage_stmt->fetch(PDO::FETCH_ASSOC)) {
      $stage_names[] = $row['STAGE_NAME'];
    }
  } catch (PDOException $e) {
    die("エラー: " . $e->getMessage());
  }
}
/*----------------------------------------------------------------------- */
// // $stage_name = '';
if (isset($_GET['stage_name'])) {
  $stage_name = $_GET['stage_name'];
}
// //  else {
// //   $stage_name = '1911';
// // }
?>



<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/top.css">
  <link rel="stylesheet" href="../css/how-to.css">
  <link rel="stylesheet" href="../css/rank.css">

  <!-- <script src="./js/main-img.js" defer></script> -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js"></script>
  <script src="../js/animation.js" defer></script>
  <title>ranking</title>
  <style>
    .left-side.active {
      color: red;
      background: #fff;
    }
  </style>
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
      <span class="home"><a href="../php/home.php">HOME</a></span>
      <span class="ranking"><a href="../php/ranking.php">RANKING</a></span>
    </div>
  </header>
  <main>
    <div class="main">
      <div class="left">
        <a href="ranking.php?building_id=1" class="left-side" id="top-margin">本館</a>
        <a href="ranking.php?building_id=2" class="left-side">２号館</a>
        <a href="ranking.php?building_id=3" class="left-side">３号館</a>
        <a href="ranking.php?building_id=4" class="left-side">４号館</a>
        <a href="ranking.php?building_id=5" class="left-side">５号館</a>
        <a href="ranking.php?building_id=6" class="left-side">６号館</a>
        <a href="ranking.php?building_id=7" class="left-side">７号館</a>
        <a href="ranking.php?building_id=8" class="left-side">８号館</a>
        <a href="ranking.php?building_id=9" class="left-side">９号館</a>
        <a href="ranking.php?building_id=10" class="left-side">１０号館</a>
        <a href="ranking.php?building_id=11" class="left-side">１１号館</a>
        <a href="ranking.php?building_id=12" class="left-side">１２号館</a>
        <a href="ranking.php?building_id=13" class="left-side">１３号館</a>
      </div>
      <!-- center -->
      <div class="center">
        <h2>RANKING</h2>
        <p class="stage_name">~<?= htmlspecialchars($stage_name, ENT_QUOTES, 'UTF-8') ?>~</p>
        <!-- <div class="rank-switch">
          <button onclick="switchRanking('all')" class="switch-btn">全体ランキング</button>
          <button onclick="switchRanking('user')" class="switch-btn">自分のランキング</button>
        </div> -->
        <div class="rank-main">
          <div class="rank-img">
            <figure class="rank1-img"><img src="../img/rank-reef.png" alt=""></figure>
            <figure class="rank2-img"><img src="../img/torofi-.png" alt=""></figure>
            <figure class="rank3-img"><img src="../img/rank-reef2.png" alt=""></figure>
          </div>
          <?php if (!empty($scores)) { ?>
            <div class="rank-dai">
              <?php if (isset($scores[1])) { ?>
                <a href="./algorithm.php?algorithm_id=<?= isset($scores[1]['ALGORITHM_ID']) ? $scores[1]['ALGORITHM_ID'] : '#' ?>" class="dai2">
                  <p class="rank2"><?= $scores[1]['RANKING'] ?></p>
                  <p class="name2 name"><?= $scores[1]['NAME'] ?></p>
                  <p class="score2"><?= $scores[1]['CLEAR_TIME'] ?></p>
                </a>
              <?php } else { ?>
                <p class="name">データがありません</p>
              <?php } ?>

              <?php if (isset($scores[0])) { ?>
                <a href="./algorithm.php?algorithm_id=<?= isset($scores[0]['ALGORITHM_ID']) ? $scores[0]['ALGORITHM_ID'] : '#' ?>" class="dai1">
                  <p class="rank1"><?= $scores[0]['RANKING'] ?></p>
                  <p class="name1 name"><?= $scores[0]['NAME'] ?></p>
                  <p class="score1"><?= $scores[0]['CLEAR_TIME'] ?></p>
                </a>
              <?php } else { ?>
                <p class="name">データがありません</p>
              <?php } ?>

              <?php if (isset($scores[2])) { ?>
                <a href="./algorithm.php?algorithm_id=<?= isset($scores[2]['ALGORITHM_ID']) ? $scores[2]['ALGORITHM_ID'] : '#' ?>" class="dai3">
                  <p class="rank3"><?= $scores[2]['RANKING'] ?></p>
                  <p class="name3 name"><?= $scores[2]['NAME'] ?></p>
                  <p class="score3"><?= $scores[2]['CLEAR_TIME'] ?></p>
                </a>
              <?php } else { ?>
                <p class="name">データがありません</p>
              <?php } ?>
            </div>
          <?php } else { ?>
            <p class="no-rank">ランキングデータは存在しません。</p>
          <?php } ?>
        </div>
      </div>
      <!-- right -->

      <div id="rank4-9" class="rank4-9 right">
        <?php
        $i = 1;
        foreach ($scores as $index => $score) {

          if ($i >= 4 && $i <= 9) {
        ?>
            <a href="./algorithm.php?algorithm_id=<?= urlencode($score['ALGORITHM_ID']) ?>" class="rank">
              <p class="rank-rank"><?= htmlspecialchars($score['RANKING'], ENT_QUOTES, 'UTF-8')  ?> 位</p>
              <p class="rank-name"><?= htmlspecialchars($score['NAME'], ENT_QUOTES, 'UTF-8')  ?></p>
              <p class="rank-score"><?= htmlspecialchars($score['CLEAR_TIME'], ENT_QUOTES, 'UTF-8') ?></p>
            </a>
        <?php }
          $i++;
        } ?>

      </div>
    </div>

    <footer>
      <div class="how-to-select">
        <form>
          <select required id="pulldown" onchange="redirectToStage()">
            <option value="" hidden>選択してください</option>
            <?php foreach ($stage_names as $stage_name): ?>
              <option value="<?= htmlspecialchars($stage_name, ENT_QUOTES, 'UTF-8') ?>">
                <?= htmlspecialchars($stage_name, ENT_QUOTES, 'UTF-8') ?>
              </option>
            <?php endforeach; ?>
          </select>
          <select id="ranking-switch" onchange="switchRankingOption()">
            <option value="all" <?= isset($_GET['ranking']) && $_GET['ranking'] === 'all' ? 'selected' : '' ?>>全体ランキング</option>
            <option value="user" <?= isset($_GET['ranking']) && $_GET['ranking'] === 'user' ? 'selected' : '' ?>>自分のランキング</option>
          </select>
        </form>
        <a class="how-to-btn" href="../php/go_back.php">戻る</a>

      </div>
    </footer>
  </main>
</body>

</html>
<script>
  window.addEventListener('load', function() {
    document.querySelector('.rank-main').classList.add('loaded');
  });

  function redirectToStage() {
    const selectElement = document.getElementById('pulldown');
    const selectedValue = selectElement.value;
    if (selectedValue) {
      window.location.href = `./ranking.php?stage_name=${encodeURIComponent(selectedValue)}`;
    }
    // 現在のURLを取得
    const currentUrl = window.location.href;

    // 全てのリンクを取得
    const links = document.querySelectorAll('.left-side');

    // 現在のURLに一致するリンクにクラスを追加
    links.forEach(link => {
      // 現在のURLとリンクのhrefを厳密に比較
      if (link.href === currentUrl) {
        link.classList.add('active');
      }
    });
  }

  function switchRanking(type) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('ranking', type);
    window.location.search = urlParams.toString();
  }

  function switchRankingOption() {
    const rankingSelect = document.getElementById('ranking-switch');
    const selectedRanking = rankingSelect.value;
    switchRanking(selectedRanking);
  }
</script>