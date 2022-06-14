/**
 *キーボードの入力を管理するクラス<p>
 *スペースキーで撃つ<p>
 *カーソルキーで移動　と定義されている
 */
export class KeyInput {
  //キーボード入力の状態を保持するフィールド
  keyup: boolean;
  keydown: boolean;
  keyleft: boolean;
  keyright: boolean;

  /**
   * 押された瞬間を判別するため、0-2の値をとる
   * 0:押されていない 1:押されている 2:ついさっき押されたばかり
   */
  keyshot: number = 0;

  constructor() {
    this.keyup = false;
    this.keydown = false;
    this.keyleft = false;
    this.keyright = false;
    this.keyshot = 0;
  }

  static VK_LEFT: number = 37;
  static VK_RIGHT: number = 39;
  static VK_UP: number = 38;
  static VK_DOWN: number = 40;
  static VK_SPACE: number = 32;

  /**
   * キーが押されたときに呼ばれる処理。
   * 変数にキー状態を保存する。
   */
  keyPressed(e: KeyboardEvent) {
    let keycode: number = e.keyCode;
    if (keycode === KeyInput.VK_LEFT) {
      this.keyleft = true;
    }
    if (keycode === KeyInput.VK_RIGHT) {
      this.keyright = true;
    }
    if (keycode === KeyInput.VK_UP) {
      this.keyup = true;
    }
    if (keycode === KeyInput.VK_DOWN) {
      this.keydown = true;
    }
    if (keycode === KeyInput.VK_SPACE) {
      //初めて押された
      if (this.keyshot == 0) {
        //押された瞬間を表すフラグ
        this.keyshot = 2;
      } else {
        //押されている状態
        this.keyshot = 1;
      }
    }
  }

  /**
   * 押されていたキーを放したときに呼ばれる処理
   */
  keyReleased(e: KeyboardEvent) {
    let keycode: number = e.keyCode;
    if (keycode === KeyInput.VK_LEFT) {
      this.keyleft = false;
    }
    if (keycode === KeyInput.VK_RIGHT) {
      this.keyright = false;
    }
    if (keycode === KeyInput.VK_UP) {
      this.keyup = false;
    }
    if (keycode === KeyInput.VK_DOWN) {
      this.keydown = false;
    }
    if (keycode === KeyInput.VK_SPACE) {
      this.keyshot = 0;
    }
  }

  /**
   * x軸の入力を取得
   * @return -1:右　0:なし　1:左
   */
  getXDirection(): number {
    var ret: number = 0; //静止状態
    if (this.keyright) {
      ret = 1;
    }
    if (this.keyleft) {
      ret = -1;
    }
    return ret;
  }

  /**
   * y軸の入力を取得
   * @return -1:上　0:なし　1:下
   */
  getYDirection(): number {
    var ret: number = 0; //静止状態
    if (this.keydown) {
      ret = 1;
    }
    if (this.keyup) {
      ret = -1;
    }
    return ret;
  }

  /**
   * ショットボタン（＝スペースキー）の状態を取得する
   * @return 0:押されていない 1:押されている 2:ついさっき押されたばかり
   */
  checkShotKey(): number {
    var ret: number = this.keyshot;
    if (this.keyshot == 2) {
      this.keyshot = 1;
    }
    return ret;
  }
}
