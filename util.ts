import { Canvas, Rect, Texture } from "https://deno.land/x/sdl2@0.5.1/mod.ts";

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}
type SpriteEvent = "hit" | "destroy";

export class Sprite {
  onHit() {
    if (this.eventListeners["hit"]) {
      this.eventListeners.hit();
    }
  }
  onDestroy(): void {
    if (this.eventListeners["destroy"]) {
      this.eventListeners.destroy();
    }
  }
  x = 0;
  y = 0;
  z = 0;
  vx = 0;
  vy = 0;
  originX = 0;
  originY = 0;
  scale = 1;
  texture: Texture;
  frames: Rect[];
  class = "";
  index = 0;
  aliveTime = 0;
  animationSpeed = 100;
  collisionSize = 0;
  destroyFlag = false;

  constructor(texture: Texture, frames: Rect[], origin?: Point) {
    this.texture = texture;
    this.frames = frames;
    if (origin) {
      this.originX = this.frames[0].width / 2 + origin.x;
      this.originY = this.frames[0].height + origin.y;
    } else {
      // default origin is center
      this.originX = this.frames[0].width / 2;
      this.originY = this.frames[0].height;
    }
  }

  isHit(other: Sprite) {
    const distance = Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
    );
    return distance < this.collisionSize + other.collisionSize;
  }

  draw(dest: Canvas) {
    const dst = new Rect(
      this.x - this.originX,
      this.y - this.originY - this.z,
      this.frames[this.index].width * this.scale,
      this.frames[this.index].height * this.scale
    );
    dest.copy(this.texture, this.frames[this.index], dst);
  }

  tick(delta: number) {
    this.x += (this.vx * delta) / 1000;
    this.y += (this.vy * delta) / 1000;

    this.aliveTime += delta;
    this.index =
      Math.floor(this.aliveTime / this.animationSpeed) % this.frames.length;
  }

  wrap(rect: Area) {
    this.x = ((this.x - rect.x) % rect.width) + rect.x;
    this.y = ((this.y - rect.y) % rect.height) + rect.y;
  }

  destroy() {
    this.destroyFlag = true;
  }

  eventListeners: { [key: string]: () => void } = {};
  addEventListener(type: SpriteEvent, cb: () => void) {
    this.eventListeners[type] = cb;
  }
}

export class Bullet extends Sprite {
  // onHit(other: Sprite) {
  //   this.destroy();
  // }
}

export class Enemy extends Sprite {
  hp = 0;

  onDestroy() {
    this.eventListeners["destroy"]();
  }

  constructor(texture: Texture, frames: Rect[], origin?: Point, hp = 1) {
    super(texture, frames, origin);
    this.hp = hp;
  }

  // onHit(other: Sprite) {
  //   this.hp -= 1;
  //   if (this.hp <= 0) {
  //     this.destroy();
  //   }
  // }
}

export class Explosion extends Sprite {}
