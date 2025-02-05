
// 定数の設定
const ANIME_JUMP = 8;    // ジャンプ中のアニメーション識別子
const ANIME_WALK = 2;    // 歩行中のアニメーション識別子
const ANIME_STAND = 1;   // 立ち止まっている状態のアニメーション識別子
const ANIME_BRAKE = 4;   // ブレーキ中のアニメーション識別子
const GRAVITY = 4;       // 重力の加速度
const MAX_SPEED = 16;    // 横移動の最大速度

// キャラクタークラスの定義
class Ojisan {
    constructor(x, y) {
        this.x = x;         // X座標
        this.y = y;         // Y座標
        this.w = 16;
        this.h = 32; //高さ
        this.vx = 0;        // X方向の速度
        this.vy = 0;        // Y方向の速度
        this.anim = 0;      // 現在のアニメーション状態
        this.snum = 0;      // スプライト番号
        this.acou = 0;      // アニメーションカウント
        this.dirc = 0;      // 向き (0: 右, 1: 左)
        this.jump = 0;      // ジャンプ状態のフラグ
        this.isGoal = false; // ゴールに到達したかのフラグ
        this.isJumping = false; // 現在ジャンプ中かどうか
        this.isOnGround = true; // 地面にいるかどうか
        this.kinoko = 0;
        this.isFalling = false; // 落下中フラグを初期化
        this.isHitByEnemy = false; // 接触フラグを初期化
    }

    // 目の前にブロックがあるかを判定するメソッド
    isBlockInFront() {
        // 16ピクセル先の座標を取得 (右方向)
        const frontX = (this.x >> 4) + 1; // ojisanの16ピクセル先
        const frontY = this.y >> 4;      // 現在のY座標
    
        // マップデータ(fieldData)を確認
        if (frontX >= 0 && frontY >= 0 && frontX < FIELD_SIZE_W && frontY < FIELD_SIZE_H) {
            const blockValue = fieldData[frontY * FIELD_SIZE_W + frontX];
    
            // ブロックがあるかどうかを判定 (-1でなければブロックあり)
            return blockValue !== -1;
        }
    
        // 範囲外の場合はブロックなし
        return false;
    }


     // 床の判定
     checkFloor() {
        if (this.vy <= 0) return;  // キャラクターが上昇中なら何もせず終了

        let lx = this.x >> 4;              // X座標のマップチップ位置
        let ly = (this.y + this.vy) >> 4;  // 次のフレームでのY座標のマップチップ位置

        // ゴールブロック判定
        if (this.checkGoalBlock(lx + 1, ly + 31) || this.checkGoalBlock(lx + 14, ly + 31)) {
            this.vy = 0;                           // Y方向の速度をリセット
            this.y = ((((ly + 31) >> 4) << 4) - 32) << 4;  // Y位置をブロック上に調整
            this.isOnGround = true; // 地面にいる状態に
            this.isJumping = false; // ジャンプを終了状態に
            return;
        }

        // 通常ブロックの判定
        if (field.isBlock(lx + 1, ly + 31) || field.isBlock(lx + 14, ly + 31)) {
            if (this.anim === ANIME_JUMP) this.anim = ANIME_WALK; // ジャンプアニメーションから歩行に変更
            this.jump = 0;                 // ジャンプ状態をリセット
            this.vy = 0;                   // Y方向の速度をリセット
            this.y = ((((ly + 31) >> 4) << 4) - 32) << 4;  // Y位置をブロック上に調整
            this.isOnGround = true; // 地面にいる状態に
            this.isJumping = false; // ジャンプを終了状態に
        }
    }


   // 天井の判定
   checkCeil() {
    if (this.vy >= 0) return;  // キャラクターが下降中でないなら終了

    let lx = ((this.x + this.vx) >> 4);   // X座標のマップチップ位置
    let ly = ((this.y + this.vy) >> 4);   // 次フレームでのY座標のマップチップ位置

    // 天井にブロックがあるか確認
    let bl = field.isBlock(lx + 8, ly + 5);
    if (bl && bl !== -1) {  // ブロックが存在する場合
        console.log("ブロック判定")
        this.jump = 15;                  // ジャンプ状態を保持
        this.vy = 0;                     // Y方向の速度をリセット
        this.isJumping = false;          // ジャンプを終了状態に

        let x = (lx + 8) >> 4;
        let y = (ly + 5) >> 4;

        if (bl === 368) {
            // アイテム生成とスプライト切り替えを分離
            this.handleBlockChangeWithItem(x, y, bl, 498, 218); // 218はアイテムのID
        } else if (bl === 371 && 466) {
            // 壊れるブロックの一般処理
            console.log("ぶろっくこわれろおおおおおおおおお");
            block.push(new Block(bl, x, y, 1, 20, -60));
            block.push(new Block(bl, x, y, 1, -20, -60));
            block.push(new Block(bl, x, y, 1, 20, -20));
            block.push(new Block(bl, x, y, 1, -20, -20));
        }
    }
}

// アイテム生成とスプライト切り替えを統合
handleBlockChangeWithItem(x, y, currentBlock, newBlock, itemID) {
    const blockIndex = y * FIELD_SIZE_W + x;

    // アイテム生成
    item.push(new Item(itemID, x, y, 0, 0)); // アイテムを生成

    // スプライト切り替え（遅延適用も可能）
    setTimeout(() => {
        fieldData[blockIndex] = newBlock; // スプライトを切り替え
    }, 100); // アニメーション終了後の切り替え時間 (100ms)
}



    // 壁の判定
    checkWall() {
        let lx = (this.x + this.vx) >> 4;    // 次フレームのX座標のマップチップ位置
        let ly = (this.y + this.vy) >> 4;    // 次フレームのY座標のマップチップ位置

        // ゴールブロックの判定
        if (this.checkGoalBlock(lx + 15, ly + 9) || 
            this.checkGoalBlock(lx + 15, ly + 15) || 
            this.checkGoalBlock(lx + 15, ly + 24)) {
            this.vx = 0;                     // X方向の速度をリセット
            this.x -= 8;                     // X位置を調整
            return;
        }

        if (this.checkGoalBlock(lx, ly + 9) || 
            this.checkGoalBlock(lx, ly + 15) || 
            this.checkGoalBlock(lx, ly + 24)) {
            this.vx = 0;
            this.x += 8;                     // X位置を調整
            return;
        }

        // 通常の壁判定
        if (field.isBlock(lx + 15, ly + 9) || 
            field.isBlock(lx + 15, ly + 15) || 
            field.isBlock(lx + 15, ly + 24)) {
            this.vx = 0;                     // X方向の速度をリセット
            this.x -= 8;                     // X位置を調整
        } else if (field.isBlock(lx, ly + 9) || 
                   field.isBlock(lx, ly + 15) || 
                   field.isBlock(lx, ly + 24)) {
            this.vx = 0;
            this.x += 8;
        }

        // 敵キャラブロックの判定
    if (this.checkEnemyBlock(lx + 15, ly + 9) || 
    this.checkEnemyBlock(lx + 15, ly + 15) || 
    this.checkEnemyBlock(lx + 15, ly + 24)) {
    this.vx = 0;                     // X方向の速度をリセット
    this.x -= 8;                     // X位置を調整
    this.handleEnemyCollision();     // 敵キャラ接触時の処理を実行
    return;
}

if (this.checkEnemyBlock(lx, ly + 9) || 
    this.checkEnemyBlock(lx, ly + 15) || 
    this.checkEnemyBlock(lx, ly + 24)) {
    this.vx = 0;
    this.x += 8;                     // X位置を調整
    this.handleEnemyCollision();     // 敵キャラ接触時の処理を実行
    return;
}
    }

    checkGoalBlock(lx, ly) {
        let block = field.isBlock(lx, ly); // 指定座標にゴールブロックがあるか確認
        if (block === 478 || block === 494) {
            this.isGoal = true; // ゴールフラグを立てる
            console.log("ゴールに到達しました");

            // アルゴリズムを停止
            this.stopAllAlgorithms();
            stopTimer(); 
            

            // ゴール演出を実行
            this.showGoalAnimation(() => {
                // 演出が終わった後にダイアログを表示
                this.showGoalDialog();
            });
            return true;
        }
        return false;
    }

    // アルゴリズムを停止する
    stopAllAlgorithms() {
        console.log("すべてのアルゴリズムを停止しました");
        isAlgorithmRunning = false; // グローバルフラグをリセット

        // 実行中のタイマーを全てクリア
        if (currentTimeouts) {
            currentTimeouts.forEach(timeout => clearTimeout(timeout));
            currentTimeouts = [];
        }
        currentCommand = null; // 現在のコマンド情報をリセット
    }

    // ----------------------------------------ゴール演出を表示する----------------------------------------
    showGoalAnimation(callback) {
        const goalBgmFilePath = '../sounds/goal.wav'; // ゴール演出用の音楽ファイル
    
        // ゴールBGMを再生
    
    
        const duration = 10 * 1000; // 演出の継続時間（15秒）
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
    
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
    
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
    
            const particleCount = 50 * (timeLeft / duration);
            // 画面内でランダムにパーティクルを発生
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    
        // 演出を2秒間実行した後にコールバックを呼び出す
        setTimeout(() => {
            console.log("ゴール演出が終了しました");
            if (callback) callback(); // 演出終了後の処理を呼び出し
        }, 2000);
    }

    // ゴールダイアログを表示する
    showGoalDialog() {
    const goalDialog = document.getElementById('goal-dialog');
    goalDialog.classList.remove('hidden'); // ダイアログを表示

    const scoreScreenBtn = document.getElementById('score-screen-btn');

    // 古いイベントリスナーを削除（必要ならば）
    const newButton = scoreScreenBtn.cloneNode(true);
    scoreScreenBtn.parentNode.replaceChild(newButton, scoreScreenBtn);

    // 新しいイベントリスナーを追加
    newButton.addEventListener('click', async () => {
        try {
            // 保存処理を実行
            await saveAlgorithmToDB();
            console.log("保存成功: スコア画面に遷移します。");
            location.href = '/game/php/score.php'; // スコア画面に遷移
        } catch (error) {
            console.error("保存失敗:", error);
            console.log("保存失敗: スコア画面に遷移します。");
            location.href = '/game/php/score.php'; // スコア画面に遷移
        }
    });
    
}




    //----敵キャラ判定---
    checkEnemyBlock(lx, ly) {
        const block = field.isBlock(lx, ly); // 指定座標のブロックを取得
    
        if ((block === 500 || block === 414 || block === 415 || block === 430 || block === 431) && !this.isHitByEnemy) { // 敵キャラに接触しており、かつ未処理の場合
            console.log("[DEBUG] 敵キャラに接触しました。処理を実行します。");
    
            this.isHitByEnemy = true; // 接触フラグを立てる
            this.handleEnemyCollision(); // 接触処理を実行
    
            return true;
        }
        return false;
    }


    handleEnemyCollision() {
        console.log("[DEBUG] 敵キャラとの接触処理開始");
    
        if (typeof window.audioManager !== 'undefined') {
            window.audioManager.playSE('../sounds/enemy.mp3'); // 敵接触時の効果音
        } else {
            console.warn("audioManager が未定義です。効果音を再生できません。");
        }
    
        // 残機減少処理が二重に呼ばれないようにチェック
        if (!this.isProcessingLifeLoss) {
            this.isProcessingLifeLoss = true; // 処理中フラグを設定
    
            if (typeof onLifeLost === 'function') {
                onLifeLost(); // 残機を減らす処理を呼び出し
            } else {
                console.error("onLifeLost関数が見つかりません。");
            }
    
            // 一定時間後に接触フラグと処理中フラグをリセット
            setTimeout(() => {
                this.isHitByEnemy = false; // フラグをリセット
                this.isProcessingLifeLoss = false; // 処理中フラグをリセット
                console.log("[DEBUG] 敵キャラ接触フラグをリセットしました。");
            }, 1000); // 必要に応じてタイマーを調整
        } else {
            console.log("[DEBUG] 残機減少処理はすでに実行中です。");
        }
    }

    


  // ジャンプ処理
  updateJump() {
    if (Keyb.ABUTTON && !this.isJumping && this.isOnGround) { // 地面にいてジャンプ中でない時のみジャンプ開始
        this.anim = ANIME_JUMP;         // ジャンプアニメーションを設定
        this.jump = 1;                  // ジャンプ状態を開始
        this.vy = -64;                  // ジャンプ速度を設定
        this.isJumping = true;          // ジャンプ中フラグを設定
        this.isOnGround = false;        // 地面にいない状態に
    }

    if (this.isJumping && this.jump < 15) { // ジャンプ中であれば上昇速度を減少
        this.vy = -(70 - this.jump);
        this.jump++;
    }
}


    // 横方向の移動処理
    updateWalkSub(dir) {
        if (dir === 0 && this.vx < MAX_SPEED) this.vx++;      // 右方向への移動速度を増加
        if (dir === 1 && this.vx > -MAX_SPEED) this.vx--;     // 左方向への移動速度を増加

        if (!this.jump) {                    // ジャンプ中でない場合のみ
            if (this.anim === ANIME_STAND) this.acou = 0;     // 歩行アニメーションをリセット
            this.anim = ANIME_WALK;          // 歩行アニメーションに設定
            this.dirc = dir;                 // 移動方向を設定

            if (dir === 0 && this.vx < 0) this.vx++;
            if (dir === 1 && this.vx > 0) this.vx--;

            if ((dir === 1 && this.vx > 8) || (dir === 0 && this.vx < -8)) {
                this.anim = ANIME_BRAKE;     // 逆方向の場合ブレーキアニメーション
            }
        }
    }

    // 歩行処理
updateWalk() {
    if (this.jump > 0) return;  // ジャンプ中は歩行のアニメーションに切り替えない

    if (Keyb.Left) {                      // 左移動ボタンが押されている場合
        this.updateWalkSub(1);            // 左に移動
    } else if (Keyb.Right) {              // 右移動ボタンが押されている場合
        this.updateWalkSub(0);            // 右に移動
    } else {                              // どちらのボタンも押されていない場合
        if (!this.jump) {                 // ジャンプ中でないならば
            if (this.vx > 0) this.vx -= 1;
            if (this.vx < 0) this.vx += 1;
            if (!this.vx) this.anim = ANIME_STAND;  // 停止時に立ち状態
        }
    }
}

  // アニメーションの更新処理
updateAnim() {
    // ジャンプ中の場合は常にジャンプアニメーションを維持
    if (this.jump > 0) {
        this.anim = ANIME_JUMP;
        this.snum = 6;                     // ジャンプ時のスプライト番号
        return;
    }

    // 立ち、歩行、ブレーキのアニメーション設定
    switch (this.anim) {
        case ANIME_STAND:
            this.snum = 0;
            break;
        case ANIME_WALK:
            this.snum = 2 + ((this.acou / 6) % 3);  // 歩行アニメーション
            break;
        case ANIME_BRAKE:
            this.snum = 5;
            break;
    }
    if (this.dirc) this.snum += 48;   // 左向きのときスプライト番号を調整
}


    // 毎フレームごとの更新処理
    update() {
        let lx = this.x >> 4;
        let ly = this.y >> 4;
    
        // 敵キャラとの接触判定
        if (!this.isHitByEnemy) { // フラグが立っていない場合のみ処理
            this.checkEnemyBlock(lx, ly);
        }


        // キノコを取得した場合の処理（1回のみ実行）
        if (this.kinoko) {
            this.kinoko = false; // 一度処理したらリセット
        }
    
        if (this.isGoal) {                    // ゴールに到達している場合
            this.vx = 0;                      // 横方向の速度をゼロに
            this.vy = 0;                      // 縦方向の速度もゼロに
            return;                           // 更新を終了
        }
    
        this.acou++;                          // アニメーションカウントの増加
        if (Math.abs(this.vx) === MAX_SPEED) this.acou++;  // 速度最大時にカウント追加
    
        this.updateJump();                    // ジャンプの更新
        this.updateWalk();                    // 歩行の更新
        this.updateAnim();                    // アニメーションの更新
    
        if (this.vy < 64) this.vy += GRAVITY; // 重力を適用してY方向の速度を更新
    
        this.checkWall();                     // 壁の判定
        this.checkFloor();                    // 床の判定
        this.checkCeil();                     // 天井の判定

        // 座標の更新
        this.x += this.vx;                    // X座標にX方向の速度を加算
        this.y += this.vy;                    // Y座標にY方向の速度を加算

    }
    





     // 描画メソッド
     draw() {
        let px = (this.x >> 4) - field.scx;   // 仮想キャンバス上のX座標
        let py = (this.y >> 4) - field.scy;   // 仮想キャンバス上のY座標
        drawSprite(this.snum, px, py);        // スプライトの描画
    }
}