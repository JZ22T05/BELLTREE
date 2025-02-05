var duration = 1.8 * 1000;
var animationEnd = Date.now() + duration;
var defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

var interval = setInterval(function() {
  var timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  var particleCount = 50 * (timeLeft / duration);
  // since particles fall down, start a bit higher than random
  confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
  confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
}, 350);


/*------------------------------------- */



setTimeout(function() {
    var duration = 10 * 1000; 
    var animationEnd = Date.now() + duration; 
    var skew = 1; 

    // ランダムな範囲の数値を返す関数
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min; 
    }

    function getRandomColor() {
      var colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', '#1ABC9C', '#E74C3C']; // カラフルな色の配列
      return colors[Math.floor(Math.random() * colors.length)]; 
    }

    (function frame() {
      var timeLeft = animationEnd - Date.now(); // 残り時間を計算
      var ticks = Math.max(100, 100 * (timeLeft / duration)); // 残り時間に比例してtick数を変更
      skew = Math.max(0.8, skew - 100); // スキューを減少させる

      confetti({
        particleCount: 1, 
        startVelocity: 0, 
        ticks: ticks, 
        origin: {
          x: Math.random(), 
          y: (Math.random() * 0.9) - 0.2 
        },
        colors: [getRandomColor()], 
        shapes: ['square'], 
        gravity: randomInRange(0.4, 0.6), // 重力をランダムに設定
        scalar: randomInRange(1.2, 1), // パーティクルのスケールをランダムに設定
        drift: randomInRange(-0.4, 0.4) // パーティクルのドリフトをランダムに設定
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })(); 
}, 1 * 1000); // 1秒後に実行

function redirectToSelectedId() {
  const selectElement = document.getElementById('pulldown');
  const selectedId = selectElement.value;

  if (selectedId) {
      // 選択された値を使ってリダイレクト
      window.location.href = `/game/php/ranking.php?building_id=${encodeURIComponent(selectedId)}`;
  }
}
