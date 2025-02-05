 // 残機の数を設定
 let lifeCount = 3; // 残機の数
 const stageName = 'Stage 1-1'; // ステージ名

 // 残機を表示する関数
 function displayLives() {
   const livesContainer = document.getElementById('lives');
   livesContainer.innerHTML = ''; // 一旦クリア

   // 残機の数だけアイコンを表示
   for (let i = 0; i < lifeCount; i++) {
     const lifeIcon = document.createElement('img');
     lifeIcon.src = './img/Mrszuki.png'; // 使用する残機アイコン画像
     lifeIcon.alt = '残機';
     livesContainer.appendChild(lifeIcon);
   }
 }

 // ロード画面を表示する関数
 function showLoadingScreen() {
   const loadingScreen = document.getElementById('loadingScreen');
   const stageNameElement = document.getElementById('stageName');
   
   // ステージ名を設定
   stageNameElement.textContent = stageName;

   // 残機を表示
   displayLives();

   // ロード画面を表示
   loadingScreen.style.display = 'flex';

   // 2秒後にロード画面を非表示にして次のページへ遷移（デモ用）
   setTimeout(function() {
     loadingScreen.style.display = 'none';
     window.location.href = './index.html'; // 次の画面へ遷移
   }, 2000); // 2秒の遅延
 }

 // ページ読み込み時にロード画面を表示
 window.onload = showLoadingScreen;