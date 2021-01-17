import store from '../';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';

interface UserInfo {
  token: string;
  uid: string;
  phone: string;
  _phone: string;
  isFirst?: boolean;
}

@Module({ dynamic: true, store, name: 'common' })
class Common extends VuexModule {
  public isStop: boolean = false;
  public isPause: boolean = false;
  public ctx: any = null;
  public exeTime: number = 0;
  public enemys: any[] = [];
  public bullets: any[] = [];
  public addEnemyTime: number = 4000;
  public enemy_img: any[] = [];
  public die_img: any[] = [];
  public fire_img: any[] = [];
  public boom_die: any[] = [];
  public die_land_img: any[] = [];
  public ratio: number = 1;
  public enemySpeed: number = 1;
  public badPlanNum: number = 10;
  public bulletsNum: number = 20;
  public innerWidth: number = window.innerWidth;
  public innerHeight: number = window.innerHeight;
  public points: number = 0;
  public words: any[] = [];
  public keyboardHeight: number = 0;
  public checkPoints: number = 0;
  public checkWords: any[] = [];
  public enemyNum: number = 0;
  public isPlay: boolean = false;
  public ememyMarLeft: number = 100;
  public ememyMarRight: number = 270;
  public wordsList: any[] = [];

  public get getEnemySpeed() {
    return this.enemySpeed;
  }

  @Mutation
  public putCtx(payload: boolean) {
    this.ctx = payload;
  }

  @Mutation
  public gameOver() {
    this.isStop = true;
    console.log('gameOver');
  }
  @Mutation
  public gamePause() {
    this.isPause = !this.isPause;
    console.log('gamePause');
  }

  @Mutation
  public putEnemyNum(payload: number) {
    this.enemyNum = payload;
  }

  @Mutation
  public putScore(payload: number) {}

  @Mutation
  public putEnemyImg(payload: any[]) {
    this.enemy_img = payload;
  }
  @Mutation
  public putDieImg(payload: any[]) {
    this.die_img = payload;
  }
  @Mutation
  public putFireImg(payload: any[]) {
    this.fire_img = payload;
  }
  @Mutation
  public putBoomDieImg(payload: any[]) {
    this.boom_die = payload;
  }
  @Mutation
  public enemysPush(payload: any) {
    if (!payload) {
      return false;
    }
    this.enemys.push(payload);
  }
  @Mutation
  public bulletsPush(payload: any) {
    if (!payload) {
      return false;
    }
    this.bullets.push(payload);
  }
  @Mutation
  public putRatio(payload: number) {
    if (!payload) {
      return false;
    }
    this.ratio = payload;
  }
  @Mutation
  public r(payload: number) {
    let r = Math.floor((this.ratio * this.innerWidth * payload) / 750);
    return r;
  }
  @Mutation
  public putEnemySpeed(payload: number) {
    if (!payload) {
      return false;
    }
    this.enemySpeed = payload;
  }
  @Mutation
  public putExeTime(payload: number) {
    if (!payload) {
      return false;
    }
    this.exeTime = payload;
  }
  @Mutation
  public putPoint(payload: number) {
    if (!payload) {
      return false;
    }
    this.points += payload;
  }
  @Mutation
  public putCheckPoints(payload: number) {
    if (~payload) {
      this.checkPoints += payload;
    } else {
      this.checkPoints = 0;
    }
  }
  @Mutation
  public putCheckWords(payload: any) {
    if (payload.words) {
      this.words.push(payload.words);
    }
    if (payload.type && payload.words) {
      this.checkWords.push(payload.words);
    } else if (!payload.type) {
      this.checkWords = [];
    }
  }

  @Mutation
  public putKeyboardHeight(payload: number) {
    if (!payload) {
      return false;
    }
    this.keyboardHeight = payload;
  }

  @Mutation
  public putBoomDieLandImg(payload: any[]) {
    if (!payload) {
      return false;
    }
    this.die_land_img = payload;
  }
  @Mutation
  public putIsPlay(payload: boolean) {
    this.isPlay = payload;
  }

  @Mutation
  public putWordsList(payload: any[]) {
    if (payload.length > 0) this.wordsList = [...this.wordsList, ...payload];
  }

  @Mutation
  public doAudio(aud: string) {
    if (!this.isPlay) return false;
    let audio = Array.from(document.getElementsByTagName('audio'));
    audio.some((e: any) => {
      if (~e.className.indexOf(aud) && (e.paused || e.ended)) {
        if (e.muted) e.muted = false;
        e.play()
          .then(() => {
          }).catch((e: any) => {console.log('e', e);});
        return true;
      }
    });
  }

  @Mutation
  public geneEnemy() {
    if (!this.isStop && !this.isPause) {
      let odd = this.enemyNum % 2 ? this.ememyMarRight : this.ememyMarLeft;
      let word = this.wordsList[this.enemyNum] ? this.wordsList[this.enemyNum] : this.wordsList[0];
      this.enemys.some((e: any) => {
        if (e.isDie && e.isRemove) {
          e.create(odd, word);
          this.enemyNum = this.enemyNum + 1;
          return true;
        }
      });
    }
  }
}

export const CommonModule = getModule(Common);
