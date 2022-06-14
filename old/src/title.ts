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
import { Textures } from "./textures";
import { ObjectPool } from "./object-pool";
import { MyCanvas } from "./my-canvas";

export class Title {
  //アニメーション用カウンタ
  count: number;
  geometry: PlaneGeometry;
  material: Material;
  mesh: Mesh;

  /**
   * コンストラクタ<p>
   * タイトル用に、フォントクラスのインスタンスを生成する
   */
  Title() {
    this.count = 0;
  }

  /**
   * タイトル画面の描画処理。
   * １ループで一回呼ばれる。
   * @param g 描画先グラフィックハンドル
   */
  drawTitle() {
    //g.setColor(Color.black);
    this.count++;
    /*
		g.drawString("S h o o t i n g",200,150);

        g.drawString("hit SPACE key",200,350);
        */
  }

  activate() {
    this.geometry = new PlaneGeometry(500, 500, 4, 4);
    this.material = new MeshBasicMaterial({
      map: Textures.title,
      transparent: true,
      blending: AdditiveBlending
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(250, 250, 0);
    MyCanvas.objectpool.scene.add(this.mesh);
  }

  deactivate() {
    MyCanvas.objectpool.scene.remove(this.mesh);
  }

  /**
   * ゲームオーバーの描画処理。
   * １ループで一回呼ばれる。
   * @param g 描画先グラフィックハンドル
   */
  drawGameover() {
    //g.setColor(Color.black);
    this.count++;
    /*
		g.drawString("GAMEOVER",200,150);
        */
  }
}
