const GAME_FPS = 1000 / 60;
const SCREEN_SIZE_W = 2560; // 画面のサイズ横
const SCREEN_SIZE_H = 300; // 画面のサイズ縦

// 一画面当たりのマップチップのサイズ
const MAP_SIZE_W = SCREEN_SIZE_W / 16;
const MAP_SIZE_H = SCREEN_SIZE_H / 16;

// マップデータのブロックの数
const FIELD_SIZE_W = 256;
const FIELD_SIZE_H = 19;

//当たり判定
function checkHit(obj1, obj2){

  let left1 = (obj1.x>>4)      +2;
  let right1 = left1 + obj1.w  -2;
  let top1  = (obj1.y >> 4)    +5;
  let bottom1 = top1 + obj1.h  -7;

  let left2 = (obj2.x>>4)      +2;
  let right2 = left2 + obj2.w  -2;
  let top2  = (obj2.y >> 4)    +5;
  let bottom2 = top2 + obj2.h  -7;

  return( left1 <= right2 && right1 >= left2 && top1 <= bottom2 && bottom1 >= top2);
}

//スプライトの基本クラス
class Sprite {
  constructor(sp, x, y, vx, vy) {
    this.sp = sp;
    this.x = x << 8;
    this.y = y << 8;
    this.w = 16;
    this.h = 16;
    this.vx = vx;
    this.vy = vy;
    this.sz = 0;
    this.kill = false;
    this.count = 0;
  }

  // 更新処理
  update() {
    if (this.vy < 64) this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    if ((this.y >> 4) > FIELD_SIZE_H * 16) this.kill = true;
  }

  draw() {
    let an = this.sp;
    let sx = (an & 15) << 4;
    let sy = (an >> 4) << 4;
    let px = (this.x >> 4) - field.scx;
    let py = (this.y >> 4) - field.scy;
    let s;
    if(this.sz) s = this.sz;
    else s = 16;
    vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, s);
  }
}
