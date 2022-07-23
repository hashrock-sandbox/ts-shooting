import { EventType, Rect, Surface, WindowBuilder } from "https://deno.land/x/sdl2@0.5.1/mod.ts";
import { FPS } from "https://deno.land/x/sdl2@0.5.1/examples/utils.ts";
import { Sprite } from "./util.ts";

const canvasSize = { width: 640, height: 480 };
const window = new WindowBuilder(
  "Deno Shooting",
  canvasSize.width,
  canvasSize.height,
).build();
const canv = window.canvas();

const surface = Surface.fromFile("./assets/sprite-stg.png");

const creator = canv.textureCreator();
const texture = creator.createTextureFromSurface(surface);
const tick = FPS();

const denoTextureFrames = [
  new Rect(0, 0, 40, 32),
];


function random(min: number, max: number) {
  return (Math.random() * (max - min) + min) | 0;
}

function createDenoInstance() {
  const deno = new Sprite(texture, denoTextureFrames);
  deno.x = random(0, canvasSize.width);
  deno.y = random(0, canvasSize.height);
  deno.originX = deno.frames[0].width / 2;
  deno.originY = deno.frames[0].height;
  deno.scale = 2;
  deno.vx = 0;
  deno.vy = 0;
  return deno;
}

const deno = createDenoInstance();

let cnt = 0;
const speed = 0.1

const KEYMAP = {
  "ArrowUp": 82,
  "ArrowDown": 81,
  "ArrowLeft": 80,
  "ArrowRight": 79,
}

class KeyboardStack {
  _keys: Set<number> = new Set();
  isDown(keycode: number) {
    return this._keys.has(keycode);
  }

  down(keycode: number){
    this._keys.add(keycode);
  }
  up(keycode: number){
    this._keys.delete(keycode);
  }

  get arrowUp(){
    return this.isDown(KEYMAP.ArrowUp);
  }
  get arrowDown(){
    return this.isDown(KEYMAP.ArrowDown);
  }
  get arrowLeft(){
    return this.isDown(KEYMAP.ArrowLeft);
  }
  get arrowRight(){
    return this.isDown(KEYMAP.ArrowRight);
  }
}


function frame() {
  canv.clear();
  deno.tick();
  deno.draw(canv);

  canv.present();
  tick()
}


const keyboard = new KeyboardStack()

for (const event of window.events()) {
  switch (event.type) {
    case EventType.Draw:
      frame();
      if(keyboard.arrowUp){
        deno.y -= speed;
      }
      if(keyboard.arrowDown){
        deno.y += speed;
      }
      if(keyboard.arrowLeft){
        deno.x -= speed;
      }
      if(keyboard.arrowRight){
        deno.x += speed;
      }
      break;
    case EventType.Quit:
      Deno.exit(0);
      break;
    case EventType.KeyUp:
      keyboard.up(event.keysym.scancode);
      break;
    case EventType.KeyDown:
      keyboard.down(event.keysym.scancode);
      break;
    default:
      break;
  }
}