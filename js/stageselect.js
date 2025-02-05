import { audioManager } from './AudioManager.js';
document.addEventListener('DOMContentLoaded', () => {
  const stagePoints = document.querySelectorAll('.stage-point');
  const stageNameElem = document.getElementById('stage-name');
  const stageInfoElem = document.getElementById('stage-info');
  const mapInfoElem = document.getElementById('map-info');
  const stageImageElem = document.getElementById('stage-image');
  const stageDescElem = document.getElementById('stage-description');

  let lastStageName = '???';
  let lastStageInfo = '難易度:?????';
  let lastStageImage = '';
  let lastStageDesc = '';
  stageNameElem.textContent = lastStageName;
  stageInfoElem.textContent = lastStageInfo;
  stageImageElem.src = lastStageImage;
  stageDescElem.textContent = lastStageDesc;

  stagePoints.forEach(point => {
    point.addEventListener('mouseover', () => {
      const stageName = point.getAttribute('data-name');
      const stageInfo = point.getAttribute('data-info');
      const stageImageSrc = point.getAttribute('data-img');
      const stageDesc = point.getAttribute('data-desc');

      stageNameElem.textContent = stageName;
      stageInfoElem.textContent = stageInfo;
      stageImageElem.src = stageImageSrc;
      stageImageElem.style.display = 'block';
      stageDescElem.textContent = stageDesc;
      stageDescElem.style.display = 'block';

      // show-infoクラスを追加
      mapInfoElem.classList.add('show-info');
      stageNameElem.classList.add('show-info');
      stageInfoElem.classList.add('show-info');
      stageImageElem.classList.add('show-info');
      stageDescElem.classList.add('show-info');

      // 直前の情報を更新
      lastStageName = stageName;
      lastStageInfo = stageInfo;
      lastStageImage = stageImageSrc;
      lastStageDesc = stageDesc;
    });

    point.addEventListener('mouseout', () => {
      // マウスアウト時に直前の情報を維持する（特に何もしない）
      stageNameElem.textContent = lastStageName;
      stageInfoElem.textContent = lastStageInfo;
      stageImageElem.src = lastStageImage;
      stageDescElem.textContent = lastStageDesc;

      // show-infoクラスは維持
      mapInfoElem.classList.add('show-info');
      stageNameElem.classList.add('show-info');
      stageInfoElem.classList.add('show-info');
      stageImageElem.classList.add('show-info');
      stageDescElem.classList.add('show-info');
    });
    // point.addEventListener('click', (event) => {
    //     event.preventDefault(); // ページ遷移を防止し、効果音再生後に遷移
  
    //     clickSound.play().then(() => {
    //       // 効果音が再生完了後に遷移
    //       setTimeout(() => {
    //         window.location.href = point.getAttribute('href');
    //       }, 1000); // 効果音の再生時間（300ms）後に遷移
    //     }).catch((error) => {
    //       console.error("効果音の再生に失敗しました:", error);
    //       window.location.href = point.getAttribute('href'); // 再生できなかった場合でも遷移
    //     });
    //   });
    });
  });

//画面の比率を変えると起用のや----------
// session 保存
document.addEventListener('DOMContentLoaded', () => {
    const stageLinks = document.querySelectorAll('.stage-link');

    stageLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); // ページ遷移を一時的に停止

            const stageId = link.getAttribute('data-stage-id');
            console.log('送信するステージID:', stageId);

            // セッションにステージIDを保存するリクエスト
            fetch('../php/set_session.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stage_id: stageId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('ステージIDがセッションに保存されました:', data.message);
                        window.location.href = link.getAttribute('href'); // 元のリンク先に移動
                    } else {
                        console.error('セッション保存エラー:', data.message);
                        alert('セッション保存エラー: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('セッション保存リクエスト中にエラーが発生:', error);
                    alert('セッション保存中にエラーが発生しました。');
                });
        });
    });
});


// //----------------------------------------BGM----------------------------------------


document.addEventListener('DOMContentLoaded', () => {
    // ステージ選択画面用BGM
    const bgmFilePath = '../sounds/maou_bgm_8bit23.ogg';

    // 保存されたBGM設定を復元
    const savedBgmVolume = localStorage.getItem('bgmVolume');
    const savedBgmEnabled = localStorage.getItem('bgmEnabled');

    if (savedBgmVolume !== null) {
        audioManager.setBGMVolume(parseFloat(savedBgmVolume));
    }

    if (savedBgmEnabled === null || savedBgmEnabled === 'true') {
        audioManager.bgmEnabled = true; // デフォルトでON
    } else {
        audioManager.bgmEnabled = false;
    }

    // BGMを再生
    if (audioManager.bgmEnabled) {
        audioManager.playBGM(bgmFilePath);
    }

    // 現在再生中のBGMをlocalStorageに保存
    localStorage.setItem('currentBgm', bgmFilePath);

    });


// document.addEventListener("DOMContentLoaded", () => {
//     const bgmAudio = new Audio("../sounds/iwashiro_sendousuru_otoko.mp3"); // ステージ選択画面のBGM
//     bgmAudio.loop = true;

//     // 音量とBGM状態をローカルストレージから取得
//     const savedVolume = parseFloat(localStorage.getItem("bgmVolume")) || 0.0;
//     const bgmEnabled = localStorage.getItem("bgmEnabled") !== "false"; // デフォルトはtrue
//     bgmAudio.volume = savedVolume;

//     // BGMの状態に応じて再生または停止
//     if (bgmEnabled) {
//         bgmAudio.play().catch(() => {
//             console.log("BGMの自動再生がブロックされました");
//         });
//     }

//     // ページ遷移時の処理
//     const stageLinks = document.querySelectorAll('.stage-link');
//     stageLinks.forEach(link => {
//         link.addEventListener('click', (event) => {
//             event.preventDefault();

//             // BGMの再生位置と状態を保存
//             localStorage.setItem("bgmCurrentTime", bgmAudio.currentTime);
//             localStorage.setItem("bgmPlaying", !bgmAudio.paused);

//             // ページ遷移
//             window.location.href = link.getAttribute("href");
//         });
//     });

//     const settingButton = document.getElementById("setting-button");
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

//     // ページ離脱時にBGMを停止
//     window.addEventListener("beforeunload", () => {
//         bgmAudio.pause();
//         bgmAudio.currentTime = 0;
//     });
// });


// //----------------------------------------ステージ選択時の効果音----------------------------------------
// document.addEventListener("DOMContentLoaded", () => {
//     const stageLinks = document.querySelectorAll('.stage-link');
//     const stageSelectSound = new Audio("../sounds/se_select.mp3"); // ステージ選択時の効果音
  
//     // 効果音の音量をBGMの音量と同期
//     const savedVolume = parseFloat(localStorage.getItem("bgmVolume")) || 0.0;
//     stageSelectSound.volume = savedVolume;
  
//     stageLinks.forEach(link => {
//         link.addEventListener("click", (event) => {
//             event.preventDefault(); // ページ遷移を一瞬遅らせる
//             stageSelectSound.play().then(() => {
//                 setTimeout(() => {
//                     window.location.href = link.getAttribute("href"); // 元のリンク先に遷移
//                 }, 500); // 500ms遅延（効果音の長さに合わせる）
//             }).catch((error) => {
//                 console.error("効果音の再生に失敗しました:", error);
//             });
//         });
//     });
//   });
  