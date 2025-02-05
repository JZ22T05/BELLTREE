<?php
session_start();
$id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$name = isset($_SESSION['name']) ? $_SESSION['name'] : "ゲスト";
/*------------------パス保存---------------- */
$previous_path = $_SERVER['REQUEST_URI'];
$_SESSION['previous_path'] = $previous_path;
/*------------------------------------------*/
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module" src="../js/stageselect.js"></script>
  <title>Stage Select</title>
  <link rel="stylesheet" href="../css/retro.css">
  <link rel="stylesheet" href="../css/stage2.css">
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
      <span class="setting"><a href="#" id="setting-button">SETTING</a></span>
    </div>
  </header>

  <div class="map-container">
    <div class="stage-name show-info" id="stage-name">
      <p></p>
    </div>
    <div class="imageMap">
      <map name="image-map">
        <img src="../img/map.png" usemap="#image-map">
        <area target="" alt="1" title="1" href="./set_session.php?id=1&amp;info=難易度:★☆☆☆☆&amp;img=../img/school/1.jpg" coords="552,391,494,340" shape="rect" class="stage-point" data-name="本館" data-info="難易度:★☆☆☆☆" data-img="../img/school/1.jpg" data-desc="AI／情報処理 ／ネットワーク・セキュリティ分野学科がなど、多くの学科が使用していて、保健室やキャリアセンター、自由に使えるオープンスペースなどがあります。">
        <area target="" alt="2" title="2" href="./set_session.php?id=2&amp;info=難易度:★★★★☆&amp;img=../img/school/2.png" coords="544,314,571,335" shape="rect" class="stage-point" data-name="2号館" data-info="難易度:★☆☆☆☆" data-img="../img/school/2.png" data-desc="AI／情報処理分野の生徒が使用しています。">
        <area target="" alt="3" title="3" href="./set_session.php?id=3&amp;info=難易度:★★☆☆☆&amp;img=../img/school/3.png" coords="519,408,541,429" shape="rect" class="stage-point" data-name="3号館" data-info="難易度:★★☆☆☆" data-img="../img/school/3.png" data-desc="CG・映像／ゲーム／情報処理分野の生徒が使用しています。">
        <area target="" alt="4" title="4" href="./set_session.php?id=4&amp;info=難易度:★★☆☆☆&amp;img=../img/school/4.png" coords="557,369,580,393" shape="rect" class="stage-point" data-name="4号館" data-info="難易度:★★☆☆☆" data-img="../img/school/4.png" data-desc="主にゲーム分野の生徒が使用しています。">
        <area target="" alt="5" title="5" href="./set_session.php?id=5&amp;info=難易度:★★★★☆&amp;img=../img/school/5.jpg" coords="629,241,657,269" shape="rect" class="stage-point" data-name="5号館" data-info="難易度:★★★★☆" data-img="../img/school/5.jpg" data-desc="主にCG・映像分野ほかがしようしています。VFXラボがあります。">
        <area target="" alt="6" title="6" href="./set_session.php?id=6&amp;info=難易度:★★★★☆&amp;img=../img/school/6.png" coords="500,294,528,324" shape="rect" class="stage-point" data-name="6号館" data-info="難易度:★★★★☆" data-img="../img/school/6.png" data-desc="CG・映像／アニメ／デザイン分野の生徒が使用しています">
        <area target="" alt="7" title="7" href="./set_session.php?id=7&amp;info=難易度:★★★★★&amp;img=../img/school/7.jpg" coords="615,80,656,121" shape="rect" class="stage-point" data-name="7号館" data-info="難易度:★★★☆☆" data-img="../img/school/7.jpg" data-desc="CG・映像／ゲーム／アニメ／デザイン／Web・モバイル／情報処理／電子分野の生徒が使用しています。モーションキャプチャールームやデジタルぺンタブレット
            ワークステーションもあり、学園祭でつかわれる号館の一つでもあります。">
        <area target="" alt="8" title="8" href="./set_session.php?id=8&amp;info=難易度:★★★☆☆&amp;img=../img/school/8.png" coords="393,265,426,297" shape="rect" class="stage-point" data-name="8号館" data-info="難易度:★☆☆☆☆" data-img="../img/school/8.png" data-desc="ゲーム／情報処理／ネットワーク・セキュリティ分野の生徒が使用しています。高度情報処理科は841を主に使用しています。">
        <area target="" alt="9" title="9" href="./set_session.php?id=9&amp;info=難易度:★★★★☆&amp;img=../img/school/9.png" coords="585,302,607,342" shape="rect" class="stage-point" data-name="9号館" data-info="難易度:★☆☆☆☆" data-img="../img/school/9.png" data-desc="CG・映像分野／ゲーム分野の生徒が使用しています。メディアセンターとも呼ばれており、資格を受ける時や学園祭での飲食系出店メイン会場として使用されています。">
        <area target="" alt="10" title="10" href="./set_session.php?id=10&amp;info=難易度:★★★☆☆&amp;img=../img/school/10.png" coords="610,324,638,349" shape="rect" class="stage-point" data-name="10号館" data-info="難易度:★☆☆☆☆" data-img="../img/school/10.png" data-desc="主に電気分野の生徒が使用しています。">
        <area target="" alt="11" title="11" href="./set_session.php?id=11&amp;info=難易度:★★★★☆&amp;img=../img/school/11.png" coords="774,369,802,401" shape="rect" class="stage-point" data-name="11号館" data-info="難易度:★★★★★" data-img="../img/school/11.png" data-desc="主に電気分野の生徒が使用しています。">
        <area target="" alt="12" title="12" href="./set_session.php?id=12&amp;info=難易度:★★★★☆&amp;img=../img/school/12.png" coords="313,454,348,486" shape="rect" class="stage-point" data-name="12号館" data-info="難易度:★★★★★" data-img="../img/school/12.png" data-desc="アニメ／情報処理分野の生徒が使用しています。高度情報処理科は1241、1242を主に使用しています。">
        <area target="" alt="13" title="13" href="./set_session.php?id=12&amp;info=難易度:★★★★☆&amp;img=../img/school/12.png" coords="610,324,638,349" shape="rect" class="stage-point" data-name="13号館" data-info="難易度:★★★★★" data-img="../img/school/13.png" data-desc="アニメ／情報処理分野の生徒が使用しています。高度情報処理科は1241、1242を主に使用しています。">
      </map>
    </div>
    <div id="map-info" class="map-info show-info">
      <div class="stage-info show-info" id="stage-info"></div>
      <img id="stage-image" class="show-info" src="" alt="" style="display: none; max-width: 100%; height: auto;">
      <div id="stage-description" class="show-info" style="display: none;"></div>
    </div>
  </div>
  <footer>
    <div class="footer">
      <p class="copyright">©2024~2025 3JZ T5 INC.</p>
    </div>
  </footer>
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
<script type="module" src="../js/AudioManager.js"></script>
<script type="module" src="../js/setting.js"></script>

</html>