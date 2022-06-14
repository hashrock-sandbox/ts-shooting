import { Player } from "./actor/player";
import { GameObject } from "./actor/game-object";
import { Bullet } from "./actor/bullet";
import { Enemy } from "./actor/enemy";
import { MyBullet } from "./actor/my-bullet";
import { Particle } from "./actor/particle";
import { KeyInput } from "./key-input";
import { Scene } from "three";

/**
 *ゲームオブジェクトの管理クラス<p>
 *プレイヤーや弾、敵などのインスタンスを持ち<p>
 *オブジェクト同士の相互作用（衝突処理など）を一括管理する。
 */
export class ObjectPool {
  /**
   * 敵インスタンスをあらかじめ生成し、ためておくための配列。
   */
  bullet: Bullet[];
  /**
   * 敵弾インスタンスをあらかじめ生成し、ためておくための配列。
   */
  enemy: Enemy[];
  /**
   * プレイヤーの弾インスタンスをあらかじめ生成し、ためておくための配列。
   */
  mybullet: MyBullet[];
  /**
   * 爆発インスタンスをあらかじめ生成し、ためておくための配列。
   */
  particle: Particle[];

  scene: Scene;

  /**
   * プレイヤーのインスタンス。
   */
  player: Player;

  //定数
  static DIST_PLAYER_TO_BULLET: number = 8;
  static DIST_PLAYER_TO_ENEMY: number = 16;
  static DIST_ENEMY_TO_MYBULLET: number = 24;

  //最大数の設定
  static BULLET_MAX: number = 100;
  static ENEMY_MAX: number = 100;
  static PARTICLE_MAX: number = 100;
  static MYBULLET_MAX: number = 5;

  /**
   * コンストラクタ
   */
  constructor(scene: Scene) {
    this.scene = scene;
  }

  init() {
    //プレイヤーを作る
    this.player = new Player(250, 400, 4);
    this.player.activate();

    //弾の配列を確保し、配列の要素分インスタンスを作る
    this.bullet = new Array(ObjectPool.BULLET_MAX);
    for (var i: number = 0; i < this.bullet.length; i++) {
      this.bullet[i] = new Bullet();
    }

    //敵の配列を確保し、配列の要素分インスタンスを作る
    this.enemy = new Array(ObjectPool.ENEMY_MAX);
    for (var i: number = 0; i < this.enemy.length; i++) {
      this.enemy[i] = new Enemy(this.player);
    }

    //プレイヤーの弾の配列を確保し、配列の要素分インスタンスを作る
    this.mybullet = new Array(ObjectPool.MYBULLET_MAX);
    for (var i: number = 0; i < this.mybullet.length; i++) {
      this.mybullet[i] = new MyBullet();
    }

    //爆発の配列を確保し、配列の要素分インスタンスを作る
    this.particle = new Array(ObjectPool.PARTICLE_MAX);
    for (var i: number = 0; i < this.particle.length; i++) {
      this.particle[i] = new Particle();
    }
  }

  /**
   * すべてのオブジェクトを破棄
   */
  deactivateAll() {
    this.bullet.forEach(item => {
      item.deactivate();
    });
    this.enemy.forEach(item => {
      item.deactivate();
    });
    this.mybullet.forEach(item => {
      item.deactivate();
    });
    this.particle.forEach(item => {
      item.deactivate();
    });
    this.player.deactivate();
  }

  /**
   * 描画処理。すべてのゲームオブジェクトを描画する。
   */
  drawAll() {
    this.doGameObjects(this.bullet);
    this.doGameObjects(this.enemy);
    this.doGameObjects(this.mybullet);
    this.doGameObjects(this.particle);
    this.player.draw();
  }
  /**
   * ゲームオブジェクトの配列を参照し、
   * activeになっているインスタンスを移動・描画する
   */
  doGameObjects(objary: GameObject[]) {
    for (var i: number = 0; i < objary.length; i++) {
      if (objary[i].active == true) {
        objary[i].move();
        objary[i].draw();
      }
    }
  }

  /**
   * 弾の生成・初期化（実際は配列のインスタンスを使い回す）
   * @param ix 生成先x座標
   * @param iy 生成先y座標
   * @param idirection 動かす方向
   * @param ispeed 動かす速度
   * @return 弾のID（空きが無ければ-1）
   */
  newBullet(
    ix: number,
    iy: number,
    idirection: number,
    ispeed: number
  ): number {
    for (var i: number = 0; i < ObjectPool.BULLET_MAX; i++) {
      if (this.bullet[i].active == false) {
        this.bullet[i].activate(ix, iy, idirection, ispeed);
        return i;
      }
    }
    return -1; //見つからなかった
  }

  /**
   * 敵の生成・初期化（実際は配列のインスタンスを使い回す）
   * @param ix 生成先x座標
   * @param iy 生成先y座標
   * @return 敵のID（空きが無ければ-1）
   */
  newEnemy(ix: number, iy: number): number {
    for (var i: number = 0; i < ObjectPool.ENEMY_MAX; i++) {
      if (this.enemy[i].active == false) {
        this.enemy[i].activate(ix, iy);
        return i;
      }
    }
    return -1; //見つからなかった
  }

  /**
   * プレイヤー弾の生成・初期化（実際は配列のインスタンスを使い回す）
   * @param ix 生成先x座標
   * @param iy 生成先y座標
   * @return プレイヤー弾のID（空きが無ければ-1）
   */
  newMyBullets(ix: number, iy: number): number {
    for (var i: number = 0; i < ObjectPool.MYBULLET_MAX; i++) {
      if (this.mybullet[i].active == false) {
        this.mybullet[i].activate(ix, iy);
        return i;
      }
    }
    return -1; //見つからなかった
  }

  /**
   * 爆発の生成・初期化（実際は配列のインスタンスを使い回す）
   * @param ix 生成先x座標
   * @param iy 生成先y座標
   * @param idirection 動かす方向
   * @param ispeed 動かす速度
   * @return 爆発のID（空きが無ければ-1）
   */
  newParticle(ix: number, iy: number, idirection: number, ispeed: number) {
    for (var i: number = 0; i < ObjectPool.PARTICLE_MAX; i++) {
      if (this.particle[i].active == false) {
        this.particle[i].activate(ix, iy, idirection, ispeed);
        return i;
      }
    }
    return -1; //見つからなかった
  }

  /**
   * プレイヤーが弾を撃つ
   */
  shotPlayer() {
    //プレーヤーが可視の時だけ弾が打てる
    if (this.player.active) {
      this.newMyBullets(this.player.x, this.player.y);
    }
  }

  /**
   * プレイヤーが移動する処理
   * @param keyinput キー入力クラスのインスタンス。
   */
  movePlayer(keyinput: KeyInput) {
    this.player.movePlayer(keyinput.getXDirection(), keyinput.getYDirection());
  }

  /**
   * ２点間の距離を返す
   * @param ga ゲームオブジェクト
   * @param gb 比較先ゲームオブジェクト
   * @return 距離
   */
  getDistance(ga: GameObject, gb: GameObject) {
    //三平方の定理
    var Xdiff: number = Math.abs(ga.x - gb.x);
    var Ydiff: number = Math.abs(ga.y - gb.y);
    return Math.sqrt(Math.pow(Xdiff, 2) + Math.pow(Ydiff, 2));
  }

  /**
   * 衝突判定
   */
  getColision() {
    //弾vsプレイヤーの衝突
    for (var i: number = 0; i < this.bullet.length; i++) {
      if (this.bullet[i].active && this.player.active) {
        //あたり判定
        if (
          this.getDistance(this.player, this.bullet[i]) <
          ObjectPool.DIST_PLAYER_TO_BULLET
        ) {
          //プレイヤー消滅（見えなくするだけ）
          this.player.deactivate();

          //爆発を生成
          for (var j: number = 0; j < 360; j += 20) {
            this.newParticle(this.player.x, this.player.y, j, 2);
          }

          //弾消滅
          this.bullet[i].deactivate();
        }
      }
    }

    //プレイヤーの弾vs敵の衝突
    for (var i: number = 0; i < this.enemy.length; i++) {
      if (this.enemy[i].active == true) {
        for (var j: number = 0; j < this.mybullet.length; j++) {
          if (this.mybullet[j].active == true) {
            //あたり判定
            if (
              this.getDistance(this.enemy[i], this.mybullet[j]) <
              ObjectPool.DIST_ENEMY_TO_MYBULLET
            ) {
              this.newParticle(this.mybullet[j].x, this.mybullet[j].y, 270, 2);
              //敵の体力を減らす
              this.enemy[i].hit();
              //弾消滅
              this.mybullet[j].deactivate();
            }
          }
        }
      }
    }

    //敵vsプレイヤーの衝突
    for (var i: number = 0; i < this.enemy.length; i++) {
      if (this.enemy[i].active && this.player.active) {
        //あたり判定
        if (
          this.getDistance(this.player, this.enemy[i]) <
          ObjectPool.DIST_PLAYER_TO_ENEMY
        ) {
          //プレイヤー消滅（見えなくするだけ）
          this.player.deactivate();

          //爆発を生成
          for (var j: number = 0; j < 360; j += 20) {
            this.newParticle(this.player.x, this.player.y, j, 2);
          }
          //敵は消滅しない
        }
      }
    }
  }

  /**
   * ゲームオーバーかどうかを返す
   * @return ゲームオーバーならtrue
   */
  isGameover(): boolean {
    return !this.player.active;
  }
}
