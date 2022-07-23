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
}


function frame() {
  canv.clear();
  deno.tick();
  deno.draw(canv);

  canv.present();
  tick()
}

let keyUp = false; //
let keyDown = false; //
let keyLeft = false; //
let keyRight = false; //

for (const event of window.events()) {
  switch (event.type) {
    case EventType.Draw:
      frame();
      if(keyUp){
        deno.y -= speed;
      }
      if(keyDown){
        deno.y += speed;
      }
      if(keyLeft){
        deno.x -= speed;
      }
      if(keyRight){
        deno.x += speed;
      }
      break;
    case EventType.Quit:
      Deno.exit(0);
      break;
    case EventType.KeyUp:
      const keycode2 = event.keysym.scancode
      if (keycode2 === 80) {
        keyLeft = false;
      }
      if (keycode2 === 82) {
        keyUp = false
      }
      if (keycode2 === 79) {
        keyRight = false
      }
      if (keycode2 === 81) {
        keyDown = false
      }
      break;
    case EventType.KeyDown:
      const keycode = event.keysym.scancode
      if (keycode === 80) {
        keyLeft = true;
      }
      if (keycode === 82) {
        keyUp = true
      }
      if (keycode === 79) {
        keyRight = true
      }
      if (keycode === 81) {
        keyDown = true
      }
      break;
    default:
      break;
  }
}