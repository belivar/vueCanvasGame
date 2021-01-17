import { CommonModule } from '../../store/modules/common';

class Bullet {
  w: number = 33;
  h: number = 95;
  x: number = 0;
  y: number = 0;
  deg: number = 0;
  target: any = null;
  img: any = null;
  dieImg: any = null;
  dieIndex: number = -1;
  dieLen: number = 100;
  speed: number = 30;
  speedx: number = 0;
  speedy: number = 0;
  movaIndex: number = 0;
  isDie: boolean = true;
  isRemove: boolean = true;

  constructor() {
    this.w = this.r(33);
    this.h = this.r(95);
    this.img = CommonModule.fire_img[0];
    this.dieImg = CommonModule.boom_die;
  }

  create(target: any) {
    this.w = this.r(33);
    this.h = this.r(95);
    this.x = this.r(375) - this.w / 2;
    this.y = CommonModule.ctx.canvas.height;
    this.target = target;
    this.deg = 0;
    this.isDie = false;
    this.dieIndex = -1;
    this.dieLen = 100;
    this.isRemove = false;
    this.speed = 30;
    this.speedx = 0;
    this.speedy = 0;
    this.movaIndex = 0;

    this.init(CommonModule.enemys[this.target]);
  }

  act() {
    if (this.isRemove) return false;
    if (this.target != null) {
      if (this.isDie) {
        if (CommonModule.enemys[this.target].hp > 0) {
          this.dieIndex++;
          if (this.dieIndex >= this.dieImg.length * 3 - 1) {
            this.dieIndex--;
            this.remove();
          }
        } else {
          this.remove();
        }
      } else {
        if (this.touchTarget()) {
          CommonModule.enemys[this.target].hurt();
          this.die();
        }
      }
      this.draw();
    } else {
      this.remove();
    }
    
  }

  draw() {
    CommonModule.ctx.save();

    if (this.isDie) {
      CommonModule.ctx.drawImage(
        this.dieImg[Math.floor(this.dieIndex / 3)],
        this.x,
        this.y,
        this.dieLen,
        this.dieLen,
      );
    } else {
      CommonModule.ctx.translate(this.x, this.y);
      CommonModule.ctx.rotate(this.deg);
      CommonModule.ctx.translate(-this.x, -this.y);
      CommonModule.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
      this.x -= this.speedx;
      this.y -= this.speedy;
    }
    CommonModule.ctx.restore();
  }

  touchTarget() {
    this.movaIndex++;
    return this.movaIndex >= 30;
  }

  die() {
    this.dieIndex = 0;
    this.isDie = true;
  }

  remove() {
    this.isRemove = true;
  }

  init(a: any) {
    let x = a.x * CommonModule.ratio;
    let y = a.y * CommonModule.ratio + a.speed * 30;
    this.deg = -Math.atan((x - this.x) / (y - this.y));
    this.speedx = (this.x - x) / 30;
    this.speedy = (this.y - y) / 30;
  }

  floor(e: number) {
    return Math.floor(e * 100) / 100;
  }

  r(e: number) {
    return +Math.floor((+CommonModule.ratio * +CommonModule.innerWidth * e) / 750);
  }

  fr(e: number) {
    return +Math.floor((750 * e) / (+CommonModule.ratio * +CommonModule.innerWidth));
  }
}

export default Bullet;