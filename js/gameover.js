import { audioManager } from './AudioManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // ゲームオーバー画面のBGMファイルパス
    const gameOverBgmFilePath = '../sounds/iwa_gameover007.mp3';

    // 保存された設定を復元
    const savedBgmVolume = localStorage.getItem('bgmVolume');
    const savedBgmEnabled = localStorage.getItem('bgmEnabled');

    if (savedBgmVolume !== null) {
        audioManager.setBGMVolume(parseFloat(savedBgmVolume)); // 音量を復元
    }

    if (savedBgmEnabled !== null) {
        audioManager.bgmEnabled = savedBgmEnabled === 'true'; // ON/OFF状態を復元
    }

    // ゲームオーバーBGMを再生
    if (audioManager.bgmEnabled) {
        audioManager.playBGM(gameOverBgmFilePath);
    } else {
        console.warn('BGMが無効化されているため、再生されません。');
    }

    // "Continue" ボタンのクリックイベント
    document.querySelector('.btn.restart-btn').addEventListener('click', function () {
        location.href = '/game/php/suzuki.php'; // ゲーム画面にリダイレクト
        console.log('コンテニュー');
    });

    // "Home" ボタンのクリックイベント
    document.querySelector('.btn.title-btn').addEventListener('click', function () {
        location.href = '/game/php/home.php'; // タイトル画面にリダイレクト
    });

    // 順番にクラスを追加
    const elements = document.querySelectorAll('.title, .subtitle, .main-img, .start-bt');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible'); // 順番にvisibleクラスを追加
        }, index * 500);
    });
});
