export class Level {
  static level: number;

  /**
   * 現在のレベルを返す
   * @return レベル(0-8)
   */
  static getLevel(): number {
    return this.level;
  }

  /**
   * レベルを１増やす
   */
  static addLevel() {
    //最大レベルは8
    if (this.level < 8) {
      this.level++;
    }
    console.log("level:" + this.level); //DEBUG
  }

  /**
   * レベルを０に戻す
   */
  static initLevel() {
    this.level = 0;
  }
}
