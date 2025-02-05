



//stageid保存
document.addEventListener("DOMContentLoaded", () => {
  const stageLinks = document.querySelectorAll(".stage-link");

  stageLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // デフォルトのリンク動作を停止
      const stageId = link.dataset.stageId; // data-stage-idからSTAGE_IDを取得

      console.log("送信するSTAGE_ID:", stageId); // デバッグ用

      // サーバーにSTAGE_IDを送信
      fetch("/game/php/set_stage_id.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage_id: stageId }), // JSON形式で送信
      })
        .then(response => response.json())
        .then(data => {
          console.log("セッション保存応答:", data); // デバッグ用

          if (data.success) {
            // 成功した場合リンク先に遷移
            window.location.href = link.href;
          } else {
            alert("セッション保存に失敗しました: " + data.message);
          }
        })
        .catch(error => {
          console.error("エラー:", error);
          alert("セッション保存中にエラーが発生しました。");
        });
    });
  });
});



// //----------------------------------------BGM----------------------------------------




document.addEventListener('DOMContentLoaded', () => {
  // ステージ詳細画面のBGM
  const detailBgmFilePath = '../sounds/song05.wav';

  // 保存されたBGM設定を復元
  const savedBgmVolume = localStorage.getItem('bgmVolume');
  const savedBgmEnabled = localStorage.getItem('bgmEnabled');

  if (savedBgmVolume !== null) {
    audioManager.setBGMVolume(parseFloat(savedBgmVolume));
  }

  if (savedBgmEnabled !== null) {
    audioManager.bgmEnabled = savedBgmEnabled === 'true';
  }

  // 新しいBGMを再生
  if (audioManager.bgmEnabled) {
    audioManager.playBGM(detailBgmFilePath);
  }

  // 現在再生中のBGMを保存
  localStorage.setItem('currentBgm', detailBgmFilePath);
});














// document.addEventListener("DOMContentLoaded", () => {
//   const bgmAudio = new Audio("../sounds/iwashiro_sendousuru_otoko.mp3"); // 同じBGM
//   bgmAudio.loop = true;

//   // ローカルストレージから音量と再生状態を取得
//   const savedVolume = parseFloat(localStorage.getItem("bgmVolume")) || 0.2;
//   const savedCurrentTime = parseFloat(localStorage.getItem("bgmCurrentTime")) || 0;
//   const bgmEnabled = localStorage.getItem("bgmEnabled") !== "false"; // デフォルトはtrue

//   bgmAudio.volume = savedVolume;
//   bgmAudio.currentTime = savedCurrentTime;

//   if (bgmEnabled) {
//       bgmAudio.play().catch(() => {
//           console.log("BGMの自動再生がブロックされました");
//       });
//   }

//   const settingButton = document.getElementById("setting-button");
//     const settingsModal = document.getElementById("settings-modal");
//     const closeModalButton = document.getElementById("close-modal");
//     const bgmVolumeSlider = document.getElementById("bgm-volume");
//     const bgmToggleButton = document.getElementById("bgm-toggle");

//     // 音量スライダーの初期値設定
//     bgmVolumeSlider.value = savedVolume * 100;

//     // モーダルを開く
//     settingButton.addEventListener("click", (event) => {
//         event.preventDefault();
//         settingsModal.classList.remove("hidden");
//     });

//     // モーダルを閉じる
//     closeModalButton.addEventListener("click", () => {
//         settingsModal.classList.add("hidden");
//     });

//     // 音量調整
//     bgmVolumeSlider.addEventListener("input", (event) => {
//         const volume = event.target.value / 100;
//         bgmAudio.volume = volume;
//         localStorage.setItem("bgmVolume", volume); // 音量を保存
//     });

//     // BGMのオン/オフ切り替え
//     bgmToggleButton.addEventListener("click", () => {
//         if (bgmAudio.paused) {
//             bgmAudio.play().catch(() => {
//                 console.log("BGM再生に失敗しました。ユーザー操作が必要です。");
//             });
//             bgmToggleButton.textContent = "BGM OFF";
//             localStorage.setItem("bgmEnabled", "true"); // BGMをオン
//         } else {
//             bgmAudio.pause();
//             bgmToggleButton.textContent = "BGM ON";
//             localStorage.setItem("bgmEnabled", "false"); // BGMをオフ
//         }
//     });

//   // ページ離脱時に再生状態を保存
//   window.addEventListener("beforeunload", () => {
//       localStorage.setItem("bgmCurrentTime", bgmAudio.currentTime);
//       localStorage.setItem("bgmPlaying", !bgmAudio.paused);
//       bgmAudio.pause();
//   });
// });