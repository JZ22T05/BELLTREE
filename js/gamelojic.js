import { audioManager } from './AudioManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // ゲーム画面のBGMファイルパス
    const gameBgmFilePath = '../sounds/song03.wav';

    // 保存された設定を復元
    const savedBgmVolume = localStorage.getItem('bgmVolume');
    const savedBgmEnabled = localStorage.getItem('bgmEnabled');

    if (savedBgmVolume !== null) {
        audioManager.setBGMVolume(parseFloat(savedBgmVolume)); // 音量を復元
    }

    if (savedBgmEnabled !== null) {
        audioManager.bgmEnabled = savedBgmEnabled === 'true'; // ON/OFF状態を復元
    }

    // ゲーム画面用BGMを再生
    if (audioManager.bgmEnabled) {
        audioManager.playBGM(gameBgmFilePath);
    } else {
        console.warn('BGMが無効化されているため、再生されません。');
    }
});










// document.addEventListener("DOMContentLoaded", () => {
//     // 音量管理オブジェクト
//     const volumeManager = {
//       volume: parseFloat(localStorage.getItem("bgmVolume")) || 0.0,
//       bgmEnabled: localStorage.getItem("bgmEnabled") !== "false",
  
//       setVolume(newVolume) {
//         this.volume = newVolume / 100; // スライダーの値を0.0-1.0に変換
//         bgmAudio.volume = this.volume; // BGM音量を設定
//         Object.values(soundsManager.sounds).forEach((sound) => {
//           sound.volume = this.volume; // 効果音音量を設定
//         });
//         localStorage.setItem("bgmVolume", this.volume); // 保存
//       },
  
//       toggleBGM() {
//         this.bgmEnabled = !this.bgmEnabled;
//         if (this.bgmEnabled) {
//           bgmAudio.play();
//         } else {
//           bgmAudio.pause();
//         }
//         localStorage.setItem("bgmEnabled", this.bgmEnabled);
//         return this.bgmEnabled;
//       },
//     };
  
//     // BGM設定
//     const bgmAudio = new Audio("../sounds/maou_bgm_8bit17.mp3");
//     bgmAudio.loop = true;
//     bgmAudio.volume = volumeManager.volume;
  
//     // 効果音管理
//     const soundsManager = {
//       sounds: {},
  
//       async load(name, src) {
//         const audio = new Audio(src);
//         audio.volume = volumeManager.volume;
//         return new Promise((resolve, reject) => {
//           audio.addEventListener("canplaythrough", () => {
//             this.sounds[name] = audio;
//             resolve();
//           });
//           audio.addEventListener("error", () =>
//             reject(new Error(`Failed to load sound: ${src}`))
//           );
//         });
//       },
  
//       play(name) {
//         const sound = this.sounds[name];
//         if (sound) {
//           sound.currentTime = 0; // 先頭から再生
//           sound.play();
//         } else {
//           console.warn(`Sound "${name}" not found`);
//         }
//       },
//     };
  
//     // 効果音のロード
//     async function loadSounds() {
//         try {
//             await soundsManager.load("jump", "../sounds/jump.mp3");
//             await soundsManager.load("goal", "../sounds/goal.wav");
//             await soundsManager.load("hit", "../sounds/enemy.mp3");
    
//             // 音声をプリロード
//             Object.values(soundsManager.sounds).forEach((sound) => {
//                 sound.load();
//             });
    
//             console.log("効果音のロードとプリロードが完了しました");
//         } catch (error) {
//             console.error("効果音のロードに失敗しました:", error);
//         }
//     }
    
  
//     document.addEventListener("DOMContentLoaded", () => {
//         const settingButton = document.getElementById("setting-button");
//         const settingsModal = document.getElementById("settings-modal");
//         const closeModalButton = document.getElementById("close-modal");
      
//         // モーダルを開く
//         settingButton.addEventListener("click", (event) => {
//           event.preventDefault(); // デフォルト動作を防止
//           settingsModal.classList.remove("hidden"); // モーダルを表示
//         });
      
//         // モーダルを閉じる
//         closeModalButton.addEventListener("click", () => {
//           settingsModal.classList.add("hidden"); // モーダルを非表示
//         });
      
//         // 背景クリックでモーダルを閉じる
//         window.addEventListener("click", (event) => {
//           if (event.target === settingsModal) {
//             settingsModal.classList.add("hidden");
//           }
//         });
//       });
      
  
//     // 効果音のイベント連携
//     document.addEventListener("jumpEvent", () => soundsManager.play("jump"));
//     document.addEventListener("goalEvent", () => soundsManager.play("goal"));
//     document.addEventListener("hitEvent", () => soundsManager.play("hit"));
  
//     // 初期化
//     if (volumeManager.bgmEnabled) {
//       bgmAudio.play().catch(() => console.log("BGM再生がブロックされました"));
//     }
//     loadSounds();
//   });

  