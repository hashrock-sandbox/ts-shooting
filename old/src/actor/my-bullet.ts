import { Player } from "./player";
import { GameObject } from "./game-object";
import { BoxGeometry, Material, MeshPhongMaterial, Scene, Mesh } from "three";
import { Util } from "../util";
import { ObjectPool } from "../object-pool";
import { MyCanvas } from "../my-canvas";

export class MyBullet implements GameObject {
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
    this.active = false;
  }

  /**
   * ステップ毎処理
   */
  move() {
    this.y -= 15;
    //画面の外に出たら消去
    if (this.y < 0) {
      this.deactivate();
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
    //g.setColor(Color.gray);
    //g.drawRect(this.x-3, this.y-10, 6, 20);
  }

  //初期化処理もここで行う（オブジェクトを使い回しているので）
  activate(ix: number, iy: number) {
    this.x = ix;
    this.y = iy;
    this.active = true; //弾のインスタンスを有効にする

    this.geometry = new BoxGeometry(4, 10, 4);
    this.material = new MeshPhongMaterial({ color: "#5555ff" });
    this.mesh = new Mesh(this.geometry, this.material);
    MyCanvas.objectpool.scene.add(this.mesh);
  }
  deactivate() {
    this.active = false;
    MyCanvas.objectpool.scene.remove(this.mesh);
  }
}
