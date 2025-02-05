<?php
session_start();

$id = $_SESSION['user_id'] ?? null;
$algorithm_id = $_SESSION['algorithm_id'] ?? null;
$stage_id = $_SESSION['stage_id'] ?? null;

$node_data = $_SESSION['node_data'] ?? [];
$clear_time = $_SESSION['clear_time'] ?? '--:--';
$user_name = $_SESSION['name'] ?? 'ゲスト'; // user_nameのuser_を消した1/27
putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

$select_sql =  '
SELECT STAGE_NAME 
FROM STAGE 
WHERE STAGE_ID = :stage_id
';
$err = "";
try {
  $dbh = new PDO($dsn, $dbuser, $dbpass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $select_sql = $dbh->prepare($select_sql);  
    $select_sql->bindParam(':stage_id', $stage_id, PDO::PARAM_STR);
    $select_sql->execute();
    $result = $select_sql->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $stage_name = $result['STAGE_NAME']; 
    } else {
        $stage_name = '不明なステージ'; 
    }
  } catch (PDOException $e) {
    die("エラー: " . $e->getMessage());
  }
$nodeTypeMapping = [
  1 => "前進",
  2 => "後進",
  3 => "ジャンプ",
  4 => "停止",
  5 => "ループ終了",
  6 => "if文開始",
  7 => "if文終了",
  8 => "ELSE",
  9 => "ループ開始",
];
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/top.css">
  <link rel="stylesheet" href="../css/how-to.css">
  <link rel="stylesheet" href="../css/algorithm.css">
  <title>Score</title>
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
      <span class="ranking"><a href="../php/ranking.php">RANKING</a></span>
      <span class="setting"><a href="#" id="setting-button">SETTING</a></span>
    </div>
  </header>
  <main>
    <h2 class="algorithm-h2">player <?= htmlspecialchars($user_name) ?></h2> <!-- htmlspecialcharsでエスケープ -->
    <div class="algorithm-main">
        <div class="alogrithm">
        <p class="node">START</p>
        <?php foreach ($node_data as $node) {
          $nodeName = $nodeTypeMapping[$node['nodeTypeId']] ?? "不明";
        ?>
          <p class="node">
            <?= htmlspecialchars($node['sequenceNumber']) ?>: <?= htmlspecialchars($nodeName) ?>
            <?= $node['loopCount'] > 0 ? 'x ' . htmlspecialchars($node['loopCount']) : '' ?>
          </p>
        <?php } ?>
        <p class="node">END</p>
        </div>
        
        <div class="main-score">
        <div class="score-main">
          <div class="score-img-suzuki "><img src="../img/Big-suzuki.png" alt=""></div>
            <div class="score-width">
            <div class="score-date">
              <p class="time-title">TIME</p>
              <p><?= htmlspecialchars($clear_time) ?> 秒</p> <!-- htmlspecialcharsでエスケープ -->
          </div>
          
            </div>
            <div class="score-img-torofi-">
              <img src="../img/torofi-.png" alt="">
            </div>
          </div>

        </div>
    </div>
  
      <footer class="score_footer">
      <div class="footer">
        <div class="copyright">©2024~2025 3JZ T5 INC.</div>
      </div>
    </footer>
  </main>
</body>

</html>