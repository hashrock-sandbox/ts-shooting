import { Canvas, EventType, Rect, Surface, WindowBuilder } from "https://deno.land/x/sdl2@0.5.1/mod.ts";
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
const bgSurface = Surface.fromFile("./assets/bg.png");

const creator = canv.textureCreator();
const texture = creator.createTextureFromSurface(surface);
const bgTexture = creator.createTextureFromSurface(bgSurface);
const tick = FPS();

const denoTextureFrames = [
  new Rect(0, 0, 40, 32),
  new Rect(40, 0, 40, 32),
];


function random(min: number, max: number) {
  return (Math.random() * (max - min) + min) | 0;
}

function createDenoInstance() {
  const deno = new Sprite(texture, denoTextureFrames);
  deno.class = "deno";
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
const speed = 400
const scrollSpeed = 100;
const KEYMAP = {
  "ArrowUp": 82,
  "ArrowDown": 81,
  "ArrowLeft": 80,
  "ArrowRight": 79,
}

class ObjectPool { 
  pool: Sprite[] = [];
  
  add(sprite: Sprite) {
    this.pool.push(sprite);
  }
  remove(sprite: Sprite) {
    this.pool = this.pool.filter(s => s !== sprite);
  }

  drawAll(dest: Canvas) {
    this.pool.forEach(s => s.draw(dest));
  }
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


function frame(delta: number) {
  canv.clear();

  scrollX = scrollX + scrollSpeed * delta / 1000;
  canv.copy(bgTexture, new Rect(0, 0, canvasSize.width, canvasSize.height), new Rect(-scrollX, 0, canvasSize.width, canvasSize.height));
  canv.copy(bgTexture, new Rect(0, 0, canvasSize.width, canvasSize.height), new Rect(-scrollX + canvasSize.width, 0, canvasSize.width, canvasSize.height));
  scrollX = scrollX % canvasSize.width;

  deno.tick();
  deno.draw(canv);

  canv.present();
  tick()
}

let scrollX = 0;
const keyboard = new KeyboardStack()
let time = 0;
let lastTime = performance.now();

for (const event of window.events()) {
  const now = performance.now();
  const delta = now - lastTime;
  const speedDelta = delta / 1000 * speed;

  switch (event.type) {
    case EventType.Draw:
      frame(delta);
      time++
      if(keyboard.arrowUp){
        deno.y -= speedDelta;
      }
      if(keyboard.arrowDown){
        deno.y += speedDelta;
      }
      if(keyboard.arrowLeft){
        deno.x -= speedDelta;
      }
      if(keyboard.arrowRight){
        deno.x += speedDelta;
      }

      if(time % 500 === 0){
        deno.index = (deno.index + 1) % deno.frames.length;
      }

      lastTime = now;
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