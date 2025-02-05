let imgArray = new Array("Big-suzuki.png", "Big-suzukiMigi.png", "Big-suzuki.png", "Big-suzukiHidari.png"); //*1
let count = -1; //*2
imgTimer();

function imgTimer() {
  // 画像番号をインクリメント
  count++; //*3
  
  // 画像の枚数確認
  if (count == imgArray.length) count = 0; //*4
  
  // 画像の変更（img 要素の src を変更）
  document.querySelector(".main-img-suzuki").src = `./img/${imgArray[count]}`; //*5
  
  // 次のタイマー呼びだし
  setTimeout(imgTimer, 100); //*6
}