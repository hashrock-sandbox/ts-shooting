/**
 *ゲームオブジェクト抽象クラス<p>
 *プレイヤー、弾、敵などのスーパークラス
 */
export interface GameObject {
  /**
   * インスタンス有効フラグ（falseならインスタンスは処理されない）
   */
  active: boolean;
  /**
   * 座標のx成分
   */
  x: number;
  /**
   * 座標のy成分
   */
  y: number;

  /**
   * ステップ毎に実行されるメソッド
   */
  move(): void;

  /**
   * 描画
   */
  draw(): void;
  deactivate(): void;
}
