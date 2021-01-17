<template>
  <div class="game" id="game">
    <div class="parent" :style="{ opacity: isPause || isStop ? 0 : 1 }">
      <canvas id="cas" ref="canvas">您的浏览器不支持canvas，请更新浏览器</canvas>
    </div>
    <div class="top">
      <!-- <img @click="doStopPop(0)" src="../../assets/stop.png" alt="" class="stop" /> -->
      <img
        @click="handlePlay('commit')"
        src="../../assets/audio.png"
        v-if="isPlay"
        alt=""
        class="stop"
      />
      <img @click="handlePlay('btn')" src="../../assets/no_audio.png" v-else alt="" class="stop" />
      <div class="time">
        <p>{{ isStop ? 0 : exeTime }}s</p>
        <div class="step-box">
          <img src="../../assets/step_bg.png" alt="" class="steps step-bg" />
          <div class="step steps">
            <div class="step-img" :style="{ width: this.doStep() }"></div>
          </div>
        </div>
      </div>
      <p class="die-word">
        已获得 <span>{{ points }}</span
        > 分
      </p>
    </div>

    <div id="keyboard" :class="{keyboardErr: keyboardErr}" :style="{'padding-bottom': judgeBigScreen ? '30px' : '10px'}" ref="keyboard">
      <template v-for="(item, index) in keyboard">
        <div class="i-w" @click="doKeyboard(item.name)" v-if="item.type === 1">
          <div class="key-item">{{ item.name }}</div>
        </div>
        <div class="i-w-half-blank" v-else-if="item.type === 2"></div>
        <div class="i-w-blank" v-else-if="item.type === 3"></div>
      </template>
    </div>

    <div class="pause" @click="doStopPop(1)" v-if="isPause && !isPauseLoading">
      <img src="../../assets/pause.png" alt="" />
    </div>

    <div class="isStop isStar" v-if="showStar">
      <img class="slide-fade-enter-active" src="../../assets/start.png" alt="" />
    </div>

    <div class="isStop" v-if="isStop">
      <img class="slide-fade-enter-active" src="../../assets/timeup.png" alt="" />
    </div>
    
  </div>
</template>
<script lang="tsx">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { preloadImage, ArraryEach, judgeBigScreen, isWechat, isIOS, sleep, isAndroid, getDelayTimestamp, isBaiduApp } from '../utils/index';
import IMG_LIST from './imgList';
import { CommonModule } from '../store/modules/common';
import keyboard  from './data';
import Enemy from './enemy';
import Bullet from './bullets';

let canvas: any = null;
let ctx: any = null;

@Component({ name: 'Game' })
export default class Game extends Vue {
  @Prop() banner?: string;

  private nowStep: number = 0;
  private preName: string = '';
  private isStep: boolean = false;
  private nowName: string = '';
  private bg: string = '';
  private keyboard: any = keyboard;
  private player_img: any = null;
  private player_err_img: any = null;
  private enemy_img: any = null;
  private die_img: any = null;
  private fire_img: any = null;
  private bullet_img: any = null;
  private percent: number = 0;
  private timeInt: any = null;
  private myReq: any = null;
  private scrollIndex: number = 0;
  private _ANITIME: any;
  private _CKECKTIME: any;
  private isPauseLoading: boolean = false;
  private IMG_LIST: any = IMG_LIST;
  private gtoken: string = '';
  private gid: string = '';
  private check_time: number = 0;
  private check_time_save: number = 0;
  private intervalNext: boolean = true;
  private keyboardErr: boolean = false;
  private judgeBigScreen: boolean = false;
  private checkNum: number = 0;
  private is_pause: number = 0;

  get isPause() {
    return CommonModule.isPause;
  }
  get isStop() {
    return CommonModule.isStop;
  }
  get enemys() {
    return CommonModule.enemys;
  }
  get exeTime() {
    return CommonModule.exeTime;
  }
  get enemySpeed() {
    return CommonModule.enemySpeed;
  }
  get bullets() {
    return CommonModule.bullets;
  }
  get addEnemyTime() {
    return CommonModule.addEnemyTime;
  }
  get points() {
    return CommonModule.points;
  }
  get words() {
    return CommonModule.words;
  }
  get checkPoints() {
    return CommonModule.checkPoints;
  }
  get checkWords() {
    return CommonModule.checkWords;
  }
  get enemyNum() {
    return CommonModule.enemyNum;
  }
  get isPlay() {
    return CommonModule.isPlay;
  }

  get showStar() {
    return this.enemys[0].isRemove && this.enemyNum < 1;
  }

  get wordsList() {
    return CommonModule.wordsList;
  }

  get getIsbaidu() {
    return isBaiduApp() && isAndroid();
  }
  

  async created() {
  }


  mounted() {
    let _t = this;
    this.judgeBigScreen = judgeBigScreen();
    this.$nextTick(() => {
      CommonModule.putKeyboardHeight((this.$refs.keyboard as any).getBoundingClientRect().height);
      this.initPlay();
      this.initCanvas();
      this.start();
    });
    document.addEventListener('visibilitychange', () => {
      const pageHidden = document.hidden;
      if (pageHidden) {
        clearInterval(this._ANITIME);
        clearInterval(this.timeInt);
        clearTimeout(this._CKECKTIME);
        this.check_time_save = this.check_time;
        this.check_time = 0;
        _t.handlePlay('commit');

      } else if(!pageHidden) {
        this.doTimeInt();
        _t.handlePlay('btn');
        this.is_pause = 1;
        this.check_time = this.check_time_save;
        this.check_time_save = 0;
      }
    });
  }

  doKeyboard(name: string) {
    let _t = this;
    if (!this.isStop && !this.isPause && this.enemys.length > 0) {
      let enemysChild: any = null;
      this.enemys.some((v, t) => {
        if (!v.isDie && !v.isRemove && v.check(name)) {
          enemysChild = t;
          this.doAudioRight();
          return true;
        }
      });
      if (enemysChild !== null) {
        _t.bullets.some((e: any)=>{
        if(e.isDie && e.isRemove) {
          e.create(enemysChild);
          return true;
        }
      })
        
      } else {
        console.log('没找到');
        _t.keyboardErr = true;
        _t.doAudioErr();
      }
    }
  }

  doAudioErr() {
    CommonModule.doAudio('typerror');
  }

  doAudioRight() {
    console.log('typeright');
    // CommonModule.doAudio('typeright');
  }

  doStopPop(type: number) {
    console.log('doStopPop');
    if (this.isStop) return false;
    if (type) {
      this.isPauseLoading = true;
      this._ANITIME = null;
      this.scrollIndex = 0;
      this._ANITIME = setInterval(this.aniScroll, 1000);
    } else {
      CommonModule.gamePause();
    }
  }

  private aniScroll() {
    this.scrollIndex = this.scrollIndex + 1;
    if (this.scrollIndex === 4) {
      clearInterval(this._ANITIME);
      this.isPauseLoading = false;
      CommonModule.gamePause();
    }
  }

  initCanvas() {
    console.log('初始化canvas');
    // canvas = document.getElementById('cas');
    canvas = this.$refs.canvas;
    CommonModule.putCtx(canvas.getContext('2d'));

    let tio = +this.getPixelRatio();
    CommonModule.putRatio(tio);
    let kheight = CommonModule.keyboardHeight;

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = Math.floor(window.innerHeight - kheight) + 'px';

    canvas.setAttribute('width', window.innerWidth * tio);
    canvas.setAttribute('height', (window.innerHeight - kheight) * tio);

    CommonModule.ctx.fillStyle = '#000';
    CommonModule.ctx.textBaseline = 'middle';
    CommonModule.ctx.textAlign = 'center';
    
    window.RAF = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
    this.loop();
  }
  getPixelRatio() {
    // var devicePixelRatio = window.devicePixelRatio || 1;
    // var backingStoreRatio =
    //   CommonModule.ctx.webkitBackingStorePixelRatio ||
    //   CommonModule.ctx.mozBackingStorePixelRatio ||
    //   CommonModule.ctx.msBackingStorePixelRatio ||
    //   CommonModule.ctx.oBackingStorePixelRatio ||
    //   CommonModule.ctx.backingStorePixelRatio ||
    //   1;
    // var ratio = devicePixelRatio / backingStoreRatio;
    return 2;
  }

  start() {
    CommonModule.putExeTime(120);
    this.doTimeInt();
  }
  doTimeInt() {
    let _t = this;
    
    this.timeInt = setInterval(() => {
      if (_t.isStop || _t.isPause || _t.exeTime <= 0) {
        return false;
      }
      if(this.intervalNext && this.wordsList.length > 0 ) {
        this.intervalNext = false;
        CommonModule.geneEnemy();
      }
      let num: number = _t.exeTime - 1;
      CommonModule.putExeTime(num);
      if (num % 20 === 0) {
        CommonModule.putEnemySpeed(_t.enemySpeed + 0.3);
        console.log('加速!', _t.enemySpeed);
      }

      if (_t.exeTime <= 1) {
        clearTimeout(_t.timeInt);
        _t.timeInt = null;
        CommonModule.gameOver();
      }

      if(_t.keyboardErr) {
        _t.keyboardErr = false;
      }
    }, 1000);
  }

  loop() {
    let _t = this;
    if (this.isStop || this.isPause) {
      return false;
    }
    this.update();
    this.myReq = window.RAF(function() {
      _t.loop();
    });
  }
  update() {
    let _t = this;
    CommonModule.ctx.clearRect(
      0,
      0,
      Math.floor(window.innerWidth * CommonModule.ratio),
      Math.floor(window.innerHeight * CommonModule.ratio),
    );

    ArraryEach(this.enemys, function(a: any) {
      if (!a.isRemove) {
        a.act();
      }
    });

    ArraryEach(this.bullets, function(a: any) {
      if (!a.isRemove) {
        a.act();
      }
    });
  }

  
  r(e: number) {
    return +Math.floor((+CommonModule.ratio * +CommonModule.innerWidth * e) / 750);
  }
  doStep() {
    return `${this.isStop ? 0 : (this.exeTime / 120) * 100}%`;
  }

  async initPlay() {
    let audio: any = document.getElementById('bgm');

    //客户端抛出事件"WeixinJSBridgeReady"
    if (isWechat() && document.addEventListener) {
      document.addEventListener(
        'WeixinJSBridgeReady',
        () => {
          setTimeout(() => {
            audio.play();
            this.handleAudio(audio.audio.paused);
          }, 0);
        },
        false,
      );
    } else if(this.getIsbaidu) {

    } else if (!isIOS()) {
      setTimeout(() => {
        audio.play();
      }, 0);
      let touchPlay = async () => {
        const audio: any = document.getElementById('bgm');
        console.log('click', audio);
        audio.play();
        this.handleAudio(audio.paused);
        document.removeEventListener('click', touchPlay, false);
      };
      if (audio.paused) {
        document.addEventListener('click', touchPlay, false);
      }
    } else {
      // audio.play();
      // this.handleAudio(audio.paused);
    }
  }

  async handleAudio(paused: boolean) {
    if (!paused) {
      CommonModule.putIsPlay(true);
    } else {
      CommonModule.putIsPlay(false);
    }
  }
  async handlePlay(type: string = '') {
    if(!this.getIsbaidu) {
      const audio: any = document.getElementById('bgm');
      if (type !== 'commit' && audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      this.handleAudio(type === 'btn' ? audio.paused : true);
    } else {
      this.handleAudio(type === 'btn' ? this.isPlay : true);
    }
    
  }

  beforeDestroy() {
    console.log('Destroy');
    this.handlePlay('commit');
    clearInterval(this._ANITIME);
    clearInterval(this.timeInt);
    clearTimeout(this._CKECKTIME);
  }

  @Watch('isPause')
  watchPause(val: boolean) {
    console.log('1', val);
    if (!val) {
      this.loop();
    }
  }
  @Watch('exeTime')
  watchExeTimee(val: number) {
    if (val < 0) {
      clearTimeout(this.timeInt);
      this.timeInt = null;
      CommonModule.gameOver();
    }
  }

  @Watch('isStop')
  watchIsStop(val: number) {
    if (val) {
      this.check_time = 0;
      clearInterval(this._ANITIME);
      clearInterval(this.timeInt);
      clearTimeout(this._CKECKTIME);
      sleep(2000);
      this.doEnd();
    }
  }

  @Watch('check_time')
  watchCheckTime(val: number) {
    if (val) {
      clearTimeout(this._CKECKTIME);
      this._CKECKTIME = null;
      if(this.exeTime < 10 ) return false;
      
      this._CKECKTIME = setTimeout(() => {
        this.check_time = 0;
        this.docheck();
        clearTimeout(this._CKECKTIME);
      }, val);
    }
  }

  
}
</script>
<style lang="scss">
@import '../../styles/game.scss';
.parent {
  // transform:scale(0.5,0.5);//父元素缩小两倍
  // zoom:0.5;
}
.top {
  width: 100%;
  height: r(100);
  border: 1px solid #67350b;
  background: linear-gradient(0deg, #3d0b0c 0%, #003979 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  .stop {
    width: r(82);
    margin-left: r(36);
  }
  .time {
    display: flex;
    align-items: center;
    margin-left: r(77);
    width: r(265);
    position: relative;
    p {
      font-size: r(33);
      font-family: PingFang SC;
      font-weight: 600;
      font-style: italic;
      color: #fff0c0;
      line-height: r(33);
      margin-right: r(8);
      // width: r(77);
      position: absolute;
    }
    .step-box {
      position: relative;
      width: r(181);
      height: r(51);
      margin-left: r(90);
      .steps {
        position: absolute;
        left: 0;
        right: 0;
      }
      .step-bg {
        width: r(181);
        height: r(51);
      }
      .step {
        width: r(167);
        height: r(36);
        top: r(7);
        left: r(6);
        .step-img {
          width: 100%;
          height: 100%;
          // border: 1px solid #12708d;
          background: linear-gradient(-90deg, #208dc5 0%, #51dcd8 100%);
          border-radius: r(17);
        }
      }
    }
  }
  .die-word {
    font-size: r(24);
    font-family: PingFang SC;
    font-weight: 600;
    font-style: italic;
    color: #338ecd;
    line-height: r(28);
    margin-left: r(90);

    span {
      font-size: r(28);
      color: rgba(248, 114, 53, 1);
    }
  }
}
#keyboard {
  width: r(750);
  // height: r(273);
  background: #111c46;
  border: 1px solid #67350b;
  opacity: 1;
  transition: .3s all;
}
#keyboard.keyboardErr {
  background: #893737;
}
.game {
  background: url(../../assets/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
}
.pause {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  top: 0;
  left: 0;
  img {
    width: r(400);
    height: r(558);
  }
}
.pause-ani {
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 6;
  img {
    width: r(106);
    height: r(171);
  }
}
.animation-banner {
  width: 100%;
  height: r(1163);
  position: relative;

  .bg {
    width: 100%;
  }

  @each $step in 1, 2, 3, 4, 5, 6 {
    .index-#{$step} {
      position: absolute;
      z-index: #{$step};
    }
  }
}
.isStop {
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 6;
  img {
    width: r(521);
    height: r(91);
  }
}
.isStar {
  img {
    width: r(402);
    height: r(95);
  }
}
.slide-fade {
  -webkit-transform: none;
  transform: none;
}
.slide-fade-enter-active {
  // -webkit-transition: all .8s scale(1);
  // transition: all .8s scale(2);
  opacity: 1;
  animation: bounce-in 0.5s;
}
.slide-fade-leave-active {
  opacity: 0;
  // // -webkit-transition: all .8s scale(2);
  // // transition: all .8s scale(2);
  // animation: bounce-in .5s reverse;
  -webkit-transform: none;
  transform: none;
}
.slide-fade-enter {
  opacity: 1;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
.slide-fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
