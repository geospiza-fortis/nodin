import MapleMap from "./maplemap";

/// https://github.com/NoLifeDev/NoLifeStory/blob/master/src/client/physics.cpp
const down_jump_multiplier = 0.35355339;
const epsilon = 0.00001;
const fall_speed = 670;
const float_coefficient = 0.01;
const float_drag_1 = 100000;
const float_drag_2 = 10000;
const float_multiplier = 0.0008928571428571428;
const fly_force = 120000;
const fly_jump_dec = 0.35;
const fly_speed = 200;
const gravity_acc = 2000;
const jump_speed = 555;
const max_friction = 2;
const max_land_speed = 162.5;
const min_friction = 0.05;
const shoe_fly_acc = 0;
const shoe_fly_speed = 0;
const shoe_mass = 100;
const shoe_swim_acc = 1;
const shoe_swim_speed_h = 1;
const shoe_swim_speed_v = 1;
const shoe_walk_acc = 1;
const shoe_walk_drag = 1;
const shoe_walk_jump = 1.0;
const shoe_walk_slant = 0.9;
const shoe_walk_speed = 1.0;
const slip_force = 60000;
const slip_speed = 120;
const swim_force = 120000;
const swim_jump = 700;
const swim_speed = 140;
const swim_speed_dec = 0.9;
const walk_drag = 80000;
const walk_force = 140000;
const walk_speed = 125;

class Physics {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.vx = 0;
    this.vy = 0;
    this.vr = 0;
    this.layer = 0;
    this.group = 0;
    this.fh = null;
    this.lf = null;
    this.djump = null;
  }
  update(msPerTick) {
    let mleft = this.left && !this.right;
    let mright = !this.left && this.right;
    let delta = msPerTick / 1000;
    let vx = this.vx;
    let vy = this.vy;
    let shoefloat = (float_drag_2 / shoe_mass) * delta;
    vy > 0
      ? (vy = Math.max(0, vy - shoefloat))
      : (vy = Math.min(0, vy + shoefloat));
    this.vy = Math.min(vy + gravity_acc * delta, fall_speed);
    this.vx = mleft
      ? vx > -float_drag_2 * float_multiplier
        ? Math.max(-float_drag_2 * float_multiplier, vx - 2 * shoefloat)
        : vx
      : mright
      ? vx < float_drag_2 * float_multiplier
        ? Math.min(float_drag_2 * float_multiplier, vx + 2 * shoefloat)
        : vx
      : vy < fall_speed
      ? vx > 0
        ? Math.max(0, vx - float_coefficient * shoefloat)
        : Math.min(0, vx + float_coefficient * shoefloat)
      : vx > 0
      ? Math.max(0, vx - shoefloat)
      : Math.min(0, vx + shoefloat);
    while (delta > epsilon) {
      let vx = this.vx;
      let vy = this.vy;
      let x = this.x;
      let y = this.y;
      let fh = this.fh;

      let dx1 = vx * delta;
      let dy1 = vy * delta;
      let distance = 1;
      let nnx = x + dx1;
      let nny = y + dy1;

      console.log(fh);
      console.log(delta);

      for (let f of Object.values(MapleMap.footholds || {})) {
        let dx2 = f.x2 - f.x1,
          dy2 = f.y2 - f.y1;
        let dx3 = x - f.x1,
          dy3 = y - f.y1;
        let denom = dx1 * dy2 - dy1 * dx2;
        let n1 = (dx1 * dy3 - dy1 * dx3) / denom;
        let n2 = (dx2 * dy3 - dy2 * dx3) / denom;
        if (
          n1 >= 0 &&
          n1 <= 1 &&
          n2 >= 0 &&
          denom < 0 &&
          f != this.djump &&
          n2 <= distance
        )
          if (
            this.group == f.group ||
            dx2 > 0 ||
            f.group == 0 ||
            f.cantThrough
          ) {
            nnx = x + n2 * dx1;
            nny = y + n2 * dy1;
            distance = n2;
            fh = f;
          }
      }

      x = nnx;
      y = nny;
      if (fh) {
        this.djump = null;
        let fx = fh.x2 - fh.x1,
          fy = fh.y2 - fh.y1;
        if (fh.x1 > fh.x2) {
          y += epsilon;
          fh = null;
        } else if (fh.x1 == fh.x2) {
          if (fy > 0) x += epsilon;
          else x -= epsilon;
          fh = null;
        } else {
          this.group = fh.group;
          this.layer = fh.layer;
          if (vy > max_land_speed) vy = max_land_speed;
        }
        let dot = (vx * fx + vy * fy) / (fx * fx + fy * fy);
        this.vx = dot * fx;
        this.vy = dot * fy;
        delta *= 1 - distance;
      } else {
        delta = 0;
      }
      this.x = x;
      this.y = y;
      this.fh = fh;
    }
  }
}
export { Physics };
