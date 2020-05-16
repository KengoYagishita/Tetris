// ここから定数

const GAME_SPEED = 300; // 落ちるスピード
const FIELD_COL = 12; // フィールドの列
const FIELD_ROW = 22; // フィールドの行
const FIELD_X = 40; // フィールドのCanvas内のX座標
const FIELD_Y = 20; // フィールドのCanvas内のY座標
const BLOCK_SIZE = 30; // ブロック一つのサイズ(ピクセル)
// キャンバスサイズ
const CANVAS_WIDTH = 620;
const CANVAS_HEIGHT = 700;
// NEXTフィールド
const NEXT_FIELD_X = CANVAS_WIDTH-185; // 次のフィールドのCanvas内のX座標
const NEXT_FIELD_Y = FIELD_Y + 50; // 次のフィールドのCanvas内のY座標
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

// テトロの情報
let tetro; // テトロミノ本体
let tetro_t; // テトロミノの形
let tetro_c; // テトロミノの色

// 次のテトロの情報
let nextTetro; // テトロミノ本体
let nextTetro_t; // テトロミノの形
let nextTetro_c; // テトロミノの色

// テトロミノの座標
let tetro_x = START_X; // x座標
let tetro_y = START_Y; // y座標

// フィールド本体を一次元配列で作成
let field = [];

// ゲームオーバーフラグ
let over = false;

// タイトルフラグ
let title = true;

// スコア
let score = 0;
// ハイスコア
let highScore = 0;

let can = document.getElementById("canvas_e"); // ID"canvas_e"のcanvasの要素を取得して変数canに入れる
let con = can.getContext("2d");

// ここまで　初期変数
 


can.wicth = CANVAS_HEIGHT;
can.height = CANVAS_HEIGHT;
can.style.border = "4px solid #555";

// テトロをランダムに作成
tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1; // テトロミノの形をランダムに決める
tetro_c = Math.floor(Math.random() * (TETRO_COLORS.length - 1)) + 1; // テトロミノの色をランダムに決める
tetro = TETRO_TYPES[tetro_t];
// 次のテトロをランダムに作成
nextTetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1; // テトロミノの形をランダムに決める
nextTetro_c = Math.floor(Math.random() * (TETRO_COLORS.length - 1)) + 1; // テトロミノの色をランダムに決める
nextTetro = TETRO_TYPES[nextTetro_t];

//init();
//drawAll();
titleScreen();
// GAME_SPEED(ミリ秒)ごとにdropTetroを呼び出す
setInterval( dropTetro, GAME_SPEED );

// タイトル画面
function titleScreen() {
    // 描画の前に画面を消去
    con.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    con.fillStyle = "rgba(25, 25, 25, 1.0)"; // 文字色の設定
	con.font = "bold 48px sans-serif"; // 文字フォントの設定
	con.fillText("落ち物パズル", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3); // 文字の描画
	con.font = "bold 32px sans-serif"; // 文字フォントの設定
    con.fillText("ゲームスタート：Enter", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3 + 100); // 文字の描画
    con.font = "bold 16px sans-serif"; // 文字フォントの設定
    con.fillText("※このゲームでは音声が再生されます。", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3 + 130);
    con.font = "bold 32px sans-serif"; // 文字フォントの設定
    con.fillText("HIGHSCORE：" + highScore, CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3 + 200);
    // タイトルフラグ
    title = true;
}

// 初期化
function init() {
    // フィールドのクリア
    for(let y = 0; y < FIELD_ROW; y++) {
        field[y] = [];
        for(let x = 0; x < FIELD_COL; x++) {
            field[y][x] = 0;
        }
    }
    // スコアをリセット
    score = 0;
    // タイトルフラグを解除
    title = false;
    // ゲームオーバーフラグを解除
    over = false;
    // テスト用ブロック
    /*field[3][5] = 1;
    field[16][6] = 1;
    field[16][7] = 1;*/
}

// ブロック1つを描写する
function drawBlock(x,y,c) {
    let px = x * BLOCK_SIZE + FIELD_X; // ブロックの表示部分のx座標
    let py = y * BLOCK_SIZE + FIELD_Y; // ブロックの表示部分のy座標
    con.fillStyle = TETRO_COLORS[c];
    con.fillRect(px,py,BLOCK_SIZE, BLOCK_SIZE); // ブロック部分を塗りつぶす
    con.strokeStyle = "black";
    con.strokeRect(px,py,BLOCK_SIZE, BLOCK_SIZE); // ブロック外枠を黒く塗りつぶす
}
// ブロック1つを描写する(NEXT)
function drawNBlock(x,y,c) {
    let px = x * BLOCK_SIZE + NEXT_FIELD_X+10; // ブロックの表示部分のx座標
    let py = y * BLOCK_SIZE + NEXT_FIELD_Y+10; // ブロックの表示部分のy座標
    con.fillStyle = TETRO_COLORS[c];
    con.fillRect(px,py,BLOCK_SIZE, BLOCK_SIZE); // ブロック部分を塗りつぶす
    con.strokeStyle = "black";
    con.strokeRect(px,py,BLOCK_SIZE, BLOCK_SIZE); // ブロック外枠を黒く塗りつぶす
}


// フィールド枠を描画する
function drawFrame() {
	con.fillStyle = "rgba(25, 25, 25, 1.0)"; // 黒色に設定
	
	//	縦線を描画
	for(var i = 0;i < FIELD_COL + 1;i++) {
		con.fillRect(FIELD_X + i * BLOCK_SIZE, FIELD_Y, 1, BLOCK_SIZE * FIELD_ROW);
	}
	
	//	横線を描画
	for(var i = 0;i < FIELD_ROW + 1;i++) {
		con.fillRect(FIELD_X, FIELD_Y + i * BLOCK_SIZE, BLOCK_SIZE * FIELD_COL, 1);
	}
}

// NEXTブロック領域を描画する
function drawNextBlock() {
	// 枠の描画
	con.fillStyle = "rgba(25, 25, 25, 1.0)"; // 黒色に設定
	
	con.fillRect(NEXT_FIELD_X,		NEXT_FIELD_Y,		150, 1);
	con.fillRect(NEXT_FIELD_X,		NEXT_FIELD_Y + 150, 150, 1);
	con.fillRect(NEXT_FIELD_X,		NEXT_FIELD_Y,		1, 150);
	con.fillRect(NEXT_FIELD_X + 150,NEXT_FIELD_Y,		1, 150);
	
	// 次のテトロを描画
    for(let y=0; y<TETRO_SIZE; y++) {
        for(let x=0; x<TETRO_SIZE; x++) {
            // nextTetroが1であればブロックを表示
            if(nextTetro[y][x]) {
                drawNBlock(x, y, nextTetro_c);
            }
        }
    }
	
    con.font = "bold 20px sans-serif";
    con.fillStyle = "rgba(25, 25, 25, 1.0)"; // 黒色に設定
	con.fillText("Next", NEXT_FIELD_X + 50, 60);
	con.fillRect(NEXT_FIELD_X, 70, 150, 1);
}

// 全てのブロックを描画
function drawAll() {
    // 描画の前に画面を消去
    con.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    // フィールド枠を描画
    drawFrame();
    // NEXTブロックを描画
    drawNextBlock();

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

    // スコアを表示
    con.font = "20px 'Impact'";
    con.fillStyle = "black";
    con.fillText("SCORE:"+score,420,260);

    // ゲームオーバー時
    if(over) {
        // BGMの停止
        document.getElementById('BGM').pause();

        let s = "GAME OVER";
        con.font = "40px 'MS ゴシック'";
        let w = con.measureText(s).width;
        let x = SCREEN_W/2 - w/2 + FIELD_X/2;
        let y = SCREEN_H/2 - 20;
        con.lineWidth = 4;
        con.strokeText(s,x,y);
        con.fillStyle = "white";
        con.fillText(s,x,y);
        s = "'Enter' キーでタイトルに戻る";
        con.font = "20px 'MS ゴシック'";
        w = con.measureText(s).width;
        x = SCREEN_W/2 - w/2 + FIELD_X/2;
        y = SCREEN_H/2 + 5;
        con.lineWidth = 2;
        con.strokeText(s,x,y);
        con.fillStyle = "black";
        con.fillText(s,x,y);
        // ハイスコア更新
        if(highScore < score) {
            highScore = score;
        }
    }

    // ハイスコアを表示
    con.font = "20px 'Impact'";
    con.fillStyle = "black";
    con.fillText("HIGH SCORE:"+highScore,420,280);

    //	操作方法の表示
    con.font = "18px sans-serif";
	con.fillText("←・→・↓： 移動", 420, 320);
	con.fillText("SPACE： 回転", 420, 340);
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
			se_decision = Math.floor(Math.random() * 3) + 1;
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
    // 消した行数に応じてスコア加算
    switch (linec){
        case 1:
            // 1行消去時 1行×100(点)
            score+=100;
            break;
        case 2:
            // 2行消去時 2行×200(点)
            score+=400;
            break;
        case 3:
            // 3行消去時 3行×300(点)
            score+=900;
            break;
        case 4:
            // 4行消去時 4行×400(点)
            score+=1600;
            break;
        default:
            break;
    }
}

// テトロミノの落下
function dropTetro() {
    
    // タイトル時
    if(title){
        titleScreen();
        return;
    }else if(over){
        // ゲームオーバー時
        return;
    }
	if(checkMove(0, 1) === true) tetro_y++;
	else {
		// これ以上落下できない＝一番下の位置に落ちたとき
        fixTetro();
        // ラインが揃っているかチェック
        checkLine();
        // 次のテトロを現在のテトロに置き換え
        tetro_t = nextTetro_t; // テトロミノの形を「次のテトロ」の形にする
        tetro_c = nextTetro_c; // テトロミノの色を「次のテトロ」の形にする
        tetro = TETRO_TYPES[tetro_t];
        // 新しい次のテトロを作成
        nextTetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        nextTetro_c = Math.floor(Math.random() * (TETRO_COLORS.length - 1)) + 1;
        nextTetro = TETRO_TYPES[nextTetro_t];
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
    if(title) {
        // タイトル表示時
        // Enterキーの入力のみ受け付ける
        switch(event.keyCode){
            case 13: // Enter
                // BGM の再生
                document.getElementById('BGM').volume = 0.5;
                document.getElementById('BGM').currentTime = 0;
                document.getElementById('BGM').play();
                // 初期化する
                init();
                break;
        }
    } else if(over) {
        // ゲームオーバー時
        // Enterキーの入力のみ受け付ける
        switch(event.keyCode){
            case 13: // Enter
                // タイトルに戻る
                titleScreen();
                break;
        }
    }
    else {
        // Enterキー以外の入力を受け付ける
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
    }
	
    drawAll();
}