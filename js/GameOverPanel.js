			//
			// GameOverPanel の開始
			//
function gop_start()
{
	// BGM の停止
	//document.getElementById('bgm_stage').pause();
	//document.getElementById('bgm_stage').currentTime = 0;
					// キャンバスのクリア
	mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
					// タイトルの表示
	mp.ctx.font = "40px 'ＭＳ ゴシック'";
	mp.ctx.textBaseline = "middle";
	mp.ctx.textAlign = "center";
	mp.ctx.fillStyle = "rgb(0, 0, 0)";
	mp.ctx.fillText("Game Over!", mp.canvas.width/2, mp.canvas.height/2);
					// ボタンの表示制御
	document.getElementById('method').style.display = "none";
	document.getElementById('start').innerHTML = "現レベルで再開";
	document.getElementById('start').style.display = "";
	document.getElementById('first').style.display = "";
	document.getElementById('finish').style.display = "";
	document.getElementById('left').style.display = "none";
	document.getElementById('right').style.display = "none";
}
				