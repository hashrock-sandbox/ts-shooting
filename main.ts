import { Canvas, EventType, Rect, Surface, WindowBuilder } from "https://deno.land/x/sdl2@0.5.1/mod.ts";
import { FPS } from "https://deno.land/x/sdl2@0.5.1/examples/utils.ts";
import { Bullet, Enemy, Explosion, Sprite } from "./util.ts";

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

const bulletFrame = new Rect(120, 96, 24, 24);
const missileFrames = [
  new Rect(48, 96, 24, 24),
  new Rect(72, 96, 24, 24),
]
const bugFrames = [
  new Rect(0, 96, 24, 24),
  new Rect(24, 96, 24, 24),
]

function random(min: number, max: number) {
  return (Math.random() * (max - min) + min) | 0;
}

function createDenoInstance(x: number, y: number) {
  const origin = {
    x: 0,
    y: 8
  }
  const deno = new Sprite(texture, denoTextureFrames, origin);
  deno.class = "deno";
  deno.x = x;
  deno.y = y;
  deno.scale = 2;
  deno.vx = 0;
  deno.vy = 0;
  return deno;
}

function createBulletInstance(x: number, y: number) {
  const bullet = new Bullet(texture, [bulletFrame]);
  bullet.class = "bullet";
  bullet.scale = 2;
  bullet.vx = 1500;
  bullet.vy = 0;
  bullet.x = x;
  bullet.y = y;
  bullet.collisionSize = 8;
  return bullet;
}

function createBugInstance(x: number, y: number ){
  const bug = new Enemy(texture, bugFrames);
  bug.class = "bug";
  bug.scale = 2;
  bug.vx = -50;
  bug.vy = 0;
  bug.x = x;
  bug.y = y;
  bug.collisionSize = 8;
  return bug;
}


const deno = createDenoInstance(100, 200);

let cnt = 0;
const speed = 400
const scrollSpeed = 100;
const KEYMAP = {
  "ArrowUp": 82,
  "ArrowDown": 81,
  "ArrowLeft": 80,
  "ArrowRight": 79,
  "Z": 29,
  "Space": 44
}

class ObjectPool<T extends Sprite> {
  cleanUp() {
    const destroyed = this.pool.filter(s => s.destroyFlag);
    destroyed.forEach(s => s.onDestroy());


    this.pool = this.pool.filter(s => s.destroyFlag === false);
  } 
  pool: T[] = [];
  
  add(sprite: T) {
    this.pool.push(sprite);
  }
  remove(sprite: T) {
    this.pool = this.pool.filter(s => s !== sprite);
  }
  tickAll(delta: number) {
    this.pool.forEach(s => s.tick(delta));
  }

  drawAll(dest: Canvas) {
    this.pool.forEach(s => s.draw(dest));
  }

  removeOutOfBound(rect: Rect) {
    this.pool = this.pool.filter(s => {
      if (s.x < rect.x || s.x > rect.x + rect.width) {
        return false;
      }
      if (s.y < rect.y || s.y > rect.y + rect.height) {
        return false;
      }
      return true;
    });
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
  get primary(){
    return this.isDown(KEYMAP.Z) || this.isDown(KEYMAP.Space);
  }
}

function checkCollision<T extends Sprite>(a: ObjectPool<T>, b: ObjectPool<T>){
  a.pool.forEach(a => {
    b.pool.forEach(b => {
      if(a.isHit(b)){
        a.onHit(b);
        b.onHit(a);
      }
    });
  });
}

function frame(delta: number) {
  canv.clear();

  scrollX = scrollX + scrollSpeed * delta / 1000;
  canv.copy(bgTexture, new Rect(0, 0, canvasSize.width, canvasSize.height), new Rect(-scrollX, 0, canvasSize.width, canvasSize.height));
  canv.copy(bgTexture, new Rect(0, 0, canvasSize.width, canvasSize.height), new Rect(-scrollX + canvasSize.width, 0, canvasSize.width, canvasSize.height));
  scrollX = scrollX % canvasSize.width;

  deno.tick(delta);
  deno.draw(canv);

  enemyPool.tickAll(delta);
  enemyPool.drawAll(canv);

  bulletsPool.tickAll(delta);
  bulletsPool.drawAll(canv);
  bulletsPool.removeOutOfBound(new Rect(0, 0, canvasSize.width, canvasSize.height));

  checkCollision(enemyPool, bulletsPool);

  bulletsPool.cleanUp();
  enemyPool.cleanUp();

  canv.present();
  tick()
}

let scrollX = 0;
const keyboard = new KeyboardStack()
let time = 0;
let lastTime = performance.now();

let coolDown = 0;
const coolDownTime = 50;
const bulletsPool = new ObjectPool<Bullet>();
const bulletsMax = 2;


const enemyPool = new ObjectPool<Enemy>();

const explosionPool = new ObjectPool<Explosion>();


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
      if(keyboard.primary && coolDown <= 0 && bulletsPool.pool.length < bulletsMax){
        const bullet = createBulletInstance(deno.x + 50, deno.y);
        bulletsPool.add(bullet);
        coolDown = coolDownTime;
      }
      coolDown -= delta;

      if(time % 500 === 0){
        deno.index = (deno.index + 1) % deno.frames.length;
      }

      if(time % 10000 === 0){
        const bug = createBugInstance( canvasSize.width, random(0, canvasSize.height));
        bug.onDestroy = (self: Enemy) => {
          explosionPool.add( createExplosion(self.x, self.y));
        }
        enemyPool.add(bug);
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

function createExplosion(x: number,y: number): Explosion {
throw new Error("Function not implemented.");
}
