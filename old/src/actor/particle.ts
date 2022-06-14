import { Player } from "./player";
import { GameObject } from "./game-object";
import { Util } from "../util";
import {
  PlaneGeometry,
  TextureLoader,
  Texture,
  Material,
  MeshBasicMaterial,
  Scene,
  Mesh,
  AdditiveBlending,
  Points
} from "three";
import { ObjectPool } from "../object-pool";
import { Textures } from "../textures";
import { MyCanvas } from "../my-canvas";

export class Particle implements GameObject {
  direction: number;
  speed: number;
  speedX: number;
  speedY: number;
  size: number;
  geometry: PlaneGeometry;
  material: Material;
  mesh: Mesh;

  active: boolean;
  x: number;
  y: number;

  constructor() {
    this.active = false;
  }

  /**
   * 動作を規定する。メインループ１周につき一回呼ばれる
   */
  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size--;

    if (this.x < 0 || 500 < this.x || this.y < 0 || 500 < this.y) {
      this.deactivate();
    }
    if (this.size <= 0) {
      this.deactivate();
    }
    this.mesh.position.x = this.x;
    this.mesh.position.y = Util.normalize(this.y);
    this.mesh.scale.x = this.size / 30;
    this.mesh.scale.y = this.size / 30;
    this.mesh.scale.z = this.size / 30;
  }

  /**
   * 描画処理。
   * １ループで一回呼ばれる。
   * @param g 描画先グラフィックハンドル
   */
  draw() {
    //this.g.setColor(Color.gray);
    //g.drawOval((this.x-this.size/2), (this.y-this.size/2), this.size, this.size);
  }

  //初期化処理もここで行う（オブジェクトを使い回しているので）
  activate(ix: number, iy: number, idirection: number, ispeed: number) {
    this.x = ix;
    this.y = iy;
    this.direction = idirection;
    this.speed = ispeed;
    this.active = true; //弾のインスタンスを有効にする
    this.size = 30;
    var self = this;

    this.geometry = new PlaneGeometry(32, 32, 4, 4);
    this.material = new MeshBasicMaterial({
      map: Textures.particle,
      transparent: true,
      blending: AdditiveBlending
    });
    this.mesh = new Mesh(this.geometry, this.material);
    MyCanvas.objectpool.scene.add(this.mesh);

    //高速化のため、極座標からXY速度に変換しておく。
    var radian: number;
    radian = Util.toRadians(this.direction); //度をラジアンに変換
    this.speedX = this.speed * Math.cos(radian);
    this.speedY = this.speed * Math.sin(radian);
  }
  deactivate() {
    this.active = false;
    MyCanvas.objectpool.scene.remove(this.mesh);
  }
}
