/** アイテムのクラス */
class Item extends Sprite {
    // 横の壁チェック
    checkWall() {
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        if (field.isBlock(lx + 15, ly + 3) || 
            field.isBlock(lx + 15, ly + 12) || 
            field.isBlock(lx, ly + 3) || 
            field.isBlock(lx, ly + 12)) {
            this.vx *= -1; // 反転
        }
    }

    // 床の判定
    checkFloor() {
        if (this.vy <= 0) return;

        let lx = (this.x >> 4);
        let ly = ((this.y + this.vy) >> 4);

        if (field.isBlock(lx + 1, ly + 15) || field.isBlock(lx + 14, ly + 15)) {
            this.vy = 0;
            this.y = ((((ly + 15) >> 4) << 4) - 16) << 4;
        }
    }

    // キノコ更新処理
   // キノコ更新処理
update() {
    if (this.kill) return;

    if (checkHit(this, ojisan)) {
        if (!ojisan.kinoko) { // まだキノコを取得していない場合
            ojisan.kinoko = true; // Ojisanにキノコ取得フラグを渡す
            elapsedTime = Math.max(0, elapsedTime - 3000); // **3000ミリ秒 (3秒) 減少**
            updateTimerDisplay(); // タイマー表示を更新
            console.log(`キノコを取得しました！タイマーを3秒減少: ${elapsedTime}ms`);
        }
        this.kill = true; // キノコを無効化（消去する）
        return;
    }
    

    if (++this.count <= 32) { // キノコが上がる速度 32
        this.sz = (1 + this.count) >> 1;
        this.y -= 1 << 3; // 上昇
        if (this.count == 32) this.vx = 10; // キノコが動くスピード
        return;
    }
    this.checkWall();
    this.checkFloor(); // 床のチェック
    super.update(); // スーパークラスの更新を呼び出し
    }
}
