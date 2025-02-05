import { audioManager } from './AudioManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // 保存された設定を復元
    const savedBgmVolume = localStorage.getItem('bgmVolume');
    const savedBgmEnabled = localStorage.getItem('bgmEnabled');

    if (savedBgmVolume !== null) {
        audioManager.setBGMVolume(parseFloat(savedBgmVolume));
    }
    if (savedBgmEnabled !== null) {
        audioManager.bgmEnabled = savedBgmEnabled === 'true';
    }

    // HOME画面でBGMを再生
    audioManager.playBGM('../sounds/maou_bgm_8bit20.mp3');
});
