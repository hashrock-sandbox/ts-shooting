import { GameObject } from "./game-object";
import { ObjectPool } from "../object-pool";
import { BoxGeometry, Material, MeshPhongMaterial, Scene, Mesh } from "three";
import { Util } from "../util";
import { MyCanvas } from "../my-canvas";

export class Player implements GameObject {
  active: boolean;
  x: number;
  y: number;
  speed: number;
  geometry: BoxGeometry;
  material: Material;
  mesh: Mesh;

  /**
   * コンストラクタ
   * @param ix 生成先のx座標
   * @param iy 生成先のy座標
   * @param ispeed 移動スピード
   */
  constructor(ix: number, iy: number, ispeed: number) {
    this.x = ix;
    this.y = iy;
    this.speed = ispeed;
    this.active = false;
  }

  /**
   * ダミー関数<p>
   * (引数がスーパークラスのアブストラクト・メソッドの定義と異なるため)
   */
  move() {}

  /**
   * 移動処理
   * @param mx x方向の入力(-1 ... +1)
   * @param my y方向の入力(-1 ... +1)
   */
  movePlayer(mx: number, my: number) {
    //Canvasの外には移動できないようにする
    var postX: number = this.x + mx * this.speed;
    var postY: number = this.y + my * this.speed;

    var margin = 50
    if (0 + margin < postX && postX < 500- margin) {
      this.x = postX;
    }
    if (0 + margin < postY && postY < 480 - margin) {
      this.y = postY;
    }
    this.mesh.position.x = this.x;
    this.mesh.position.y = Util.normalize(this.y);
  }

  //描画処理
  draw() {
    if (this.active) {
      this.mesh.rotation.y += 0.1;
    }
  }

  activate() {
    this.geometry = new BoxGeometry(8, 32, 8);
    this.material = new MeshPhongMaterial({ color: "white" });
    this.mesh = new Mesh(this.geometry, this.material);

    var minis = 8;

    for (var i = 0; i < minis; i++) {
      var minicube = new BoxGeometry(4, 8, 4);
      var scale = 20;
      minicube.translate(
        Math.cos(i * 2 * Math.PI / minis) * scale,
        0,
        Math.sin(i * 2 * Math.PI / minis) * scale
      );
      this.mesh.add(new Mesh(minicube, this.material));
    }
    MyCanvas.objectpool.scene.add(this.mesh);
    this.active = true;
  }
  deactivate() {
    this.active = false;
    MyCanvas.objectpool.scene.remove(this.mesh);
  }
}
