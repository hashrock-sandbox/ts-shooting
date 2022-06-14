export class Score {
  static myscore: number = 0;
  static hiscore: number = 0;

  /**
   * コンストラクタ
   */
  constructor() {}

  /**
   * スコアの描画
   * @param g 描画先グラフィックハンドル
   */
  static drawScore() {
    document.querySelector("#score").textContent = "" + Score.myscore;
    //		g.setColor(Color.black);
    //g.drawString("score:"+Score.myscore, 30, 30);
  }

  /**
   * ハイスコアの描画
   * @param g 描画先グラフィックハンドル
   */
  static drawHiScore() {
    document.querySelector("#hiscore").textContent = "" + Score.hiscore;
    //g.setColor(Color.black);
    //g.drawString("hiscore:"+Score.hiscore, 420, 30);
  }

  /**
   * スコアに追加
   * @param gain 追加する得点
   */
  static addScore(gain: number) {
    Score.myscore += gain;
  }

  /**
   * ハイスコア更新処理<p>
   * ハイスコアを越えていたら、スコアを外部ファイルに保存する。
   */
  static compareScore() {
    //ハイスコアを更新
    if (Score.myscore > Score.hiscore) {
      Score.hiscore = Score.myscore;
      localStorage["hiscore"] = Score.hiscore;
    }
  }

  //スコアの初期化
  static initScore() {
    Score.myscore = 0;
    Score.hiscore = localStorage["hiscore"] ? localStorage["hiscore"] : 0;
  }
}
