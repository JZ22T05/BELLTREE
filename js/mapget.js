// URLクエリパラメータから stage_id を取得
function getStageIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    const stageID = params.get('stage_id'); // stage_id を取得
    console.log("現在のURL:", window.location.href); // デバッグ用: URLの全体を確認
    console.log("取得したステージID:", stageID); // デバッグ用: stage_id の値を確認
    return stageID;
  }
  
  // stage_id に基づいて MAP画像を設定
  function updateMapImage(stageID) {
    const stageImages = {
      1: '../images/map1.png', // ステージID 1 のMAP画像
      2: '../images/map2.png', // ステージID 2 のMAP画像
      3: '../images/map3.png', // ステージID 3 のMAP画像
      // 必要に応じて他の画像を追加
    };
  
    const mapImageElement = document.getElementById('map-image');
    if (stageImages[stageID]) {
      mapImageElement.src = stageImages[stageID];
      console.log("設定された画像:", stageImages[stageID]);
    } else {
      console.warn("指定されたSTAGE IDに対応するMAP画像がありません。デフォルト画像を使用します。");
      mapImageElement.src = '../images/default-map.png'; // デフォルト画像
    }
  }
  
  // stage_id をセッションに保存するために送信
  function saveStageIDToSession(stageID) {
    fetch('../php/save_stage.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // POSTデータの形式を指定
      },
      body: JSON.stringify({ stage_id: stageID }), // データをJSON形式で送信
    })
      .then((response) => response.json()) // サーバーのレスポンスをJSONとしてパース
      .then((data) => {
        if (data.success) {
          console.log('STAGE_IDがセッションに保存されました:', stageID);
        } else {
          console.error('セッション保存に失敗しました:', data.message);
        }
      })
      .catch((error) => console.error('エラーが発生しました:', error));
  }
  
  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    const stageID = getStageIDFromURL();
    if (stageID) {
      updateMapImage(stageID); // ステージ画像を更新
      saveStageIDToSession(stageID); // セッションに保存
    }
  
    // マップモーダルの設定
    const mapPopup = document.querySelector('.map-popup');
    const mapModal = document.getElementById('map-modal');
    const closeMapBtn = document.getElementById('close-map-btn');
  
    // MAPボタンをクリックしたときの動作
    mapPopup.addEventListener('click', () => {
      if (mapModal) {
        mapModal.classList.remove('hidden'); // モーダルを表示
      }
    });
  
    // モーダルを閉じるボタンの動作
    closeMapBtn.addEventListener('click', () => {
      if (mapModal) {
        mapModal.classList.add('hidden'); // モーダルを非表示
      }
    });
  
    // モーダル外をクリックした場合に閉じる動作
    window.addEventListener('click', (event) => {
      if (event.target === mapModal) {
        mapModal.classList.add('hidden');
      }
    });
  });
  