export class AudioManager {
    constructor() {
        this.bgmVolume = 0.5; // BGM音量（初期値 50%）
        this.seVolume = 0.5;  // 効果音音量（初期値 50%）
        this.bgmEnabled = true; // BGM ON/OFFの状態
        this.seEnabled = true;  // 効果音 ON/OFFの状態
        this.bgmAudio = null;   // 現在再生中のBGM
    }

    // BGM音量設定
    setBGMVolume(volume) {
        this.bgmVolume = volume;
        if (this.bgmAudio) {
            this.bgmAudio.volume = volume; // 再生中のBGMに音量を適用
        }
    }

    // 効果音音量設定
    setSEVolume(volume) {
        this.seVolume = volume;
    }

    // BGM再生
    playBGM(audioFilePath) {
        if (!this.bgmEnabled) return; // BGMが無効なら再生しない
        if (this.bgmAudio) this.bgmAudio.pause(); // 既存のBGMを停止

        this.bgmAudio = new Audio(audioFilePath);
        this.bgmAudio.loop = true; // ループ再生
        this.bgmAudio.volume = this.bgmVolume; // 設定した音量を適用
        this.bgmAudio.play();
    }

    // 効果音再生
    playSE(audioFilePath) {
        if (!this.seEnabled) return; // 効果音が無効なら再生しない

        const seAudio = new Audio(audioFilePath);
        seAudio.volume = this.seVolume; // 設定した音量を適用
        seAudio.play();
    }

    // BGMのON/OFF切り替え
    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (this.bgmEnabled && this.bgmAudio) {
            this.bgmAudio.play();
        } else if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
    }
}
window.audioManager = new AudioManager();

// グローバルなAudioManagerインスタンスをエクスポート
export const audioManager = new AudioManager();
