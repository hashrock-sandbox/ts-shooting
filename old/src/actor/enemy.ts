import { Player } from "./player";
import { GameObject } from "./game-object";
import { Bullet } from "./bullet";
import { Score } from "../score";
import { ObjectPool } from "../object-pool";
import { Level } from "../level";
import { BoxGeometry, Material, MeshPhongMaterial, Scene, Mesh } from "three";
import { Util } from "../util";
import { MyCanvas } from "../my-canvas";

export class Enemy implements GameObject {
  active: boolean;
  x: number;
  y: number;

  //生存時間（弾を撃つタイミングに使用）
  counter: number = 0;
  //体力
  katasa: number;
  //種類
  type: number;
  //あたり判定フラグ
  ishit: boolean = false;
  //プレイヤーの位置を知っておくため、Playerインスタンスへの参照をを保持
  player: Player;
  //打ち始めフラグ
  startshoot: boolean;
  shootnum: number;
  geometry: BoxGeometry;
  material: Material;
  mesh: Mesh;

  /**
   * コンストラクタ
   * @param プレイヤークラスのインスタンス（プレイヤーの位置を把握するため）
   */
  constructor(iplayer: Player) {
    //プレイヤーの位置を把握
    this.player = iplayer;
    //初期化時はactiveでない
    this.active = false;
  }

  /**
   * インスタンスを有効にする。インスタンスの使い回しをしているので、
   * 初期化処理もここで行う。
   * @param ix 生成する位置(X座標)
   * @param iy 生成する位置(Y座標)
   */
  activate(ix: number, iy: number) {
    this.x = ix;
    this.y = iy;
    this.type = Math.random() > 0.5 ? 0 : 1;
    this.active = true; //弾のインスタンスを有効にする
    this.katasa = 3;
    this.counter = 0;
    this.ishit = false;
    this.shootnum = Level.getLevel();
    this.startshoot = false;

    this.geometry = new BoxGeometry(24, 24, 24);
    this.material = new MeshPhongMaterial({ color: "white" });
    this.mesh = new Mesh(this.geometry, this.material);
    MyCanvas.objectpool.scene.add(this.mesh);
  }

  /**
   * プレイヤーの弾と衝突したときの振る舞い
   */
  hit() {
    //体力減らす
    this.katasa--;
    this.ishit = true;
    if (this.katasa < 0) {
      //得られる得点は敵の種類で変わる
      switch (this.type) {
        case 0:
          Score.addScore(10);
          break;
        case 1:
          Score.addScore(20);
          break;
        default:
      }
      //スコアに加算

      //爆発の生成
      MyCanvas.objectpool.newParticle(this.x, this.y, 45, 2);
      MyCanvas.objectpool.newParticle(this.x, this.y, 135, 2);
      MyCanvas.objectpool.newParticle(this.x, this.y, 225, 2);
      MyCanvas.objectpool.newParticle(this.x, this.y, 315, 2);
      this.deactivate();
    }
  }

  /**
   * 動作を規定する。メインループ１周につき一回呼ばれる
   */
  move() {
    //種類で分岐
    switch (this.type) {
      case 0:
        this.move_enemy0();
        break;
      case 1:
        this.move_enemy1();
        break;
      default:
    }
  }

  /**
   * 敵その１の動作
   */
  move_enemy0() {
    this.counter++;
    this.y++;
    //ゆらゆら
    this.x += Math.sin(this.y / 20);

    //画面外に出たら消去
    if (500 < this.y) {
      this.active = false;
      MyCanvas.objectpool.scene.remove(this.mesh);
    }

    //一定間隔で弾を撃つ
    if (this.counter % 80 == 0) {
      Bullet.FireRound(this.x, this.y);
    }

    this.mesh.position.x = this.x;
    this.mesh.position.y = Util.normalize(this.y);
  }

  /**
   * 敵その２の動作
   */
  move_enemy1() {
    this.counter++;
    var p: number = 60; //静止までの時間
    var q: number = 200; //画面のどこで静止するか
    //二次関数で動きを表現
    this.y = -q / Math.pow(p, 2) * Math.pow(this.counter - p, 2) + q;

    //画面外に出たら消去
    if (-30 > this.y) {
      this.deactivate();
    }

    //一定間隔で弾を撃つ
    if (this.counter % 60 == 0) {
      //撃ち始め
      this.startshoot = true;
    }

    //撃ち始めフラグが立っていたら、レベルと等しい回数、弾を撃つ
    if (this.startshoot) {
      if (this.counter % 5 == 0 && this.shootnum > 0) {
        Bullet.FireAim(this.x, this.y, this.player);
        this.shootnum--;
      }
    }
    this.mesh.position.x = this.x;
    this.mesh.rotation.x += 0.1;
    this.mesh.position.y = Util.normalize(this.y);
  }

  /**
   * 描画処理。
   * １ループで一回呼ばれる。
   * @param g 描画先グラフィックハンドル
   */
  draw() {
    //弾が当たっていたら色をオレンジに
    if (this.ishit) {
      //g.setColor(Color.orange);
    } else {
      switch (this.type) {
        case 0:
          //g.setColor(Color.black);
          break;
        case 1:
          //g.setColor(Color.blue);
          break;
        default:
      }
    }
    this.ishit = false;
    //g.drawRect(this.x-16, this.y-16, 32, 32);
  }
  deactivate() {
    this.active = false;
    MyCanvas.objectpool.scene.remove(this.mesh);
  }
}
