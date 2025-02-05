import { audioManager } from './AudioManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const settingsModal = document.getElementById('settings-modal');
    const bgmVolumeSlider = document.getElementById('bgm-volume');
    const bgmToggleBtn = document.getElementById('bgm-toggle');
    const settingButton = document.getElementById('setting-button');
    if (!settingButton || !settingsModal) {
        console.error('必要な要素が見つかりません。HTMLを確認してください。');
        return;
    }

    // モーダルを開く
    settingButton.addEventListener('click', (event) => {
        event.preventDefault();
        settingsModal.classList.remove('hidden');
    });

    // モーダルを閉じる
    document.getElementById('close-modal').addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // 保存された設定を復元
    const savedBgmVolume = localStorage.getItem('bgmVolume');
    const savedBgmEnabled = localStorage.getItem('bgmEnabled');

    // 初期値を設定（保存されていない場合、デフォルトを設定）
    if (savedBgmVolume !== null) {
        audioManager.setBGMVolume(parseFloat(savedBgmVolume));
    } else {
        localStorage.setItem('bgmVolume', audioManager.bgmVolume); // デフォルトを保存
    }

    if (savedBgmEnabled !== null) {
        audioManager.bgmEnabled = savedBgmEnabled === 'true';
    } else {
        audioManager.bgmEnabled = true; // デフォルトでONに設定
        localStorage.setItem('bgmEnabled', 'true');
    }

    // 初期値をスライダーやボタンに反映
    bgmVolumeSlider.value = audioManager.bgmVolume * 100;
    bgmToggleBtn.textContent = audioManager.bgmEnabled ? 'BGM OFF' : 'BGM ON';

    // 音量スライダー変更時
    bgmVolumeSlider.addEventListener('input', (event) => {
        const volume = parseFloat(event.target.value) / 100;
        audioManager.setBGMVolume(volume);
        localStorage.setItem('bgmVolume', volume); // 設定を保存
    });

    // BGMのON/OFF切り替え
    bgmToggleBtn.addEventListener('click', () => {
        audioManager.toggleBGM();
        bgmToggleBtn.textContent = audioManager.bgmEnabled ? 'BGM OFF' : 'BGM ON';
        localStorage.setItem('bgmEnabled', audioManager.bgmEnabled); // 設定を保存
    });
});
