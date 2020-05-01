mp = null;   // MainPanel オブジェクト

			//
			// MainPanel の開始
			//
function mp_start()
{
					// キャンバス情報
	var canvas = document.getElementById('canvas_e');   // キャンバス要素の取得
	var ctx    = canvas.getContext('2d');   // キャンバスからコンテキストを取得
	// Map オブジェクト
	MP = new Map();
					// MainPanel オブジェクト
	mp = new MainPanel(canvas, ctx);
					// StartPanel の表示
	st_start();
}
			//
			// MainPanel オブジェクト（プロパティ）
			//
function MainPanel(canvas, ctx)
{
	this.canvas = canvas;   // キャンバス要素
	this.ctx    = ctx;   // キャンバスのコンテキスト
	this.level = 1;
	return this;
}


