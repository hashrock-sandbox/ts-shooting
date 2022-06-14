import { MyCanvas } from "./my-canvas";
import { Textures } from "./textures";

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  LoadingManager
} from "three";

export class Game {
  constructor() {
    var width = 640;
    var height = 640;
    var scene = new Scene();

    this.createLight(scene);
    var camera = this.createCamera(width, height);

    var renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    var mc: MyCanvas = new MyCanvas(document.body, scene, camera, renderer);

    //*** キャンバスの初期化
    //
    //ゲームデータの初期化

    var textureManager = new LoadingManager();
    textureManager.onProgress = function(item, loaded, total) {
      console.log("loaded:", item);
    };

    textureManager.onLoad = () => {
      mc.init();
      mc.run();
    };

    Textures.load(textureManager);
  }

  private createCamera(width: number, height: number) {
    var camera = new PerspectiveCamera(45, width / height, 0.1, 2000000);
    camera.position.z = 500;
    camera.position.x = 250;
    camera.position.y = 250;
    return camera;
  }

  private createLight(scene: Scene) {
    var directionalLight = new DirectionalLight("#3333ff", 1);
    directionalLight.position.set(0, -1000, 1000);
    scene.add(directionalLight);
    var subLight = new DirectionalLight("#AA99FF", 0.6);
    subLight.position.set(0, 0, 1000);
    scene.add(subLight);
    var subLight2 = new DirectionalLight("#FF6699", 0.5);
    subLight2.position.set(0, 2000, -2000);
    scene.add(subLight2);
  }
}
