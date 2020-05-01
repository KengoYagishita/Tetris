gp = null;   // GamePanel オブジェクト

			//
			// GamePanel の開始(MDN版)
			//
function gp_start()
{
	// BGM の再生
	document.getElementById('BGM').volume = 0.5;
	document.getElementById('BGM').play();
					// GamePanel オブジェクト
	gp = new GamePanel();
	// タイマーのスタート
	gp.timerID = setInterval('gp.draw()', 50);
	gp.timerID2 = setInterval('gp.dropTetro()', gp.speed);
	// イベントリスナの追加
	//mp.canvas.addEventListener("mousedown", gp.onMouseDown);
	mp.canvas.addEventListener("keydown", gp.onKeyDown, false);
					// ボタンの表示制御
	document.getElementById('method').style.display = "none";
	document.getElementById('start').style.display = "none";
	document.getElementById('first').style.display = "none";
	document.getElementById('finish').style.display = "none";
	document.getElementById('left').style.display = "none";
	document.getElementById('right').style.display = "none";
					// 確認
//	gop_start();   // ゲームオーバー
//	gcp_start();   // ゲームクリア
}

			//
			// GamePanel オブジェクト（プロパティ）
			//
function GamePanel()
{
	// タイマー
	this.timerID = -1; 
	this.timerID2 = -1;
	this.speed = 500;
	this.te = new Tetro();
	this.fi = new Field();
	return this;
}

// 1つのブロックの描写
function drawBlock(x, y, c) {
	// ブロック描写位置を決める
	px = x * gp.te.wh;
	py = y * gp.te.wh;
	mp.ctx.beginPath();
	mp.ctx.fillStyle = gp.te.tetro_colors[c];
	mp.ctx.fillRect(px, py, gp.te.wh, gp.te.wh);
	//ブロックの枠線を描写
	mp.ctx.strokeStyle = "rgb(0, 0, 0)";
	mp.ctx.strokeRect(px, py, gp.te.wh, gp.te.wh);
	mp.ctx.closePath();
}

// テトロミノの描写
function drawTetro() {
	for(y = 0; y < gp.te.size; y++){
		for(x = 0; x < gp.te.size; x++){
			if(gp.te.ex[y][x] != 0){
				drawBlock(gp.te.x + x, gp.te.y + y, gp.te.tetro_c);
			}
		}
	}
}

// フィールドの描写
function drawField() {
	for(y = 0; y < gp.fi.row; y++){
		for(x = 0; x < gp.fi.col; x++){
			if(gp.fi.ex[y][x] != 0){
				drawBlock(x, y, gp.fi.ex[y][x]);
			}
		}
	}
}

// 当たり判定
function checkMove(mx, my, ntetro) {
	// ntetroが未定義のとき、ntetroにtetroを代入
	if(ntetro === undefined) ntetro = gp.te.ex;
	for(y = 0; y < gp.te.size; y++){
		for(x = 0; x < gp.te.size; x++){
			if(ntetro[y][x] != 0){
				// 移動後の座標
				nx = gp.te.x + mx + x;
				ny = gp.te.y + my + y;
				// 移動先にブロックがある、もしくはフィールド外の時false
				if(ny < 0 || nx < 0 || ny >= gp.fi.row || nx >= gp.fi.col || gp.fi.ex[ny][nx] != 0 ) return false;
			}
		}
	}
	return true;
}

// テトロミノの回転
function rotate() {
	newTetro = [];
	// 新しいテトロミノの座標を設定
	for(y = 0; y < gp.te.size; y++){
		newTetro[y] = [];
		for(x = 0; x < gp.te.size; x++){
			newTetro[y][x] = gp.te.ex[gp.te.size - x - 1][y];
		}
	}
	return newTetro;
}

// テトロミノの固定
function fixTetro() {
	// 新しいテトロミノの座標を設定
	for(y = 0; y < gp.te.size; y++){
		for(x = 0; x < gp.te.size; x++){
			if(gp.te.ex[y][x] != 0) {
				gp.fi.ex[gp.te.y + y][gp.te.x + x] = gp.te.tetro_c;
			}
		}
	}
	
}

// 揃ったラインを消す
function checkLine() {
	// 新しいテトロミノの座標を設定
	for(y = 0; y < gp.fi.row; y++){
		// 各ラインごとの消去フラグ
		flag = true;
		for(x = 0; x < gp.fi.col; x++){
			if(gp.fi.ex[y][x] === 0) {
				// ラインが揃っていない＝フラグをfalseへ
				flag = false;
				// ループを抜ける
				break;
			}
		}
			// フラグがtrue＝ラインが揃っているとき
			if(flag === true){
				// ラインを消去
				for(ny = y; ny > 0; ny--){
					for(nx = 0; nx < gp.fi.col; nx++){
						gp.fi.ex[ny][nx] = gp.fi.ex[ny - 1][nx];
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
GamePanel.prototype.dropTetro = function() {
	if(checkMove(0, 1) === true) gp.te.y++;
	else {
		// これ以上落下できない＝一番下の位置に落ちたとき
		fixTetro();
		// ラインが揃っているかチェック
		checkLine();
		// 新しいテトロを生成
		t = Math.floor(Math.random() * (gp.te.tetro_types.length - 1)) + 1;
		gp.te.ex = gp.te.tetro_types[t];
		gp.te.tetro_c = Math.floor(Math.random() * (gp.te.tetro_colors.length - 1)) + 1;
		// 位置をリセット
		gp.te.x = gp.te.sx;
		gp.te.y = gp.te.sy;
		if (checkMove(0,0) === false) {
			// ゲームオーバー
			clearInterval(gp.timerID);   // タイマーの停止
			clearInterval(gp.timerID2);   // タイマーの停止
			gop_start();
		}
	}
}

// 描写
GamePanel.prototype.draw = function() {
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
	//テスト用ブロック
	/*gp.fi.ex[5][8] = 1;
	gp.fi.ex[19][0] = 1;
	gp.fi.ex[19][9] = 1;*/
	drawField();
	drawTetro();
}

			//
			// Tetro オブジェクト（プロパティ）
			//
function Tetro()
{
	this.size = 4;   // テトロミノのサイズ
	this.wh = 30; // テトロミノの幅と高さ（正方形なので同じ変数）
	this.sx = 10 / 2 - this.size / 2; //テトロミノの初期x座標
	this.sy = 0; //テトロミノの初期y座標
	this.x = this.sx; //テトロミノのx座標
	this.y = this.sy; //テトロミノのy座標
	// テトロミノの色の種類
	this.tetro_colors = [
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
	this.tetro_types =[
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
	]
	// テトリミノの色
	this.tetro_c = Math.floor(Math.random() * (this.tetro_colors.length - 1)) + 1;
	//テトロミノの形
	this.tetro_t = Math.floor(Math.random() * (this.tetro_types.length - 1)) + 1;
	// テトロミノの形を表す二次元配列
	this.ex = this.tetro_types[this.tetro_t];
	return this;
}

			//
			// Field オブジェクト（プロパティ）
			//
function Field()
{
	this.row = 20;   // フィールドの行
	this.col = 10;   // フィールドの列
	this.ex = []; 	// フィールドを表す二次元配列
	// フィールドを初期化
	for(y=0; y < this.row; y++){
		this.ex[y] = [];
		for(x=0; x < this.col; x++){
			this.ex[y][x] = 0;
		}
	}
	return this;
}

//
// GamePanel オブジェクト（メソッド onKeyDown）
//
GamePanel.prototype.onKeyDown = function(event)
{
	switch(event.keyCode){
		case 37: // 左
			if(checkMove(-1, 0) === true) gp.te.x--;
			break;
		case 38: // 上
			if(checkMove(0, -1) === true) gp.te.y--;
			break;
		case 39: // 右
			if(checkMove(1, 0) === true) gp.te.x++;
			break;
		case 40: // 下
			if(checkMove(0, 1) === true) gp.te.y++;
			break;
		case 32: // スペース
			ntetro = rotate();
			if(checkMove(0, 0, ntetro) === true) gp.te.ex = ntetro;
			break;
	}
}

//
// GamePanel オブジェクト（メソッド onmouseMove）
//
GamePanel.prototype.onmouseMove = function(event)
{
	var relativeX = event.clientX - mp.canvas.offsetLeft;
	if(relativeX > 0 && relativeX < mp.canvas.width) {
		gp.rk.x = relativeX - gp.rk.width / 2;
	}
}