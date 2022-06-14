import { Texture, LoadingManager, ImageLoader, TextureLoader } from "three";

export class Textures {
  static particle: Texture;
  static title: Texture;
  static sky: Texture;
  static load(textureManager: LoadingManager) {
    var loader = new TextureLoader(textureManager);
    loader.load("./particle.png", function(texture) {
      Textures.particle = texture;
    });
    loader.load("./title.png", function(texture) {
      Textures.title = texture;
    });
    loader.load("./ginga.jpg", function(texture) {
      Textures.sky = texture;
    });
  }
}
