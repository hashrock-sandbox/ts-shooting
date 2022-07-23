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
const speed = 0.05

function frame() {
  canv.clear();
  deno.tick();
  deno.draw(canv);

  canv.present();
  tick()
}

let keyUp = false;
let keyDown = false;
let keyLeft = false;
let keyRight = false;


for (const event of window.events()) {
  console.log(event.type)
  switch (event.type) {
    case EventType.Draw:
      frame();



      
      break;
    case EventType.Quit:
      Deno.exit(0);
      break;
    case EventType.KeyDown:
      const keycode = event.keysym.scancode
      if (keycode === 80) {
        deno.x -= speed;
      }
      if (keycode === 82) {
        deno.y -= speed;
      }
      if (keycode === 79) {
        deno.x += speed;
      }
      if (keycode === 81) {
        deno.y += speed;
      }
      break;
    default:
      break;
  }
}