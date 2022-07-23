import { Canvas, Rect, Texture } from "https://deno.land/x/sdl2@0.5.1/mod.ts";

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point{
  x: number;
  y: number;
}

export class Sprite {
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

  draw(dest: Canvas) {
    const dst = new Rect(
      this.x - this.originX,
      this.y - this.originY - this.z,
      this.frames[this.index].width * this.scale,
      this.frames[this.index].height * this.scale,
    );
    dest.copy(this.texture, this.frames[this.index], dst);
  }

  tick(delta: number) {
    this.x += this.vx * delta / 1000;
    this.y += this.vy * delta / 1000;
  }

  wrap(rect: Area) {
    this.x = (this.x - rect.x) % rect.width + rect.x;
    this.y = (this.y - rect.y) % rect.height + rect.y;
  }
}