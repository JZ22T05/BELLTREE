
<?php
session_start();

$id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$algorithm_id = isset($_GET['algorithm_id']) ? $_GET['algorithm_id'] : null;
$stage_id = isset($_SESSION['stage_id']) ? $_SESSION['stage_id'] : null;
/*------------------パス保存---------------- */
$previous_path = $_SERVER['REQUEST_URI'];
$_SESSION['previous_path'] = $previous_path;
/*------------------------------------------*/


putenv('TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin');
$dsn = 'oci:dbname=gameatp01_low;charset=utf8';
$dbuser = 'SCOTT';
$dbpass = 'fh-p*KP2&C*QV#vdh4*2';

/*-------------------------------------------------- */
$select_sql = 'SELECT 
N.SEQUENCE_NUMBER, 
NT.NODE_NAME, 
N.LOOP_COUNT
FROM 
NODE N
JOIN 
NODE_TYPE NT ON N.NODE_TYPE_ID = NT.NODE_TYPE_ID
WHERE 
N.ALGORITHM_ID = :algorithm_id
ORDER BY 
N.SEQUENCE_NUMBER ASC
';
/*-------------------------------------------------- */
$select_time_sql = 'SELECT 
SCH.CLEAR_TIME, 
U.NAME AS USER_NAME
FROM 
STAGE_CLEAR_HISTORY SCH
JOIN 
USERS U ON SCH.USER_ID = U.USER_ID
WHERE 
SCH.ALGORITHM_ID = :algorithm_id  -- ALGORITHM_IDを参照
AND SCH.STAGE_ID = (
    SELECT A.STAGE_ID 
    FROM ALGORITHM A 
    WHERE A.ALGORITHM_ID = :algorithm_id
)
ORDER BY 
SCH.CREATED_AT DESC 
FETCH FIRST 1 ROWS ONLY';
/*-------------------------------------------------- */

$algorithms = [];
$err = "";
$user_name = 'ゲスト'; // デフォルトのユーザー名
$clear_time = '---'; // デフォルトのクリアタイム

try {
  $dbh = new PDO($dsn, $dbuser, $dbpass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // アルゴリズムの情報を取得
  $stmt = $dbh->prepare($select_sql);
  $stmt->bindParam(':algorithm_id', $algorithm_id, PDO::PARAM_INT); // algorithm_id をバインド
  $stmt->execute();

  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $algorithms[] = [
        'NODE_NAME' => $row['NODE_NAME'],
        'LOOP_COUNT' => $row['LOOP_COUNT'],
        'SEQUENCE_NUMBER' => $row['SEQUENCE_NUMBER']
    ];
    
}
} catch (PDOException $e) {
  die("エラー: " . $e->getMessage());
}

/*-------------------------------------------------- */
try {
    $stmt_time = $dbh->prepare($select_time_sql);
    $stmt_time->bindParam(':algorithm_id', $algorithm_id, PDO::PARAM_INT);  // algorithm_id をバインド
    $stmt_time->execute();
    
    $result = $stmt_time->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $clear_time = $result['CLEAR_TIME'];
        $user_name = $result['USER_NAME'];
    }
} catch (PDOException $e) {
    die("エラー: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/top.css">
  <link rel="stylesheet" href="../css/how-to.css">
  <link rel="stylesheet" href="../css/algorithm.css">
  <title>algorithm</title>
</head>

<body>
<header class="retro-header">
    <div class="score-board">
    <span class="home"><a href="../php/home.php">HOME</a></span>
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
    <h2 class="algorithm-h2">player <?= htmlspecialchars($user_name) ?></h2> <!-- htmlspecialcharsでエスケープ -->
    <div class="algorithm-main">
        <div class="alogrithm">
        <p class="node">START</p>
        <?php foreach ($algorithms as $algorithm) { 
          if($algorithm['LOOP_COUNT'] != 0){?>
          <p class="node"><?= $algorithm['NODE_NAME'] ?>  x <?= $algorithm['LOOP_COUNT'] ?></p>
          <?php }else{ ?>
          <p class="node"><?= $algorithm['NODE_NAME'] ?></p>
          <?php } }?>
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
