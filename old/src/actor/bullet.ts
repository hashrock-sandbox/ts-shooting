import { GameObject } from "./game-object";
import { ObjectPool } from "../object-pool";
import { Player } from "./player";
import { Util } from "../util";
import { BoxGeometry, Material, MeshPhongMaterial, Scene, Mesh } from "three";
import { MyCanvas } from "../my-canvas";

export class Bullet implements GameObject {
  direction: number;
  speed: number;
  speedX: number;
  speedY: number;

  active: boolean;
  x: number;
  y: number;
  geometry: BoxGeometry;
  material: Material;
  mesh: Mesh;

  /**
   * コンストラクタ
   */
  constructor() {
    //初期化時はactiveでない
    this.active = false;
  }

  /**
   * 動作を規定する。メインループ１周につき一回呼ばれる
   */
  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || 500 < this.x || this.y < 0 || 500 < this.y) {
      this.active = false;
      MyCanvas.objectpool.scene.remove(this.mesh);
    }
    this.mesh.position.x = this.x;
    this.mesh.position.y = Util.normalize(this.y);
  }

  /**
   * 描画処理。
   * １ループで一回呼ばれる。
   * @param g 描画先グラフィックハンドル
   */
  draw() {
    //g.setColor(Color.blue);
    //g.drawRect((this.x-3), (this.y-3), 6, 6);
  }

  /**
   * インスタンスを有効にする。インスタンスの使い回しをしているので、
   * 初期化処理もここで行う。
   * @param ix 生成する位置(X座標)
   * @param iy 生成する位置(Y座標)
   * @param idirection 向き(単位は度　0-360)
   * @param ispeed 速度(単位はピクセル)
   */
  activate(ix: number, iy: number, direction: number, ispeed: number) {
    this.x = ix;
    this.y = iy;
    this.direction = direction;
    this.speed = ispeed;
    this.active = true; //弾のインスタンスを有効にする

    this.geometry = new BoxGeometry(8, 8, 8);
    this.material = new MeshPhongMaterial({ color: "#ff8888" });
    this.mesh = new Mesh(this.geometry, this.material);
    MyCanvas.objectpool.scene.add(this.mesh);

    //高速化のため、極座標からXY速度に変換しておく。
    var radian: number;
    radian = Util.toRadians(direction); //度をラジアンに変換
    this.speedX = this.speed * Math.cos(radian);
    this.speedY = this.speed * Math.sin(radian);
  }

  /**
   * 全方位に弾を撃つ
   */
  static FireRound(x: number, y: number) {
    for (var i: number = 0; i < 360; i += 60) {
      MyCanvas.objectpool.newBullet(x, y, i, 3);
    }
  }

  //プレイヤーの位置に向けて弾を撃つ
  static FireAim(x: number, y: number, player: Player) {
    var degree: number = Util.toDegrees(Math.atan2(player.y - y, player.x - x));
    MyCanvas.objectpool.newBullet(x, y, degree, 4);
    MyCanvas.objectpool.newBullet(x, y, degree + 20, 4);
    MyCanvas.objectpool.newBullet(x, y, degree - 20, 4);
  }

  deactivate() {
    this.active = false;
    MyCanvas.objectpool.scene.remove(this.mesh);
  }
}
