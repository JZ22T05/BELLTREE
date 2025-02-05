/*------------残機が減ったときのカットイン---------------*/
// カットインを表示する関数
function showCutIn(message) {
    const cutInElement = document.getElementById('cutin');
    if (!cutInElement) {
        console.error('カットイン要素が見つかりません');
        return;
    }

    // メッセージを動的に設定
    const cutinText = document.getElementById('cutin-text');
    cutinText.textContent = message;

    // カットインを表示
    cutInElement.classList.add('show');
    cutInElement.style.display = 'block';

    // 2秒後にフェードアウト
    setTimeout(() => {
        cutInElement.classList.remove('show');
        cutInElement.classList.add('hide');

        // フェードアウト完了後に非表示にする
        setTimeout(() => {
            cutInElement.style.display = 'none';
            cutInElement.classList.remove('hide');
        }, 500); // フェードアウト時間
    }, 2000); // 2秒間表示
}
