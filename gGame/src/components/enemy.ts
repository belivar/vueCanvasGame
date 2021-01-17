import { CommonModule } from '../../store/modules/common';
class Enemy {
  w: number = 0;
  h: number = 0;
  x: number = 0;
  y: number = 0;
  words: any = '';
  pinyin: any = null;
  hp: number = 1;
  hpIndex: any = 0;
  img: any = CommonModule.enemy_img[0].img;
  enemyImgIndex = 0;
  dieImg: any = CommonModule.die_img;
  dieIndex: any = -1;
  speed: number = 1;
  titFont: number = 1;
  titH: number = 1;
  piyinFont: number = 1;
  piyinH: number = 1;
  point: number = 0;

  isDie: any = true;
  isRemove: any = true;

  constructor() {
    this.w = this.r(177 * 2);
    this.h = this.r(215 * 2);
    this.titFont = this.r(27 * 2);
    this.titH = this.r(169 * 2);
    this.piyinFont = this.r(20 * 2);
    this.piyinH = this.r(120 * 2);
  }

  create(x: any, ward: any) {
    this.speed = CommonModule.getEnemySpeed;
    this.x = this.r(x);
    this.y = 20;
    this.words = ward.w;
    this.pinyin = ward.p;
    this.point = this.pinyin.length;
    this.hp = this.pinyin.length;
    this.hpIndex = 0;
    this.enemyImgIndex = 0;
    this.dieIndex = -1;
    this.img = CommonModule.enemy_img[0].img;
    this.dieImg = CommonModule.die_img;
    this.isRemove = false;
    this.isDie = false;
  }

  act() {
    if(this.isRemove) return false;
    if (!this.isDie && this.y >= CommonModule.ctx.canvas.height / CommonModule.ratio) {
      this.isDie = true;
      this.dieImg = CommonModule.die_land_img;
      this.dieIndex = 0;
      CommonModule.putExeTime(CommonModule.exeTime - 5);
      this.dieAudio();
    }

    if (this.isDie) {
      this.dieIndex++;
      if (this.dieIndex >= this.dieImg.length * 4 - 1) {
        this.dieIndex--;
        this.remove();
        CommonModule.geneEnemy();
      }
    } else {
      this.y += this.speed;
    }

    this.draw();
  }
  draw() {
    if (CommonModule.isStop || CommonModule.isPause) {
      return false;
    }
    CommonModule.ctx.save();
    if (!this) {
      return false;
    }

    CommonModule.ctx.translate(this.x, this.y);
    if (this.isDie) {
      CommonModule.ctx.drawImage(
        this.dieImg[Math.floor(this.dieIndex / 4)],
        Math.floor(this.x - this.w / 2),
        Math.floor(this.y - this.h / 2),
        this.w,
        this.w,
      );
    } else {
      CommonModule.ctx.font = `${this.titFont}px MicrosoftYahei`;
      var a = this.y - this.h / 2;
      //贴图
      let img = CommonModule.enemy_img[Math.floor(this.enemyImgIndex / 10)];
      CommonModule.ctx.drawImage(
        img,
        Math.floor(this.x - this.w / 2),
        Math.floor(a),
        this.w,
        this.h,
      );
      this.enemyImgIndex = this.enemyImgIndex + 1;
      if (this.enemyImgIndex === 29) {
        this.enemyImgIndex = 1;
      }
      //汉字组
      CommonModule.ctx.fillStyle = 'white';
      CommonModule.ctx.fillText(this.words, this.x, a + this.titH);
      a += this.h;
      //单词组
      CommonModule.ctx.font = `bold ${this.piyinFont}px MicrosoftYahei`;
      CommonModule.ctx.fillStyle = '#FEF6D1';
      CommonModule.ctx.fillText(
        this.pinyin.substring(0, this.pinyin.length - this.hp),
        this.x,
        a - this.piyinH,
      );
    }
    CommonModule.ctx.restore();
  }
  hurt() {
    this.hp--;
    CommonModule.doAudio('shot');
    if (!this.isDie && this.hp == 0) {
      this.die();

      CommonModule.putPoint(this.point);
      CommonModule.putCheckPoints(this.point);
      CommonModule.putCheckWords({ words: this.words, type: 1 });
    }
  }
  dieAudio() {
    CommonModule.doAudio('boom');
  }
  touchTarget() {
    return false;
  }
  die() {
    this.dieIndex = 0;
    this.isDie = true;
    this.dieAudio();
  }

  remove() {
    this.isRemove = true;
  }
  check(a: any) {
    if (this.pinyin && this.hpIndex < this.pinyin.length && a == this.pinyin[this.hpIndex]) {
      this.hpIndex++;
      return true;
    } else {
      return false;
    }
  }
  r(e: number) {
    return Math.floor((+CommonModule.ratio * +CommonModule.innerWidth * e) / 750);
  }
  floor(e: number) {
    return Math.floor(e * 100) / 100;
  }
}
export default Enemy;