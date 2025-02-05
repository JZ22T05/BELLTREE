/**
 * 参考資料：
 * YouTubeより「本気でプログラマーになるためのプログラミング講座」
 *＠Akichun★PG様 URL:"https://www.youtube.com/@akichon"
 *URL:"https://www.youtube.com/watch?v=ZKPrG3PlMSg&ab_channel=Akichun%E2%98%85PG"
 */


// 仮想キャンバスと実キャンバスの作成
let vcan = document.createElement("canvas"); // 仮想キャンバスの生成
let vcon = vcan.getContext("2d"); // 2Dコンテキストを取得

let can = document.getElementById("can"); // HTML要素のキャンバスを取得
let con = can.getContext("2d"); // 実キャンバスの2Dコンテキストを取得

// キャラクターの初期位置 (16倍される)
let initialPositionX = 96 << 4; // X軸の初期位置
let initialPositionY = 120 << 4; // Y軸の初期位置

// 仮想キャンバスのサイズ設定
vcan.width = SCREEN_SIZE_W; // 幅を画面サイズに設定
vcan.height = SCREEN_SIZE_H; // 高さを画面サイズに設定

// 実キャンバスのサイズを2倍に設定 (拡大表示)
can.width = SCREEN_SIZE_W * 2; // 幅を2倍に設定
can.height = SCREEN_SIZE_H * 2; // 高さを2倍に設定

// 画像のスムージングを無効化 (ドット絵の鮮明化)
con.mozImageSmoothingEnabled = false; // Firefox用
con.msImageSmoothingEnabled = false; // IE用
con.webkitImageSmoothingEnabled = false; // Safari用
con.imageSmoothingEnabled = false; // その他ブラウザ用

// フレームレート管理用変数
let frameCount = 0; // フレームカウント
let startTime; // ゲーム開始時の時間

// キャラクタースプライトの読み込み
let chImg = new Image(); // 新しい画像オブジェクトの作成
chImg.src = "../img/suzuki.png"; // 画像のソースを設定

// キーボード入力の状態を保持するオブジェクト
let Keyb = {}; // 空のオブジェクト

// ゲームオブジェクトの初期化
let ojisan; // 主人公キャラクター
let field; // フィールド(マップ)
let block = []; // ブロックの配列
let item = []; // アイテムの配列

let currentCommand = null; // 実行中のコマンド情報

let isPaused = false; // 停止状態の管理
let currentTimeout = null; // 現在のタイマーを保持
let currentIndex = 0; // アルゴリズムの現在のインデックス

let initialFieldData = [...fieldData]; // 配列を深いコピー



//----------------------------------------オブジェクトの更新処理----------------------------------------
function updateObj(obj) {
  for (let i = obj.length - 1; i >= 0; i--) {
    obj[i].update(); // オブジェクトの更新
    if (obj[i].kill) obj.splice(i, 1); // 削除フラグが立っているオブジェクトを配列から削除
  }

}
//----------------------------------------スプライト画像の読み込み完了時に実行----------------------------------------
chImg.onload = function() {
  ojisan = new Ojisan(96 << 4, 120 << 4); // 主人公キャラクターの生成
  field = new Field(); // フィールドの生成
  startTime = performance.now(); // ゲーム開始時の時間を記録
  mainLoop(); // ゲームループの開始
}

//----------------------------------------キャラクター（制御系）----------------------------------------
//----------------------------------------前進処理----------------------------------------
function moveForward() {
  Keyb.Right = true;
  setTimeout(() => {
      Keyb.Right = false;
  }, 205); // 1秒間前進
}

//----------------------------------------後退処理----------------------------------------
function moveBackward() {
  Keyb.Left = true;
  setTimeout(() => {
      Keyb.Left = false;
  }, 275); // 1秒間後退
}

//----------------------------------------ジャンプ処理----------------------------------------
function jump() {
  Keyb.ABUTTON = true;
  setTimeout(() => {
      Keyb.ABUTTON = false;
  }, 50); 
}

//----------------------------------------停止処理----------------------------------------
function stopCharacter() {
  // 現在のキー入力をすべて解除
  Keyb.Right = false;
  Keyb.Left = false;
  Keyb.ABUTTON = false;

  // キャラクターの速度をリセット
  ojisan.vx = 0; // 横方向の速度を0に
  ojisan.vy = 0; // 縦方向の速度を0に

  // キャラクターを直立状態に変更（スプライト番号を設定）
  ojisan.sprite = 0; // スプライトの番号を直立状態に
}

//----------------------------------------リセットしたときの処理----------------------------------------
//----------------------------------------マップデータを初期に戻す----------------------------------------
function resetFieldData() {
  fieldData = [...initialFieldData]; // 初期状態に戻す
}
//----------------------------------------キャラクターの位置----------------------------------------
function resetGame() {
  ojisan.x = initialPositionX; // 主人公のX座標を初期位置に戻す
  ojisan.y = initialPositionY; // 主人公のY座標を初期位置に戻す
  ojisan.vx = 0; // 横方向の速度をリセット
  ojisan.vy = 0; // 縦方向の速度をリセット

  resetFieldData(); // フィールドデータを初期化
  field = new Field(); // フィールドを再生成
  block = []; // ブロックの配列をクリア
  item = []; // アイテムの配列をクリア

  Keyb.Left = false; // キー入力のリセット
  Keyb.Right = false;
  Keyb.ABUTTON = false;

  clearTimeout(currentTimeout); // タイマーをクリア
  isPaused = false; // 停止状態をリセット
  currentIndex = 0; // アルゴリズムのインデックスを初期化

  draw(); // 描画の更新
}

//-------------------------------------ドラッグ開始イベント-------------------------------------
//----------------------------------------ドラッグ開始----------------------------------------
const blockPalette = document.getElementById('block-palette');
const programArea = document.getElementById('program-area');

blockPalette.addEventListener('dragstart', (event) => {
  if (event.target.classList.contains('else-block')) {
    event.dataTransfer.setData('text/plain', 'else');
  } else {
    event.dataTransfer.setData('text/plain', event.target.dataset.command);
  }
});

//----------------------------------------ドラッグ終了イベント----------------------------------------
blockPalette.addEventListener('dragend', (event) => {
  event.target.classList.remove('dragging');
});

//----------------------------------------プログラムエリアへのドラッグを許可----------------------------------------
programArea.addEventListener('dragover', (event) => {
  event.preventDefault(); // 必須
});

//------------------------------------------ elseブロック生成関数---------------------------------------------------
function createElseBlock(conditionText) {
  // 既存のelseブロック削除（もし存在する場合）
  const existingElseBlock = blockPalette.querySelector('.else-block');
  if (existingElseBlock) {
    existingElseBlock.remove();
  }

  // 新しいelseブロックの作成
  const elseBlock = document.createElement('div');
  elseBlock.className = 'block else-block';
  elseBlock.dataset.command = 'else';
  elseBlock.draggable = true; // ドラッグ可能に設定

  // elseラベル
  const elseLabel = document.createElement('span');
  elseLabel.textContent = `else: ${conditionText}でなければ`;
  elseLabel.className = 'command-label';
  elseBlock.appendChild(elseLabel);

  // ドラッグ開始時イベント
  elseBlock.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', 'else');
    elseBlock.classList.add('dragging');
  });

  // ドラッグ終了時イベント
  elseBlock.addEventListener('dragend', (event) => {
    elseBlock.classList.remove('dragging');
  });

  // `block-palette`に追加
  blockPalette.appendChild(elseBlock);
}
//------------------------------------------ elseブロック生成関数終了---------------------------------------------------
// ドラッグ中のスタイルを設定
function setDraggingStyle(block) {
  block.style.opacity = "0.5"; // 半透明
  block.style.backgroundColor = "#ffeb3b"; // 黄色背景
  block.style.border = "2px dashed #f57c00"; // オレンジ色の破線
}

// ドラッグ終了時のスタイルをリセット
function resetDraggingStyle(block) {
  block.style.opacity = ""; // 透明度リセット
  block.style.backgroundColor = ""; // 背景色リセット
  block.style.border = ""; // 枠線リセット
}

// ドラッグオーバー時の視覚的な線を設定
function setDropIndicator(block) {
  block.style.borderBottom = "3px solid #3f51b5"; // 青色の下線
}

// ドラッグオーバー終了時に線をリセット
function resetDropIndicator(block) {
  block.style.borderBottom = ""; // 下線をリセット
}


programArea.addEventListener("dragover", (event) => {
  event.preventDefault(); // ドロップを許可
  //console.log("プログラムエリア上でドラッグ中");

  // ドラッグオーバー中のブロックを取得
  const targetBlock = event.target.closest(".block");
  if (targetBlock) {
    setDropIndicator(targetBlock); // ドロップ可能な場所を明示
  }
});

programArea.addEventListener("dragleave", (event) => {
  const targetBlock = event.target.closest(".block");
  if (targetBlock) {
    resetDropIndicator(targetBlock); // 下線をリセット
  }
});


programArea.addEventListener("drop", (event) => {
  event.preventDefault();
  //console.log("ドロップイベントが発生しました:", event);

  // ドラッグされたデータを取得
  const draggedBlockId = event.dataTransfer.getData("draggedBlockId");
  const command = event.dataTransfer.getData("text/plain");

  if (draggedBlockId) {
    const draggedBlock = document.getElementById(draggedBlockId);
    const dropTarget = event.target.closest(".block");

    // 並び替え処理
    if (dropTarget && dropTarget !== draggedBlock) {
      const dropRect = dropTarget.getBoundingClientRect();
      const dropCenterY = dropRect.top + dropRect.height / 2;

      if (event.clientY < dropCenterY) {
        // ドラッグされたブロックをターゲットの前に挿入
        programArea.insertBefore(draggedBlock, dropTarget);
      } else {
        // ドラッグされたブロックをターゲットの後ろに挿入
        programArea.insertBefore(draggedBlock, dropTarget.nextSibling);
      }
      //console.log("ブロックの順序を変更しました:", draggedBlock);
      updateAlgorithm();
    }

    // 視覚的フィードバックのリセット
    resetDraggingStyle(draggedBlock);
    if (dropTarget) resetDropIndicator(dropTarget);

    return; // 再配置の場合、新規ブロック作成をスキップ
  }

  if (command) {
    //console.log("プログラムエリアに追加するブロックを準備中...");

    // 同じデータコマンドのブロックが既に存在するか確認
    const existingBlocks = Array.from(programArea.children).filter(
      (block) => block.dataset.command === command
    );
   // console.log("既存ブロックのチェック結果:", existingBlocks);

    if (existingBlocks.length > 0 && ["if-end", "else"].includes(command)) {
      alert(`「${getCommandLabel(command)}」は既に追加されています！`);
     // console.log("既存の同一ブロックがあるため、追加を中止しました");
      return; // 同じブロックが存在する場合、追加を防止
    }

    // 新しいブロックを作成
    const newBlock = document.createElement("div");
    newBlock.className = "block";
    newBlock.dataset.command = command;
    newBlock.id = `block-${Date.now()}`; // 一意なIDを付与
   // console.log("新しいブロックを作成:", newBlock);

    // コマンド名を表示
    const commandLabel = document.createElement("span");
    commandLabel.textContent = getCommandLabel(command);
    commandLabel.className = "command-label";
    newBlock.appendChild(commandLabel);
    //console.log("ブロックにコマンドラベルを追加しました:", commandLabel);

    // **前進・後退・ジャンプ・停止ブロックの処理**
    if (["1", "2", "3", "4"].includes(command)) {
      //console.log("ブロックが移動系コマンドの場合の処理を開始");

      if (!newBlock.querySelector(".forward-count-input")) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.value = 1; // **デフォルト値を `1` に設定**
        input.placeholder = "回数";
        input.className = "forward-count-input";
        newBlock.appendChild(input);
        //console.log("ブロックに回数入力フィールドを追加:", input);
      }
    }

    // **ループ開始ブロックの処理**
    if (command === "loop-start") {
     // console.log("ループ開始ブロックの処理を開始");

      if (!newBlock.querySelector(".loop-input")) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.value = 1; // **デフォルト値を `1` に設定**
        input.placeholder = "回数";
        input.className = "loop-input";
        newBlock.appendChild(input);
        //console.log("ループ開始ブロックに回数入力フィールドを追加:", input);
      }
    }

    // **条件ブロック (if-condition) の処理**
    if (command === "if-condition") {
      console.log("条件ブロックの処理を開始");
  
      const select = document.createElement("select");
      select.className = "condition-select";
      console.log("条件選択用セレクトボックスを作成");
  
      // デフォルトオプションを追加
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "条件を選択してください";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);
  
      // 条件リストを追加
      const conditions = [
          { value: "block", label: "目の前にブロックがある" },
          { value: "hole", label: "目の前に穴がある" },
      ];
      console.log("条件リストを作成:", conditions);
  
      conditions.forEach((condition) => {
          const option = document.createElement("option");
          option.value = condition.value;
          option.textContent = condition.label;
          select.appendChild(option);
      });
      newBlock.appendChild(select);
      console.log("条件ブロックに条件セレクトボックスを追加:", select);
  
      // 条件が変更された場合の処理
      select.addEventListener("change", () => {
          const selectedCondition = select.value;
          const conditionText = getConditionLabel(selectedCondition);
          console.log("条件が変更されました:", conditionText);
  
          const existingElseBlock = blockPalette.querySelector(".else-block");
          if (existingElseBlock) {
              const elseLabel = existingElseBlock.querySelector(".command-label");
              elseLabel.textContent = `else: ${conditionText}でなければ`;
              console.log("既存のelseブロックを更新しました:", elseLabel);
          } else {
              const elseBlock = document.createElement("div");
              elseBlock.className = "block else-block";
              elseBlock.dataset.command = "else";
              elseBlock.draggable = true;
  
              const elseLabel = document.createElement("span");
              elseLabel.textContent = `else: ${conditionText}でなければ`;
              elseLabel.className = "command-label";
              elseBlock.appendChild(elseLabel);
  
              blockPalette.appendChild(elseBlock);
              console.log("新しいelseブロックを作成:", elseBlock);
  
              // ドラッグ可能に設定
              elseBlock.addEventListener("dragstart", (dragEvent) => {
                  dragEvent.dataTransfer.setData("text/plain", "else");
                  console.log("elseブロックがドラッグされました");
              });
          }
      });
  }
  

    // **削除ボタンの追加**
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      newBlock.remove();
      console.log("ブロックが削除されました:", newBlock);

      if (command === "if-condition") {
        const existingElseBlock = blockPalette.querySelector(".else-block");
        if (existingElseBlock) {
          existingElseBlock.remove();
          console.log("関連するelseブロックを削除しました");
        }
      }
      updateAlgorithm();
      console.log("アルゴリズムを更新しました");
    });
    newBlock.appendChild(deleteBtn);
    console.log("削除ボタンを追加しました:", deleteBtn);

    // ドラッグ可能にする設定
    newBlock.draggable = true;
    newBlock.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("draggedBlockId", newBlock.id);
      console.log("プログラムエリア内のブロックがドラッグされました:", newBlock.id);
    });

    // プログラムエリアにブロックを追加
    programArea.appendChild(newBlock);
    console.log("プログラムエリアにブロックを追加しました:", newBlock);

    updateAlgorithm();
    console.log("アルゴリズムの更新処理を完了しました");
  }
});

// ドラッグ開始時のスタイル設定
programArea.addEventListener("dragstart", (event) => {
  const draggedBlock = event.target.closest(".block");
  if (draggedBlock) {
    setDraggingStyle(draggedBlock); // ドラッグ中のスタイルを適用
  }
});

// ドラッグ終了時のスタイルリセット
programArea.addEventListener("dragend", (event) => {
  const draggedBlock = event.target.closest(".block");
  if (draggedBlock) {
    resetDraggingStyle(draggedBlock); // ドラッグ終了後のスタイルリセット
  }
});



//----------------------------------------if文のif文終了を自動で作成するよ----------------------------------------
function addIfEndBlock() {
  const ifEndBlock = document.createElement("div");
  ifEndBlock.className = "block if-end-block";
  ifEndBlock.dataset.command = "if-end";
  ifEndBlock.draggable = true;

  // コマンド名の表示
  const commandLabel = document.createElement("span");
  commandLabel.textContent = "if文終了";
  commandLabel.className = "command-label";
  ifEndBlock.appendChild(commandLabel);

  // ドラッグ開始イベント
  ifEndBlock.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", "if-end");
    ifEndBlock.classList.add("dragging");
  });

  // ドラッグ終了イベント
  ifEndBlock.addEventListener("dragend", (event) => {
    ifEndBlock.classList.remove("dragging");
  });

  // `block-palette`に追加
  blockPalette.appendChild(ifEndBlock);
}





//----------------------------------------if文の条件を読み取るよ----------------------------------------
function getConditionLabel(condition) {
  switch (condition) {
    case "block": return "目の前にブロックがある";
    case "hole": return "目の前に穴がある";
    default: return "未知の条件";
  }
}

//----------------------------------------アルゴリズムの情報を返すよ（program-areaで表示する文字）----------------------------------------
function getCommandLabel(command) {
  switch (command) {
    case "1": return "前進";
    case "2": return "後退";
    case "3": return "ジャンプ";
    case "4": return "停止";
    case "loop-start": return "[ ループ開始";
    case "loop-end": return "] ループ終了";
    case "if-condition": return "if (条件)";
    case "if-end": return "if文終了";
    default: return "不明なコマンド";
  }
}



// 初期化処理で「if文終了」ブロックを追加
document.addEventListener('DOMContentLoaded', () => {
  addIfEndBlock(); // 「if文終了」ブロックを追加
});



// アルゴリズムを再取得する関数
function updateAlgorithm() {
  const commands = getCommandsFromProgramArea();
}


// プログラムエリア内のコマンドを解析（ループや条件を考慮し、前進回数を反映）
function getCommandsFromProgramArea() {
  const commands = [];
  const loopStack = []; // ループのスタック

  programArea.querySelectorAll('.block').forEach((block, index) => {
    const commandType = block.dataset.command;
    const command = { type: commandType, index };

    // 前進ブロックの場合、回数を取得
    if (commandType === '1' || '2' || '3' || '4') {
      const input = block.querySelector('.forward-count-input');
      command.count = input ? parseInt(input.value, 10) || 1 : 1; // 入力された回数（デフォルト1回）
    }

    // ループ開始の場合
    if (commandType === 'loop-start') {
      const input = block.querySelector('.loop-input');
      command.loopCount = input ? parseInt(input.value, 10) || 1 : 1; // 入力値を取得（デフォルト1回）
      loopStack.push(command); // ループのスタックに追加
    }

    // ループ終了の場合
    if (commandType === 'loop-end') {
      const loopStart = loopStack.pop(); // 対応するループ開始を取得
      if (loopStart) {
        loopStart.loopEndIndex = index; // ループの終了インデックスを記録
        command.loopStartIndex = loopStart.index; // ループ開始のインデックスを記録
      }
    }

    // if条件ブロックの場合
    if (commandType === 'if-condition') {
      const select = block.querySelector('.condition-select');
      command.condition = select ? select.value : null; // 選択された条件を取得
    }

    commands.push(command);
  });

  return commands;
}






// ----------------------------------------ループ処理を実行する関数（ループ内の処理も表示）----------------------------------------
function handleLoop(algorithms, loopStartIndex, loopEndIndex, loopCount, callback) {
  let loopIndex = 0;

  function executeLoopStep() {
    if (loopIndex < loopCount) {
      let stepIndex = loopStartIndex;

      function executeStep() {
        if (stepIndex <= loopEndIndex) {
          const command = algorithms[stepIndex];

          if (command.type === "if-condition") {
            console.log(`ループ内で if-condition を検出 (Index: ${stepIndex})`);
            const conditionResult = evaluateCondition(command.condition);
            if (conditionResult) {
              console.log("if 条件成立: 実行");
              stepIndex++; // **if の中の処理を実行**
            } else {
              console.log("if 条件不成立: else にジャンプ");
              const elseIndex = findElseBlockIndex(stepIndex);
              if (elseIndex !== -1) {
                stepIndex = elseIndex + 1;
              }
            }
          } 
          
          executeNextStep(command, () => {
            stepIndex++;
            executeStep();
          });

        } else {
          loopIndex++;
          executeLoopStep();
        }
      }
      executeStep();
    } else {
      callback();
    }
  }
  executeLoopStep();
}






function executeNextStep(command, callback) {
  console.log("executeNextStep - 実行開始");
  console.log("コマンド情報:", command);

  if (!isAlgorithmRunning) {
    console.log("アルゴリズムが停止中のため処理を終了します");
    return; // アルゴリズムが停止中なら処理しない
  }

  // 現在のコマンドを設定
  currentCommand = { abort: false }; // 中断フラグをリセット
  console.log("現在のコマンド設定が完了:", currentCommand);

  switch (command.type) {
    case "1": // 前進
      console.log("前進処理開始");
      let forwardSteps = command.count || 1; // 前進の回数（デフォルト1回）
      console.log("前進回数:", forwardSteps);

      function forwardLoop() {
        console.log("forwardLoop - 実行中");
        if (!isAlgorithmRunning || currentCommand.abort) {
          console.log("前進が中断されました");
          return; // 中断時に停止
        }
        if (forwardSteps > 0) {
          moveForward();
          console.log("moveForward 実行完了");
          forwardSteps--;
          console.log("残り前進回数:", forwardSteps);
          setTimeout(forwardLoop, 300); // 前進後に次のループ
        } else {
          console.log("前進完了 - 次のコマンドへ");
          if (callback) { // callbackが存在するか確認してから呼び出し
            callback();
          }
        }
      }
      forwardLoop();
      break;

    case "2": // 後退
      console.log("後退処理開始");
      let backwardSteps = command.count || 1; // 後退の回数（デフォルト1回）
      console.log("後退回数:", backwardSteps);

      function backwardLoop() {
        console.log("backwardLoop - 実行中");
        if (!isAlgorithmRunning || currentCommand.abort) {
          console.log("後退が中断されました");
          return; // 中断時に停止
        }
        if (backwardSteps > 0) {
          moveBackward();
          console.log("moveBackward 実行完了");
          backwardSteps--;
          console.log("残り後退回数:", backwardSteps);
          setTimeout(backwardLoop, 300); // 後退後に次のループ
        } else {
          console.log("後退完了 - 次のコマンドへ");
          callback(); // 全ての後退が終了したら次のコマンドへ
        }
      }
      backwardLoop();
      break;

    case "3": // ジャンプ
      console.log("ジャンプ処理開始");
      let jumpSteps = command.count || 1; // ジャンプの回数（デフォルト1回）
      console.log("ジャンプ回数:", jumpSteps);

      function jumpLoop() {
        console.log("jumpLoop - 実行中");
        if (!isAlgorithmRunning || currentCommand.abort) {
          console.log("ジャンプが中断されました");
          return; // 中断時に停止
        }
        if (jumpSteps > 0) {
          jump();
          console.log("ジャンプ 実行完了");
          jumpSteps--;
          console.log("残りジャンプ回数:", jumpSteps);
          setTimeout(jumpLoop, 1000); // ジャンプ後に次のループ
        } else {
          console.log("ジャンプ完了 - 次のコマンドへ");
          callback(); // 全てのジャンプが終了したら次のコマンドへ
        }
      }
      jumpLoop();
      break;

    case "4": // 停止
      console.log("停止処理開始");
      let stopSteps = command.count || 1; // 停止の回数（デフォルト1秒停止）
      console.log("停止時間:", stopSteps);

      function stopLoop() {
        console.log("stopLoop - 実行中");
        if (!isAlgorithmRunning || currentCommand.abort) {
          console.log("停止が中断されました");
          return; // 中断時に停止
        }
        if (stopSteps > 0) {
          stopCharacter();
          console.log("stopCharacter 実行完了");
          stopSteps--;
          console.log("残り停止回数:", stopSteps);
          setTimeout(stopLoop, 1000); // 停止後に次のループ
        } else {
          console.log("停止完了 - 次のコマンドへ");
          callback(); // 全ての停止が終了したら次のコマンドへ
        }
      }
      stopLoop();
      break;

      case "if-condition":
      console.log("条件評価中:", command.condition);

      if (evaluateCondition(command.condition)) {
        console.log("if 条件成立: if 内の処理を実行");

        executeIfBlock(command.index, () => {
          console.log("if 内の処理完了, else をスキップして if-end へ");
          let ifEndIndex = findIfEndBlockIndex(command.index);
          if (ifEndIndex !== -1) {
            currentIndex = ifEndIndex + 1;
          }
          executeNext();
        });
      } else {
        console.log("if 条件不成立: else ブロックを探します");
        let elseIndex = findElseBlockIndex(command.index);
        if (elseIndex !== -1) {
          currentIndex = elseIndex + 1;
        } else {
          let ifEndIndex = findIfEndBlockIndex(command.index);
          if (ifEndIndex !== -1) {
            currentIndex = ifEndIndex + 1;
          }
        }
        executeNext();
      }
      break;

    case "if-end":
      console.log("if文終了処理");
      callback(); // 次のコマンドに進む
      break;

      case "else":
        console.log("else文処理を実行します");
        callback();
        break;

      case "loop-start": // ループ開始
      console.log("ループ処理開始");
      handleLoop(
        getCommandsFromProgramArea(),
        command.index + 1,
        command.loopEndIndex - 1,
        command.loopCount,
        callback
      );
      break;

    case "loop-end":
      console.log("ループ終了 - 次のコマンドへ");
      callback();
      break;

    default:
      console.log("未知のコマンド - 次のコマンドへ");
      if(callback)callback();
  }
}


function executeIfBlock(ifIndex, callback) {
  let stepIndex = ifIndex + 1;

  function executeStep() {
    if (
      stepIndex < commands.length &&
      commands[stepIndex].type !== "else" &&
      commands[stepIndex].type !== "if-end"
    ) {
      const command = commands[stepIndex];
      console.log(`if 内のコマンド実行: ${command.type}`);

      stepIndex++;
      executeNextStep(command, executeStep);
    } else {
      callback();
    }
  }

  executeStep();
}

function stopCharacter(callback) {
  // 現在のキー入力をすべて解除
  Keyb.Right = false;
  Keyb.Left = false;
  Keyb.ABUTTON = false;

  // キャラクターの速度をリセット
  ojisan.vx = 0; // 横方向の速度を0に
  ojisan.vy = 0; // 縦方向の速度を0に

  // キャラクターを直立状態に変更（スプライト番号を設定）
  ojisan.sprite = 0; // スプライトの番号を直立状態に


  // 1秒間停止した後、次の処理を実行
  setTimeout(() => {
    if (callback) callback();
  }, 1000);
}

function evaluateCondition(condition) {
  console.log(`条件評価中: ${condition}`);
  switch (condition) {
    case "block":
      return checkForBlock(); // 目の前にブロックがあるか確認
    case "hole":
      return checkForHole(); // 目の前に穴があるか確認
    default:
      console.warn("未知の条件:", condition);
      return false; // 不明な条件は常に false
  }
}

function findElseBlockIndex(ifBlockIndex) {
  console.log(`elseブロックを検索しています (開始index: ${ifBlockIndex})`);
  const commands = getCommandsFromProgramArea(); // プログラムエリア内のコマンドを取得
  for (let i = ifBlockIndex + 1; i < commands.length; i++) {
    if (commands[i].type === "else") {
      console.log(`elseブロックが見つかりました (index: ${i})`);
      return i;
    }
    // if-endに到達したら検索を終了
    if (commands[i].type === "if-end") {
      console.log("elseブロックが見つかりませんでした (if-endに到達)");
      return -1;
    }
  }
  console.log("elseブロックが見つかりませんでした");
  return -1;
}



function getCommandLabel(command) {
  switch (command) {
    case "1":
      return "前進";
    case "2":
      return "後退";
    case "3":
      return "ジャンプ";
    case "loop-start":
      return "[ ループ開始";
    case "loop-end":
      return "] ループ終了";
    case "if-condition":
      return "if (条件)";
    case "else":
      return "else (条件が成立しない場合)";
    case "4":
      return "停止";
      case "if-end":
        return "if文終了";
    default:
      return "不明なコマンド";
  }
}



// アルゴリズム選択肢を配列に変換
function getSelectedAlgorithms() {
  const selects = document.querySelectorAll('#sidebar select'); // 選択されたアルゴリズムを取得
  let algorithms = []; // アルゴリズムの配列
  selects.forEach(select => {
    algorithms.push(select.value); // 選択されたアルゴリズムを配列に追加
  });
  return algorithms; // 配列を返す
}


// グローバル変数
let commands = [];


// executeNext 関数のグローバル定義
function executeNext() {
  console.log(`executeNext - 現在のインデックス: ${currentIndex}`);

  if (!isAlgorithmRunning) {
    console.log("アルゴリズムの実行が停止されています。");
    return;
  }

  if (currentIndex < commands.length) {
    const command = commands[currentIndex];
    console.log("現在のコマンド:", command);

    currentIndex++; // 次のコマンドに進む

    // **if 文の処理**
    if (command.type === "if-condition") {
      console.log("条件コマンドの処理開始");
      const conditionResult = evaluateCondition(command.condition);

      if (conditionResult) {
        console.log("if 条件成立: if 内の処理を実行");

        // **if 内の処理を全て実行**
        executeIfBlock(command.index, () => {
          console.log("if 内の処理完了, else をスキップして if-end へ");
          currentIndex = findIfEndBlockIndex(command.index); // if-end へスキップ
          if (currentIndex !== -1) {
            currentIndex++;
          }
          executeNext();
        });

        return;
      } else {
        console.log("if 条件不成立: else ブロックを探します。");
        const elseIndex = findElseBlockIndex(command.index);
        if (elseIndex !== -1) {
          currentIndex = elseIndex + 1;
        }
        executeNext();
        return;
      }
    }

    // **通常コマンド (ジャンプ, 前進など)**
    else if (command.type === "jump") {
      console.log("ジャンプ処理を実行");
      executeJump(command.count, executeNext);
      return;
    } 
    
    else if (command.type === "forward") {
      console.log("前進処理を実行");
      executeMoveForward(command.count, executeNext);
      return;
    }
    
    // **else 文の処理**
    else if (command.type === "else") {
      console.log("else ブロック: 次のコマンドを実行します。");
      executeNext();
      return;
    } 
    
    // **if-end の処理**
    else if (command.type === "if-end") {
      console.log("if 文終了処理");
      executeNext();
      return;
    }

    // **ループ処理**
    else if (command.type === "loop-start") {
      console.log("ループ処理を開始します");
      handleLoop(
        commands,
        command.index + 1,
        command.loopEndIndex - 1,
        command.loopCount,
        () => {
          console.log(`ループ回数 ${command.loopCount} 回 終了`);
          currentIndex = command.loopEndIndex + 1;
          executeNext();
        }
      );
      return;
    } 
    
    // **ループ終了**
    else if (command.type === "loop-end") {
      console.log("ループ終了 - ループ開始に戻る処理");

      const loopStartCommand = commands.find(
        (cmd) => cmd.type === "loop-start" && cmd.loopEndIndex === command.index
      );

      if (loopStartCommand) {
        if (loopStartCommand.executedLoops === undefined) {
          loopStartCommand.executedLoops = 0;
        }
        loopStartCommand.executedLoops++;

        if (loopStartCommand.executedLoops < loopStartCommand.loopCount) {
          console.log(`ループ継続: ${loopStartCommand.executedLoops}/${loopStartCommand.loopCount}`);
          currentIndex = loopStartCommand.index; // ループの開始位置に戻る
        } else {
          console.log("ループが完了しました");
          currentIndex++; // ループ終了後、次のコマンドへ進む
        }
        executeNext();
        return;
      } else {
        console.log("ループ開始コマンドが見つかりませんでした。次のコマンドへ。");
        executeNext();
        return;
      }
    } 
    
    else {
      console.log("通常コマンドの実行");
      executeNextStep(command, executeNext);
      return;
    }
  } else {
    console.log("アルゴリズムの実行が完了しました。");
    onAlgorithmComplete();
  }
}





function executeAlgorithmSequence() {
  console.log("executeAlgorithmSequence - 開始");

  if (isGameOver || !isAlgorithmRunning) {
    console.log("ゲームオーバーまたは停止中のため、アルゴリズムを実行しません。");
    return;
  }

  commands = getCommandsFromProgramArea(); // プログラムエリアのコマンドを取得
  currentIndex = 0; // インデックスを初期化

  executeNext(); // 最初のコマンドを実行
}


function findIfEndBlockIndex(ifBlockIndex) {
  console.log(`if-endブロックを検索しています (開始index: ${ifBlockIndex})`);
  const commands = getCommandsFromProgramArea(); // プログラムエリア内のコマンドを取得
  for (let i = ifBlockIndex + 1; i < commands.length; i++) {
    if (commands[i].type === "if-end") {
      console.log(`if-endブロックが見つかりました (index: ${i})`);
      return i; // 見つかった場合、そのインデックスを返す
    }
  }
  console.log("if-endブロックが見つかりませんでした");
  return -1; // 見つからなかった場合は-1を返す
}




// 現在実行中のブロックに .active クラスを追加
function highlightActiveBlock(index) {
  const blocks = programArea.querySelectorAll('.block');
  blocks.forEach(block => block.classList.remove('active')); // すべてのブロックから .active を削除
  if (blocks[index]) {
    blocks[index].classList.add('active'); // 現在のブロックに .active を追加
    blocks[index].scrollIntoView({ behavior: 'smooth', block: 'center' }); // ブロックを中央に表示
  }
}



/*-------------------------------------------ボタンが押されたときの処理-------------------------------------------------*/
// スタートボタンが押されたときの処理
// スタートボタンが押されたときの処理
document.getElementById('start-btn').addEventListener('click', function () {
  console.log("スタートボタンが押されました。");

  if (isGameOver) {
    console.log("ゲームオーバー中は開始できません。");
    return;
  }

  if (isAlgorithmRunning) {
    console.log("アルゴリズム実行中です。");
    return;
  }

  // 🔥 スタート時にループと if 文のバランスをチェック
  if (!validateAlgorithmStructure()) {
    return; // 不正な構造なら実行せずに終了
  }

  startTimer();
  resetAlgorithmState();

  console.log("アルゴリズムを新規に開始します。");
  isAlgorithmRunning = true; // フラグをここで再設定
  executeAlgorithmSequence();
});

function validateAlgorithmStructure() {
  const commands = getCommandsFromProgramArea();

  let loopStartCount = 0;
  let loopEndCount = 0;
  let ifConditionCount = 0;
  let ifEndCount = 0;

  commands.forEach(command => {
    if (command.type === "loop-start") loopStartCount++;
    if (command.type === "loop-end") loopEndCount++;
    if (command.type === "if-condition") ifConditionCount++;
    if (command.type === "if-end") ifEndCount++;
  });

  // ループの開始と終了が一致しない場合に警告を表示
  if (loopStartCount !== loopEndCount) {
    alert("⚠️ ループの開始 (loop-start) と終了 (loop-end) の数が一致していません！\n正しくブロックを追加してください。");
    return false; // 実行を中止
  }

  // if文の開始と終了が一致しない場合に警告を表示
  if (ifConditionCount !== ifEndCount) {
    alert("⚠️ if文の開始 (if-condition) に対応する if文終了 (if-end) がありません！\n正しくブロックを追加してください。");
    return false; // 実行を中止
  }

  return true; // 問題なければ実行続行
}





function resetAlgorithmState() {
  console.log("resetAlgorithmState 開始...");

  try {
    console.log("isAlgorithmRunning をリセット");
    isAlgorithmRunning = false;

    console.log("isPaused をリセット");
    isPaused = false;

    console.log("実行中のタイマーをクリア");
    if (currentTimeouts) {
      currentTimeouts.forEach(timeout => clearTimeout(timeout));
      currentTimeouts = [];
    }

    console.log("現在のコマンド情報をリセット");
    currentCommand = null;

    console.log("コマンドインデックスを初期化");
    currentIndex = 0;

    console.log("resetAlgorithmState 完了");
  } catch (error) {
    console.error("resetAlgorithmState 中にエラーが発生:", error);
  }
}





// // ストップボタンが押されたときの処理
// document.getElementById('stop-btn').addEventListener('click', function() {
//   isPaused = true; // 停止状態に設定
//   clearTimeout(currentTimeout); // 現在のタイマーをクリア
//   stop(); // キャラクターの動作を停止
// });

// リセットが確定したら画面をリロードしてモーダルを閉じる
document.getElementById('confirm-reset').addEventListener('click', function() {
  alert("リセットしました！"); // リセット完了のメッセージを表示
  document.getElementById('reset-modal').style.display = 'none'; // モーダルを非表示
  location.reload(); // ページをリロード
  onAlgorithmComplete();
});

// 目の前のブロックがあるか確認
function checkForBlock() {
  const frontX = (ojisan.x >> 4) + 36; // キャラクターの1マス前
  const frontY = ojisan.y >> 4; // 現在のY位置
  return field.isBlock(frontX, frontY); // その位置にブロックがあるか確認
}

function checkForHole() {
  const frontX = (ojisan.x >> 4) + 14; // キャラクターの1マス前のX座標
  const groundY = (ojisan.y >> 4) + 32; // キャラクターの2マス下のY座標
  return field.isHole(frontX, groundY); // Field クラスの isHole メソッドを使用
}






/*----------------------------------------メイン画面の更新処理----------------------------------*/

// 更新処理
function update() {
  field.update(); // マップの更新
  updateObj(block); // ブロックの更新
  updateObj(item); // アイテムの更新
  ojisan.update(); // おじさんの更新
  checkOutOfScreen(); // 画面外判定を追加
}

// スプライトの描画
function drawSprite(snum, x, y) {
  let sx = (snum & 15) * 16; // スプライトX座標を計算
  let sy = (snum >> 4) * 16; // スプライトY座標を計算
  vcon.drawImage(chImg, sx, sy, 16, 32, x, y, 16, 32); // スプライトを描画
}

// オブジェクトの描画
function drawObj(obj) {
  for (let i = 0; i < obj.length; i++) {
    obj[i].draw(); // 各オブジェクトの描画
  }
}





/*----------------------------------------メイン画面の描画処理----------------------------------*/

// 描画処理
// メインの描画処理
function draw() {
  vcon.fillStyle = "#66AAFF"; // 背景色を設定 (水色)
  vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H); // 画面をクリア

  field.draw();      // マップの描画
  drawObj(block);    // ブロックの描画
  drawObj(item);     // アイテムの描画
  ojisan.draw();     // Ojisanインスタンスの描画


  // 仮想画面から実画面へ転送
  con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SCREEN_SIZE_W * 2, SCREEN_SIZE_H * 2);
}




/*----------------------------------------メイン画面でずっと行われる処理----------------------------------*/

// メインループ
function mainLoop() {
  let nowTime = performance.now(); // 現在の時間を取得
  let nowFrame = (nowTime - startTime) / GAME_FPS; // フレーム数を計算

  if (nowFrame > frameCount) {
    let c = 0;
    while (nowFrame > frameCount) {
      frameCount++; // フレームカウントをインクリメント
      update(); // 更新処理を実行
      if (++c >= 4) break; // 4回以上の処理を防止
    }

    draw(); // 描画処理を実行
  }
  requestAnimationFrame(mainLoop); // 次のフレームをリクエスト
}




/*-------------------アルゴリズムを保存してリロードするコード----------------*/

// アルゴリズム情報を保存する
let savedAlgorithms = [];

function saveAlgorithmData() {
  savedAlgorithms = getSelectedAlgorithms(); // 現在選択されているアルゴリズムを保存
}

function restoreAlgorithmData() {
  const selects = document.querySelectorAll('#select-container select'); // select要素を取得
  savedAlgorithms.forEach((algorithm, index) => {
    if (selects[index]) {
      selects[index].value = algorithm; // 保存しておいたアルゴリズムを復元
    }
  });
}



/*--------------ゲームオーバーのコード--------------------*/



let lives = 3; // 残機を3に設定
let isGameOver = false; // ゲームオーバーフラグ


// 実行中のアルゴリズム関連の状態管理
let isAlgorithmRunning = false; // アルゴリズムの実行状態
let currentTimeouts = []; // 実行中のタイマーリスト

// 安全なタイマー設定関数
function safeSetTimeout(callback, delay) {
  if (!isAlgorithmRunning) return; // アルゴリズム停止中はタイマーを設定しない

  const timeout = setTimeout(() => {
    if (isAlgorithmRunning) callback(); // 実行中のみコールバックを呼び出し
    // 実行が終わったタイマーをリストから削除
    currentTimeouts = currentTimeouts.filter(t => t !== timeout);
  }, delay);

  currentTimeouts.push(timeout); // タイマーをリストに追加
}

// アルゴリズムの停止処理
function stopAllAlgorithms() {
  isAlgorithmRunning = false; // アルゴリズム実行フラグを解除

  // 実行中のすべてのタイマーをクリア
  currentTimeouts.forEach(timeout => clearTimeout(timeout));
  currentTimeouts = []; // タイマーリストをリセット

  // 実行中のステップも強制停止
  if (currentCommand) {
    currentCommand.abort = true; // 現在のコマンドの実行を中断するフラグ
  }

  console.log("すべてのアルゴリズムを即時停止しました");
}

function updateLifeIcons() {
  const lifeDisplay = document.getElementById('life-display');

  // 初期化: 既存のアイコンをクリア
  lifeDisplay.innerHTML = '<span id="life-text">Life:</span>'; // テキストを再設定

  // 残機数分のアイコンを生成して追加
  for (let i = 0; i < lives; i++) {
    const lifeIcon = document.createElement('img');
    lifeIcon.src = '../img/school/icon.png'; // 画像のパス
    lifeIcon.alt = 'Life Icon';
    lifeIcon.style.width = '48px'; // 必要に応じて調整
    lifeIcon.style.height = '48px';
    lifeDisplay.appendChild(lifeIcon); // ライフアイコンを追加
  }
}



// 残機が減った時の処理
function onLifeLost() {
  console.log("残機減少処理開始");

  stopAllAlgorithms(); // 実行中のアルゴリズムを停止

  lives--;
  console.log(`残機が減りました。現在の残機: ${lives}`);
  updateLifeIcons();
  if (lives > 0) {
      showLifePopup(`残りの残機:`);
      setTimeout(() => {
          hideLifePopup();
          resetTimer();
          resetPosition(); // キャラクターを初期位置にリセット
      }, 2000); // 2秒後にポップアップを閉じてゲームをリセット
  } else {
      showLifePopup("GAME OVER");
      setTimeout(() => {
          hideLifePopup();
          gameOver(); // ゲームオーバー処理
      }, 1000);
  }
}



function showLifePopup(message) {
  const overlay = document.getElementById('popup-overlay');
  const popup = document.getElementById('life-popup');
  const messageElement = document.getElementById('life-message');
  const iconsContainer = document.getElementById('life-icons');

  // メッセージを設定
  messageElement.textContent = message;

  // 残りライフに合わせて画像を設定
  iconsContainer.innerHTML = ''; // 既存のアイコンをクリア
  for (let i = 0; i < lives; i++) {
    const lifeIcon = document.createElement('img');
    lifeIcon.src = '../img/school/icon.png'; // 適切な画像パスに変更
    lifeIcon.alt = 'Life Icon';
    iconsContainer.appendChild(lifeIcon);
  }

  // オーバーレイとポップアップを表示
  overlay.style.display = 'flex';

  // 2秒後に非表示
  setTimeout(() => {
    hideLifePopup();
  }, 2000);
}

function hideLifePopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay.style.display = 'none';
}



// キャラクターの初期位置にリセット
function resetPosition() {
  // キャラクターの位置と速度をリセット
  ojisan.x = initialPositionX; // X座標を初期位置に
  ojisan.y = initialPositionY; // Y座標を初期位置に
  ojisan.vx = 0; // 横方向の速度をリセット
  ojisan.vy = 0; // 縦方向の速度をリセット

  // カメラの位置をリセット
  field.scx = 0; // カメラのX位置を初期化
  field.scy = 0; // カメラのY位置を初期化

  // ジャンプや地面状態のフラグをリセット
  ojisan.isJumping = false;
  ojisan.isOnGround = true;

  // 残留キー入力をリセット
  Keyb = {
    Right: false,
    Left: false,
    ABUTTON: false,
  };

  console.log("キャラクターとカメラを初期位置にリセットしました");
}


// ゲームオーバー処理
function gameOver() {
  isGameOver = true; // ゲームオーバーフラグを立てる
  stopAllAlgorithms(); // アルゴリズムを完全停止
  location.href = '../html/gameover.html'; // gameover.html にリダイレクト
}



/*-----------------------カットイン読み込み-------------------------- */

// カットインHTMLを動的に読み込む
function loadCutIn() {
  fetch('../html/cutin.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data); // bodyにカットインを挿入
    })
    .catch(error => console.error('カットインの読み込みエラー:', error)); // エラーハンドリング
}

// 残機が減ったときにカットインを表示
function checkOutOfScreen() {
  if (ojisan.y > SCREEN_SIZE_H * 16 || ojisan.x < 0 || ojisan.x > SCREEN_SIZE_W * 16) {
    onLifeLost(); // 残機を減らし、アルゴリズム停止とリセットを実行
    if (lives > 0) {
      resetPosition(); // キャラクターを初期位置に戻す
    } else {
      gameOver(); // ゲームオーバー処理
    }
  }
}

// ページロード時にカットインを読み込む
document.addEventListener('DOMContentLoaded', function() {
  loadCutIn(); // カットインのHTMLを読み込む
});




// -------------------------------------------------------タイマー関連変数--------------------------------------------------------------------------------
let timerInterval = null;
let elapsedTime = 0; // 経過時間をミリ秒単位で保持

// タイマーを開始する関数
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      elapsedTime += 100; // 100ミリ秒（0.1秒）を加算
      updateTimerDisplay();
    }, 100); // 100ミリ秒ごとに更新
  }
}

// タイマーを停止する関数
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null; // タイマーをクリア
}

// タイマーをリセットする関数
function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  updateTimerDisplay();
}

// タイマー表示を更新する関数
function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer-display");
  const seconds = Math.floor(elapsedTime / 1000); // 秒単位
    const milliseconds = Math.floor((elapsedTime % 1000) / 100); // 100ミリ秒単位
    timerDisplay.textContent = `Time: ${seconds}.${milliseconds} s`;
    console.log(`タイマー更新: ${elapsedTime}ms`);
}

// DOMContentLoaded時にタイマー表示を初期化
document.addEventListener("DOMContentLoaded", () => {
  updateTimerDisplay();
});
// 音声オブジェクトを事前に作成してロード
const startAudio = new Audio('../sounds/決定ボタンを押す44.mp3');






function onAlgorithmComplete() {
  console.log("アルゴリズム完了処理開始");
  stopTimer(); // タイマーを停止
  isAlgorithmRunning = false; // フラグをリセット
  console.log("isAlgorithmRunning をリセット");

  setTimeout(() => {
    resetGame();
    resetTimer();
  }, 2000);
}







//エフェクトやちょっとした動きだよ

document.getElementById('reset-btn').addEventListener('click', function() {
  // リセットボタンが押されたらモーダルを表示
  document.getElementById('reset-modal').style.display = 'flex';
});

document.getElementById('cancel-reset').addEventListener('click', function() {
  // 取り消しボタンでモーダルを閉じる
  document.getElementById('reset-modal').style.display = 'none';
});

document.getElementById('confirm-reset').addEventListener('click', function() {
  // リセットが確定したらアクションを実行してモーダルを閉じる
  document.getElementById('reset-modal').style.display = 'none';
});

function showGoalPopup() {
      const goalPopup = document.getElementById('goal-popup');
      goalPopup.style.display = 'block';
  }

//----------------------------------------マップの表示動作----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const mapModal = document.getElementById('map-modal');
  const mapPopupBtn = document.getElementById('map-popup-btn');
  const closeMapBtn = document.getElementById('close-map-btn');
  const mapImage = document.getElementById('map-image');

  // 要素が正しく取得できない場合、エラーを表示して終了
  if (!mapModal || !mapPopupBtn || !closeMapBtn || !mapImage) {
    console.error('必要な要素が見つかりません。');
    return;
  }

  // MAPボタンを押したときの処理
  mapPopupBtn.addEventListener('click', () => {
    console.log('MAPボタンがクリックされました');
    mapModal.classList.remove('hidden'); // モーダル表示
  });

  // 閉じるボタンを押したときの処理
  closeMapBtn.addEventListener('click', () => {
    console.log('閉じるボタンがクリックされました');
    mapModal.classList.add('hidden'); // モーダル非表示
  });

  // モーダル背景をクリックして非表示にする
  mapModal.addEventListener('click', (event) => {
    if (event.target === mapModal) {
      console.log('モーダルの背景がクリックされました');
      mapModal.classList.add('hidden');
    }
  });

  // 画像のパスを明示的に確認
  console.log('画像のパス:', mapImage.src);
});






//----------------------------------------
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



