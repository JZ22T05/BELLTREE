/*-------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    //     const starsContainer = document.querySelector('.background-stars');
    //     const starCount = 5; // 星の数を設定
    //     const starsPerTwinkle = 5; // 同時に光らせる星の数
    //     const twinkleInterval = 500; // 星が点滅する間隔 (0.5秒ごと)
    //     const minDistance = 170; // 星同士の最小距離 (px)
    //     const centerAvoidSize = 540; // 中心を避ける範囲 (px)
      
    //     // 星を生成して追加
    //     for (let i = 0; i < starCount; i++) {
    //       const star = document.createElement('div');
    //       star.classList.add('star');
    //       starsContainer.appendChild(star);
    //     }
      
    //     // 星のリストを再取得
    //     const stars = document.querySelectorAll('.star');
      
    //     // 星同士が近づきすぎないように位置を決定する関数
    //     function setRandomPosition(star) {
    //       let isTooClose = true;
    //       let randomTop, randomLeft;
      
    //       while (isTooClose) {
    //         randomTop = Math.random() * window.innerHeight;
    //         randomLeft = Math.random() * window.innerWidth;
      
    //         const centerX = window.innerWidth / 2;
    //         const centerY = window.innerHeight / 2;
    //         const dxToCenter = randomLeft - centerX;
    //         const dyToCenter = randomTop - centerY;
    //         const distanceToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter);
      
    //         if (distanceToCenter < centerAvoidSize) continue;
      
    //         isTooClose = false;
    //         stars.forEach(otherStar => {
    //           if (otherStar !== star) {
    //             const dx = parseFloat(otherStar.style.left) - randomLeft;
    //             const dy = parseFloat(otherStar.style.top) - randomTop;
    //             const distance = Math.sqrt(dx * dx + dy * dy);
    //             if (distance < minDistance) {
    //               isTooClose = true;
    //             }
    //           }
    //         });
    //       }
      
    //       star.style.top = `${randomTop}px`;
    //       star.style.left = `${randomLeft}px`;
    //     }
      
    //     // ランダムなサイズを設定する関数
    //     function setRandomSize(star) {
    //       const randomSize = Math.random() * 100 + 50; // 50px ～ 150px の間でランダム
    //       star.style.width = `${randomSize}px`;
    //       star.style.height = `${randomSize}px`;
    //     }
      
    //     // 同時に複数の星を光らせる
    //     function twinkleStars() {
    //       const selectedStars = [];
      
    //       for (let i = 0; i < starsPerTwinkle; i++) {
    //         const randomIndex = Math.floor(Math.random() * stars.length);
    //         selectedStars.push(stars[randomIndex]);
    //       }
      
    //       selectedStars.forEach(star => {
    //         star.style.transition = `opacity 1s linear`; // 0.3秒でフェードイン/アウト
    //         star.style.opacity = 1; // 明るくする
      
    //         setTimeout(() => {
    //           star.style.opacity = 0; 
      
    //           // 消えた後、新しい位置とサイズを設定
    //           setTimeout(() => {
    //             setRandomPosition(star);
    //             setRandomSize(star);
    //           }, 1000);
    //         }, 1000); 
    //       });
    //     }
        /*------------------------------------------------- */
      
        // 最初の位置とサイズを設定
        stars.forEach(star => {
          setRandomPosition(star);
          setRandomSize(star);
        });
      
        // 光らせる処理開始
        setInterval(() => {
          twinkleStars();
        }, twinkleInterval);
      });
    
    
    /*-----load--------------------------------- */  
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
    