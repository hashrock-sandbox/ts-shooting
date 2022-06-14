import { Player } from "./actor/player";
import { GameObject } from "./actor/game-object";
import { Bullet } from "./actor/bullet";
import { Enemy } from "./actor/enemy";
import { MyBullet } from "./actor/my-bullet";
import { Particle } from "./actor/particle";
import { ObjectPool } from "./object-pool";
import { KeyInput } from "./key-input";
import { Title } from "./title";
import { Score } from "./score";
import { Level } from "./level";
import { Textures } from "./textures";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ImageUtils,
  Mesh,
  BoxGeometry,
  ShaderLib,
  ShaderMaterial,
  MeshPhongMaterial,
  RGBFormat,
  BackSide,
  CubeTextureLoader,
  TorusGeometry,
  FlatShading,
  PlaneGeometry
} from "three";

export class MyCanvas {
  static objectpool: ObjectPool;
  keyinput: KeyInput;
  title: Title;
  score: Score;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;

  /**
   * シーン管理変数<p>
   * 0:タイトル画面 1:ゲームのメイン画面
   */
  sceneFlag: number;
  static SCENE_TITLE: number = 0;
  static SCENE_GAMEMAIN: number = 1;

  gameover: boolean;
  counter: number;
  toruses: Mesh[] = [];

  //押されている
  static SHOT_PRESSED: number = 1;
  //今押されたばかり
  static SHOT_DOWN: number = 2;
  shotkey_state: number;

  skybox: Mesh;

  /**
   * コンストラクタ
   */
  constructor(
    body: Element,
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    //キーリスナ実装
    this.keyinput = new KeyInput();
    body.addEventListener("keydown", (e: KeyboardEvent) => {
      this.keyinput.keyPressed(e);
    });
    body.addEventListener("keyup", (e: KeyboardEvent) => {
      this.keyinput.keyReleased(e);
    });
    //this.gBuf = new Graphics(canvas.getContext("2d"));

    this.title = new Title();
    this.score = new Score();
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  /**
   * 初期化処理<p>
   * アプリケーションの開始時、またはリスタート時に呼ばれ、<br>
   * ゲーム内で使われる変数の初期化を行う。
   */
  init() {
    if (MyCanvas.objectpool) {
      MyCanvas.objectpool.deactivateAll();
    } else {
      MyCanvas.objectpool = new ObjectPool(this.scene);
    }
    MyCanvas.objectpool.init();

    //シーンはタイトル画面
    this.sceneFlag = MyCanvas.SCENE_TITLE;
    this.gameover = false;
    this.title.activate();
    //レベルの初期化
    Level.initLevel();
    //スコアの初期化
    Score.initScore();

    this.createBackground();
  }

  private createBackground() {
    var plane = new PlaneGeometry(2000, 2000, 4, 4);
    var material = new MeshPhongMaterial({
      map: Textures.sky
    });
    var mesh = new Mesh(plane, material);
    mesh.position.set(250, 250, -1000);
    MyCanvas.objectpool.scene.add(mesh);
    if (this.toruses.length === 0) {
      const TORUS_NUM = 9;
      for (let i = 0; i < TORUS_NUM; i++) {
        var torus = this.createTorus(i % 3 === 0 ? 90 : 10);
        this.toruses.push(torus);
        torus.position.x = 250;
        torus.position.y = 700 + -1000 / TORUS_NUM * i;
        MyCanvas.objectpool.scene.add(torus);
      }
    }
  }

  createTorus(size: number) {
    var geometry = new TorusGeometry(400, size, 6, 4, 3.14 * 0.9);
    var material = new MeshPhongMaterial({
      color: "#232",
      shading: FlatShading
    });
    var torus = new Mesh(geometry, material);
    torus.rotation.x = Math.PI / 2;
    torus.rotation.z = Math.PI;
    return torus;
  }

  update() {
    window.requestAnimationFrame(() => {
      this.shotkey_state = this.keyinput.checkShotKey();

      //シーン遷移用の変数で分岐
      switch (this.sceneFlag) {
        //タイトル画面
        case 0:
          /*
						this.title.drawTitle(this.gBuf);
						Score.drawScore(this.gBuf);
						Score.drawHiScore(this.gBuf);
						*/

          //スペースキーが押された
          if (this.shotkey_state == MyCanvas.SHOT_DOWN) {
            this.title.deactivate();
            //メイン画面に行く
            this.sceneFlag = MyCanvas.SCENE_GAMEMAIN;
          }
          this.renderer.render(this.scene, this.camera);

          break;

        //ゲームのメイン画面
        case 1:
          this.gameMain();
          break;
      }
      this.counter++;
      this.update();
    });
  }

  /**
   * メインループ
   */
  run() {
    this.counter = 0;
    this.update();
  }

  /**
   * ゲーム画面のメイン処理
   */
  gameMain() {
    //ゲームオーバーか？
    if (MyCanvas.objectpool.isGameover()) {
      //ゲームオーバー文字を表示
      //this.title.drawGameover(this.gBuf);
      if (this.shotkey_state == MyCanvas.SHOT_DOWN) {
        //スコアをハイスコアに適用、必要があればセーブ
        Score.compareScore();

        //ゲームを再初期化
        this.init();
      }
    }

    for (let i = 0; i < this.toruses.length; i++) {
      var torus = this.toruses[i];
      torus.position.y -= 4;
      if (torus.position.y < -300) {
        torus.position.y = 700;
      }
    }

    //衝突の判定
    MyCanvas.objectpool.getColision();
    MyCanvas.objectpool.movePlayer(this.keyinput);

    //敵出現間隔：レベルに応じて短くなる
    if (this.counter % (100 - Level.getLevel() * 10) == 0) {
      MyCanvas.objectpool.newEnemy(100 + Math.random() * 300, 0);
    }

    //500フレーム経過するとレベルが上昇
    if (this.counter % 500 == 0) {
      Level.addLevel();
    }

    //スペースキーが押されており、かつカウンタが３の倍数なら弾を撃つ（等間隔に弾を撃てる）
    if (this.shotkey_state == MyCanvas.SHOT_PRESSED && this.counter % 3 == 0) {
      MyCanvas.objectpool.shotPlayer();
    }

    //ゲームオブジェクトの一括描画処理
    MyCanvas.objectpool.drawAll();
    this.renderer.render(this.scene, this.camera);
    //スコア描画
    Score.drawScore();
    Score.drawHiScore();
  }
}
