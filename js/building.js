document.addEventListener('DOMContentLoaded', () => {
    // アニメーション付きのpタグ表示・非表示
    function slideDown(element) {
      element.style.display = 'block';
      element.style.height = 'auto';
      element.style.opacity = '1';
      let height = element.scrollHeight + 'px';
      element.style.height = '0';
      setTimeout(() => {
        element.style.height = height;
        element.style.transition = 'height 0.5s ease, opacity 0.5s ease';
      }, 0);
    }

    function slideUp(element) {
      element.style.height = element.scrollHeight + 'px';
      setTimeout(() => {
        element.style.height = '0';
        element.style.opacity = '0';
        element.style.transition = 'height 0.5s ease, opacity 0.5s ease';
      }, 0);
      element.addEventListener('transitionend', () => {
        element.style.display = 'none';
      }, { once: true });
    }

    // h2クリックイベント
    document.querySelectorAll('h2').forEach(h2 => {
      h2.addEventListener('click', () => {
        let nextElement = h2.nextElementSibling;
        while (nextElement && nextElement.tagName === 'P') {
          if (nextElement.style.display === 'block') {
            slideUp(nextElement);
          } else {
            slideDown(nextElement);
          }
          nextElement = nextElement.nextElementSibling;
        }
      });
    });

    // ロード画面の処理
    const suzukiLink = document.getElementById('suzuki-link');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingBar = document.getElementById('loading-bar');

    suzukiLink.addEventListener('click', (event) => {
      event.preventDefault();
      loadingOverlay.style.display = 'flex';
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        loadingBar.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
          // window.location.href = './suzuki.html';
          window.location.href = '/game/php/suzuki.php';

        }
      }, 200);
    });

    // 順番表示アニメーション
    const elements = document.querySelectorAll('.title, .subtitle, .main-img, .start-bt');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 500);
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll(
      ' .title,  .subtitle,  .main-img,  .start-bt'
    );
  
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible'); // 順番にvisibleクラスを追加
      }, index * 500); 
    });
  });


  document.addEventListener("DOMContentLoaded", () => {
    const bossFloor = document.getElementById("boss-floor");
    const bossRoom = document.getElementById("boss-room");
    const body = document.body;
  
    // ステージクリア状態をシミュレーション（実際のクリア状況はロジックに基づいて設定）
    const stagesCleared = 8; // 全8ステージがクリアされた状態
    const totalStages = 8;
  
    if (stagesCleared === totalStages) {
      // 隠しステージを表示
      bossFloor.style.display = "block";
      bossRoom.style.display = "block";
  
      // 背景の危機感演出
      body.classList.add("hidden-stage-active");
  
      // 警告テキストの追加
      const warningText = document.createElement("div");
      warningText.classList.add("warning-text");
      warningText.textContent = "警告: 最終ステージが解放されました";
      document.querySelector("main").prepend(warningText);
  
      // 不穏なBGMに変更
      const bossBGM = new Audio("../sounds/boss_theme.mp3");
      bossBGM.loop = true;
      bossBGM.volume = 0.5;
      bossBGM.play().catch((err) => console.log("BGM再生エラー:", err));
    }
  });
  