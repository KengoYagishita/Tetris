// ここから定数

const GAME_SPEED = 300; // 落ちるスピード
const FIELD_COL = 10; // フィールドの列
const FIELD_ROW = 20; // フィールドの行
const BLOCK_SIZE = 30; // ブロック一つのサイズ(ピクセル)
// スクリーンサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;
// テトロミノのサイズ
const TETRO_SIZE = 4;

// テトロミノの色の種類
const TETRO_COLORS = [
    "#000", 		//0.黒
    "#6cf", 		//1.水色
    "#f92", 		//2.オレンジ
    "#66f", 		//3.青
    "#c5c", 		//4.紫
    "#fd2", 		//5.黄色
    "#f44", 		//6.赤
    "#6b5", 		//7.緑
    "#bbb" 			//8.グレー
];

// テトロミノの種類
const TETRO_TYPES =[
    [],             //0.NULL
    [				//1.I
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [				//2.L
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0]
    ],
    [				//3.J
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0]
    ],
    [				//4.T
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ],
    [				//5.O
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [				//6.Z
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ],
    [				//7.S
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]
];

// 初期位置
const START_X = FIELD_COL/2 - TETRO_SIZE/2;
const START_Y = 0;

// ここまで定数

// ここから　初期変数

// テトロミノ本体
let tetro;
// テトロミノの形
let tetro_t;


// テトロミノの座標
let tetro_x = START_X; // x座標
let tetro_y = START_Y; // y座標

// フィールド本体を一次元配列で作成
let field = [];

// ゲームオーバーフラグ
let over = false;

let can = document.getElementById("canvas_e"); // ID"canvas_e"のcanvasの要素を取得して変数canに入れる
let con = can.getContext("2d");

// ここまで　初期変数
 

can.wicth = SCREEN_W;
can.height = SCREEN_H;
can.style.border = "4px solid #555";

// テトロミノの形をランダムに決める
tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
// テトロミノの色をランダムに決める
tetro_c = Math.floor(Math.random() * (TETRO_COLORS.length - 1)) + 1;
tetro = TETRO_TYPES[tetro_t];

init();
drawAll();
// GAME_SPEED(ミリ秒)ごとにdropTetroを呼び出す
setInterval( dropTetro, GAME_SPEED );

// 初期化
function init() {
    // BGM の再生
    document.getElementById('BGM').volume = 0.5;
    document.getElementById('BGM').currentTime = 0;
	document.getElementById('BGM').play();
    // フィールドのクリア
    for(let y = 0; y < FIELD_ROW; y++) {
        field[y] = [];
        for(let x = 0; x < FIELD_COL; x++) {
            field[y][x] = 0;
        }
    }
    // テスト用ブロック
    /*field[3][5] = 1;
    field[16][6] = 1;
    field[16][7] = 1;*/
}

// ブロック1つを描写する
function drawBlock(x,y,c) {
    let px = x * BLOCK_SIZE; // ブロックの表示部分のx座標
    let py = y * BLOCK_SIZE; // ブロックの表示部分のy座標
    con.fillStyle = TETRO_COLORS[c];
    con.fillRect(px,py,BLOCK_SIZE, BLOCK_SIZE); // ブロック部分を塗りつぶす
    con.strokeStyle = "black";
    con.strokeRect(px,py,BLOCK_SIZE, BLOCK_SIZE); // ブロック外枠を黒く塗りつぶす
}

// 全てのブロックを描画
function drawAll() {
    // 描画の前に画面を消去
    con.clearRect(0,0,SCREEN_W,SCREEN_H);

    // フィールドのブロックを描画
    for(let y=0; y<FIELD_ROW; y++) {
        for(let x=0; x<FIELD_COL; x++) {
            // fieldが1であればブロックを表示
            if(field[y][x]) {
                drawBlock(x, y, field[y][x]);
            }
        }
    }

    // 現在操作中のテトロを描画
    for(let y=0; y<TETRO_SIZE; y++) {
        for(let x=0; x<TETRO_SIZE; x++) {
            // tetroが1であればブロックを表示
            if(tetro[y][x]) {
                drawBlock(tetro_x+x, tetro_y+y, tetro_c);
            }
        }
    }

    // ゲームオーバー時
    if(over) {
        let s = "GAME OVER";
        con.font = "40px 'MS ゴシック'";
        let w = con.measureText(s).width;
        let x = SCREEN_W/2 - w/2;
        let y = SCREEN_H/2 - 20;
        con.lineWidth = 4;
        con.strokeText(s,x,y);
        con.fillStyle = "white";
        con.fillText(s,x,y);
    }
}

// 当たり判定
function checkMove(mx, my, ntetro) {
	// ntetroが未定義のとき、ntetroにtetroを代入
	if(ntetro === undefined) ntetro = tetro;
	for(let y = 0; y < TETRO_SIZE; y++){
		for(let x = 0; x < TETRO_SIZE; x++){
			if(ntetro[y][x] != 0){
				// 移動後の座標
				let nx = tetro_x + mx + x;
				let ny = tetro_y + my + y;
				// 移動先にブロックがある、もしくはフィールド外の時false
				if(ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx] != 0 ) return false;
			}
		}
	}
	return true;
}

// テトロミノの回転
function rotate() {
	let ntetro = [];
	// 新しいテトロミノの座標を設定
	for(let y = 0; y < TETRO_SIZE; y++){
		ntetro[y] = [];
		for(let x = 0; x < TETRO_SIZE; x++){
			ntetro[y][x] = tetro[TETRO_SIZE - x - 1][y];
		}
	}
	return ntetro;
}

// テトロミノの固定
function fixTetro() {
	// 新しいテトロミノの座標を設定
	for(let y = 0; y < TETRO_SIZE; y++){
		for(let x = 0; x < TETRO_SIZE; x++){
			if(tetro[y][x] != 0) {
				field[tetro_y + y][tetro_x + x] = tetro_c;
			}
		}
	}
}

// 揃ったラインを消す
function checkLine() {
    let linec = 0; // 消した行数をカウント
	// フィールドを1行ずつ走査していく
	for(let y = 0; y < FIELD_ROW; y++){
		// 各ラインごとの消去フラグ
		let flag = true;
		for(let x = 0; x < FIELD_COL; x++){
			if(field[y][x] === 0) {
				// ラインが揃っていない＝フラグをfalseへ
				flag = false;
				// ループを抜ける
				break;
			}
		}
		// フラグがtrue＝ラインが揃っているとき
		if(flag === true){
            linec++;
			// ラインを消去
			for(let ny = y; ny > 0; ny--){
				for(let nx = 0; nx < FIELD_COL; nx++){
					field[ny][nx] = field[ny - 1][nx];
				}
			}
			// SEをランダムで再生
			se_decision = Math.floor(Math.random() * 2) + 1;
			switch (se_decision){
				case 1:
					document.getElementById('se_1').volume = 0.5; 
					document.getElementById('se_1').play();  
					break;
				case 2:
					document.getElementById('se_2').volume = 0.5; 
					document.getElementById('se_2').play();  
					break;
				case 3:
					document.getElementById('se_3').volume = 0.5; 
					document.getElementById('se_3').play();  
					break;
				default:
					break;
			}
				
		}
	}
}

// テトロミノの落下
function dropTetro() {

    // ゲームオーバー時
    if(over)return;

	if(checkMove(0, 1) === true) tetro_y++;
	else {
		// これ以上落下できない＝一番下の位置に落ちたとき
        fixTetro();
        // ラインが揃っているかチェック
		checkLine();
        // 新しいテトロを作成
        tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        tetro_c = Math.floor(Math.random() * (TETRO_COLORS.length - 1)) + 1;
        tetro = TETRO_TYPES[tetro_t];
        // テトロの座標を初期位置にリセット
        tetro_x = START_X;
        tetro_y = START_Y;

		if (checkMove(0,0) === false) {
			// ゲームオーバー
			over = true;
        }
    }
    drawAll();
}

// キーボードイベント（メソッド onKeyDown）
document.onkeydown = function(event)
{
    // ゲームオーバー時
    if(over)return;

	switch(event.keyCode){
		case 37: // 左
            if(checkMove(-1, 0) === true) tetro_x--;
			break;
		case 38: // 上
			break;
		case 39: // 右
            if(checkMove(1, 0) === true) tetro_x++;
			break;
		case 40: // 下
            if(checkMove(0, 1) === true) tetro_y++;
			break;
		case 32: // スペース
			let ntetro = rotate();
			if(checkMove(0, 0, ntetro) === true) tetro = ntetro;
			break;
    }
    drawAll();
}