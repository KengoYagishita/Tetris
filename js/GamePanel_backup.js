gp = null;   // GamePanel オブジェクト

			//
			// GamePanel の開始
			//
function gp_start()
{
					// GamePanel オブジェクト
	gp = new GamePanel();
	// タイマーのスタート
	gp.timerID = setInterval('gp.draw()', 50);
					// ボタンの表示制御
	document.getElementById('method').style.display = "none";
	document.getElementById('start').style.display = "none";
	document.getElementById('first').style.display = "none";
	document.getElementById('finish').style.display = "none";
	document.getElementById('left').style.display = "";
	document.getElementById('right').style.display = "";
					// 確認
//	gop_start();   // ゲームオーバー
//	gcp_start();   // ゲームクリア
}
			//
			// GamePanel オブジェクト（プロパティ）
			//
function GamePanel()
{
	this.timerID = -1;   // タイマー
	this.blk = new Block();   // Block オブジェクト
	this.rk = new Racket();   // Racket オブジェクト
	this.bl = new Ball(this.blk);   // Ball オブジェクト
	return this;
}
			//
			// GamePanel オブジェクト（メソッド draw）
			//
GamePanel.prototype.draw = function()
{
					// キャンバスのクリア
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
	// 描画
		// ブロック
	for (var i1 = 0; i1 < gp.blk.row; i1++) {
		for (var i2 = 0; i2 < gp.blk.col; i2++) {
			if (gp.blk.ex[i1][i2]) {
				mp.ctx.drawImage(gp.blk.block, gp.blk.width*i2, gp.blk.height*i1);
			}
		}
	}
		// ラケット
	mp.ctx.beginPath();
	mp.ctx.fillStyle = "rgb(0, 255, 0)";
	mp.ctx.fillRect(gp.rk.x, gp.rk.y, gp.rk.width, gp.rk.height);
	mp.ctx.fill();

		// ボール
	mp.ctx.beginPath();
	mp.ctx.fillStyle = "rgb(255, 0, 0)";
	mp.ctx.arc(gp.bl.x, gp.bl.y, gp.bl.r, 0, 2*Math.PI);
	mp.ctx.fill();
	
		// 移動
	gp.bl.x += gp.bl.vx;
	gp.bl.y += gp.bl.vy;
	
	// 壁に衝突した時の処理
	var sw = 0;
	
	// 下へ移動中
	if (gp.bl.vy > 0){
		// ラケットの位置より下か判定
		if(gp.bl.y >= gp.rk.y - gp.bl.r){
			// ラケットに当たったかを判定
			if(gp.bl.x >= gp.rk.x && gp.bl.x <= gp.rk.x + gp.rk.width){
				// 垂直方向の座標を、ラケットの位置に強制的に修正
				gp.bl.y = gp.rk.y - gp.bl.r;
				// 縦方向の速度を、逆方向に設定
				gp.bl.vy = -gp.bl.vy;
				// ラケット命中時se再生
				document.getElementById('se_racket').volume = 0.5; 
				document.getElementById('se_racket').play();
			}
			else{
				// ゲームオーバー
				clearInterval(gp.timerID); //タイマーの停止
				gop_start();
			}
			sw = 1; //上下の壁衝突判定
		}
		// else
	}// 上へ移動中
	else{
		// 上の壁へ衝突
		if(gp.bl.y <= gp.blk.row * gp.blk.height){
			var k = -1;
			// 横方向のブロック位置
			for(var i1 = 1; i1 < gp.blk.col && k < 0; i1++){
				if(gp.bl.x <= i1 * gp.blk.width){
					k = i1 - 1;
				}
				if (k < 0)
					k = gp.blk.col - 1;
				// ブロックとの衝突
				// ブロックの行数分繰り返し
				// for (var i1 = gp.blk.row; i1 >= 0 && sw === 0; i1--)
				for (var i1 = gp.blk.row; i1 >= 0; i1--){
					//上の壁またはブロックに衝突しているか判定
					if(gp.bl.y <= i1 * gp.blk.height + gp.bl.r){
						if(i1 === 0 || gp.blk.ex[i1-1][k]){
							// 垂直方向の座標を、壁の位置に強制的に修正
							gp.bl.y = i1 * gp.blk.height + gp.bl.r;
							// 縦方向の速度を、逆方向に設定
							gp.bl.vy = -gp.bl.vy;
							sw = 1; //上下の壁衝突判定
							//衝突したのがブロックの場合
							if(i1 > 0){
								// 衝突したブロックを消去
								gp.blk.ex[i1-1][k] = false;
								gp.blk.number--;
								// ブロック破壊時se再生
								document.getElementById('se_break').volume = 0.5; 
								document.getElementById('se_break').play();
								// ゲームクリア
								if(gp.blk.number === 0){
									clearInterval(gp.timerID); //タイマーの停止
									gcp_start();
								}
							}
							else{
								// 壁反射時se再生
								document.getElementById('se_bounce').volume = 0.5; 
								document.getElementById('se_bounce').play();
							}
						}
					}
				}
			}
		}
	}
	
	// 上下の壁に衝突していない場合
	if(sw === 0){
		// 右方向へ移動中
		if (gp.bl.vx > 0){
			// 右の壁へ衝突
			if(gp.bl.x >= mp.canvas.width - gp.bl.r){
				// 水平方向の座標を、壁の位置に強制的に修正
				gp.bl.x = mp.canvas.width - gp.bl.r;
				// 横方向の速度を、逆方向に設定
				gp.bl.vx = -gp.bl.vx;
				// 壁反射時se再生
				document.getElementById('se_bounce').volume = 0.5; 
				document.getElementById('se_bounce').play();   
			}
		}// 上へ移動中
		else{
			// 左の壁へ衝突
			if(gp.bl.x <= gp.bl.r){
				// 水平方向の座標を、壁の位置に強制的に修正
				gp.bl.x = gp.bl.r;
				// 横方向の速度を、逆方向に設定
				gp.bl.vx = -gp.bl.vx;
				// 壁反射時se再生
				document.getElementById('se_bounce').volume = 0.5; 
				document.getElementById('se_bounce').play();  
			}
		}
	}
	
}
		//
		// GamePanel オブジェクト（メソッド move）
		//
GamePanel.prototype.move = function(sw)
{
	//「左」「右」ボタンをクリックしたときの処理
	if (sw === 0){
		gp.rk.x -= (gp.rk.width / 2 - 5);
	}else{
		gp.rk.x += (gp.rk.width / 2 - 5);
	}
}
			//
			// Block オブジェクト（プロパティ）
			//
function Block()
{
	this.block = new Image(); //ブロックの画像
	this.width = 75; //ブロックの幅
	this.height = 38; //ブロックの高さ
	this.row = 2; //ブロックの行数
	this.col = 4; //ブロックの列数
	this.number = this.row * this.col;   // ブロックの数
	this.ex = new Array();   // ブロックの状態（存在するか否か）
	for(var i1 = 0; i1 < this.row; i1++){
		this.ex[i1] = new Array();
		for(var i2 = 0; i2 < this.col; i2++){
			this.ex[i1][i2] = true;
		}
	}
	this.block.src = "image/block.jpg"; // ブロック画像の読み込み
	return this;
}

			//
			// Racket オブジェクト（プロパティ）
			//
function Racket()
{
	this.width; //ラケットの幅
	this.height = 20; //ラケットの高さ
	this.x; //ラケットの横位置
	this.y; //ラケットの縦位置
	// 幅と位置の設定
	if(mp.level === 1){
		this.width = 100;
	}else {
		this.width = 50;
	}
	this.x = mp.canvas.width / 2 - this.width / 2;
	this.y = mp.canvas.height - this.height;
	return this;
}
			//
			// Ball オブジェクト（プロパティ）
			//
function Ball(blk)
{
	this.r = 7; //ボールの半径
	this.x; //ボールの横位置
	this.y; //ボールの縦位置
	this.v = 4; //ボールの速度
	this.vx; //ボールの横方向速度成分
	this.vy; //ボールの縦方向速度成分
	// 位置と速度の設定
	this.x = this.r + Math.floor(Math.random() * (mp.canvas.width - 2 * this.r));
	this.y = blk.height * blk.row + 10;
	var a = this.v * Math.cos(45.0 * Math.PI / 180.0); //45度の余弦を求め、縦方向の速度成分を計算
	this.vy = Math.floor(a);
	if (this.x < mp.canvas.width / 2){
		//ボールが中央よりも左にある場合、右方向へ移動開始
		this.vx = Math.floor(a);
	} else{
		//ボールが中央よりも右にある場合、左方向へ移動開始
		this.vx = -Math.floor(a);
	}
	return this;
}