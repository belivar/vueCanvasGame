<template>
  <div class="load-container">
    <div class="part-unit" ref="unit">
      <div class="process-bar-box">
        <div class="process-bar-bg"></div>
        <div class="process-bar-b">
          <div class="process-bar" :style="{ width: percent + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="tsx">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import Question from './Question.vue';
import { preloadImage, ArraryEach } from '../../utils/index';
import IMG_LIST from './imgList';
import { CommonModule } from '../../store/modules/common';
import Enemy from './enemy';
import Bullet from './bullets';
import { isWechat, isIOS, isApp, sleep } from '@ziroom/manticore/lib/utils';
@Component({ name: 'Loading' })
export default class Loading extends Vue {
  @Prop()
  propPercent!: number;

  private dataIndex: number = 0;
  private maxPercent: number = 51;
  private percent: number = 0;

  get token() {
    return CommonModule.token;
  }

  get badPlanNum() {
    return CommonModule.badPlanNum;
  }

  get bulletsNum() {
    return CommonModule.bulletsNum;
  }

  async handleLogin() {
    await CommonModule.login();
  }

  preLoadImg(src: any, callback: any) {
    var img = new Image();
    img.src = src;
    img.onload = function() {
      callback.call(img);
    };
  }
  async created() {
    await CommonModule.getUserInfo();
    if (!this.token) {
      await this.handleLogin();
    }
    this.initObjects();
  }

  mounted() {
    let _t = this;
    this.$nextTick(() => {
      this.loadResour();
    });
  }

  initObjects() {
    console.log('initObjects');
    // 飞船
    let enemy_img: any[] = [];
    for (var i = 0; i < IMG_LIST.enemy_img.length; i++) {
      let eimg: any = new Image();
      eimg.src = IMG_LIST.enemy_img[i].img;
      enemy_img.push(eimg);
      this.percent++;
    }
    CommonModule.putEnemyImg(enemy_img);
    // console.log('enemy_img', CommonModule.enemy_img);

    // 大爆炸
    let die_img: any[] = [];
    for (var i = 0; i < IMG_LIST.die_big_img.length; i++) {
      let dimg: any = new Image();
      dimg.src = IMG_LIST.die_big_img[i].img;
      die_img.push(dimg);
      // console.log(dimg);
      this.percent++;
    }
    CommonModule.putDieImg(die_img);

    // 炸弹
    let fire_img: any[] = [];
    let fimg: any = new Image();
    fimg.src = 'https://webimg.ziroom.com/3c5d74db-b2aa-4f08-9df4-340a95ca08f0.png';

    fire_img.push(fimg);
    // console.log(fimg);
    this.percent++;
    CommonModule.putFireImg(fire_img);

    //弹爆炸
    let boom_die: any[] = [];
    for (var i = 0; i < IMG_LIST.boom_die.length; i++) {
      let boom_img: any = new Image();
      boom_img.src = IMG_LIST.boom_die[i].img;
      boom_die.push(boom_img);
      // console.log(boom_img);
      this.percent++;
    }
    CommonModule.putBoomDieImg(boom_die);

    //坠机
    let die_land_img: any[] = [];
    for (var i = 0; i < IMG_LIST.die_land_img.length; i++) {
      let die_land: any = new Image();
      die_land.src = IMG_LIST.die_land_img[i].img;
      die_land_img.push(die_land);
      // console.log(die_land);
      this.percent++;
    }
    CommonModule.putBoomDieLandImg(die_land_img);

    console.log('initObjectsLoop');
    // this.$emit('doNext');
    this.addElement();
  }
  addElement() {
    for (var i = 0; i < this.badPlanNum; i++) {
      CommonModule.enemysPush(new Enemy());
    }

    for (var i = 0; i < this.bulletsNum; i++) {
      CommonModule.bulletsPush(new Bullet());
    }

    this.preloadImages();
  }
  async preloadImages() {
    return await Promise.all(
      IMG_LIST.other_img.map(async (imgObj: any) => {
        const res = await preloadImage(imgObj);
        // console.log(111, res);
        console.log(imgObj);
        this.percent++;
      }),
    );
  }

  preloadAudio(url: string, id: string, only: string) {
    let _t = this,
      audio = new Audio();
    let audio1: any = document.getElementById(only);

    if (isWechat() && document.addEventListener) {
      let play = async () => {
        audio1.muted = true;
        audio1.play();
        _t.percent++;

        document.removeEventListener('WeixinJSBridgeReady', play);
      };

      document.addEventListener('WeixinJSBridgeReady', play, false);
    } else if (isIOS()) {
      audio1.load();
      audio1
        .play()
        .then(() => {
          console.log('success');
          _t.percent++;
        })
        .catch((e: any) => {
          _t.percent++;
          console.log('e', e);
        });
    } else {
      audio.addEventListener(
        'canplaythrough',
        () => {
          _t.percent++;
        },
        false,
      );
      audio.addEventListener("error",(e:any)=>{
        _t.percent++;
      },false);
      audio.src = url;
      audio.load();
    }
  }

  private loadResour() {
    for (let i = 0; i < IMG_LIST.audio.length; i++) {
      this.preloadAudio(IMG_LIST.audio[i].mp3, IMG_LIST.audio[i].id, IMG_LIST.audio[i].only);
    }
  }
  @Watch('percent')
  watchPercent(val: number) {
    console.log(val);
    if (val === this.maxPercent) {
      this.percent = 100;
      setTimeout(() => {
        this.$emit('doNext');
      }, 2500);
    }
  }
}
</script>
<style lang="scss">
.load-container {
  width: 100vw;
  height: 100vh;
  background: #104e3d;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  .part-unit {
    position: absolute;
    background-image: url(https://phpimg.ziroom.com/bdad9729-818e-4b70-a735-48b2fcbf4813.jpg);
    width: r(750);
    height: r(674);
    left: 0;
    top: 30vh;
    animation: bg-step-8 1.2s both steps(8) infinite;
    background-size: 800% 100%;
  }
  .process-bar-box {
    position: absolute;
    width: r(480);
    height: r(67);
    left: r(135);
    top: r(500);
  }
  .process-bar-bg {
    width: 100%;
    height: 100%;
    background-image: url(../../assets/load_bg.png);
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    left: 0;
    top: 0;
  }
  .process-bar-b {
    width: r(463);
    height: r(49);
    position: absolute;
    left: r(7);
    top: r(7);
    overflow: hidden;
  }
  .process-bar {
    height: r(49);
    background: linear-gradient(-90deg, #ff7b1c 0%, #ef520d 100%);
    border-radius: r(40);
    transition: all ease 1s;
  }
  @each $step in 1, 2, 3, 4, 5, 6, 7, 8 {
    .bg-step-#{$step} {
      animation-name: bg-step-#{$step};
      animation-duration: 1s;
      animation-iteration-count: 1;
      animation-fill-mode: both;
      background-size: 8400% 100%;
      animation-timing-function: steps(14);
    }

    .bg-step-#{$step}-end {
      animation-name: bg-step-#{$step}-end;
      animation-duration: 0.6s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
      background-size: 8400% 100%;
      animation-timing-function: steps(3);
    }
    @keyframes bg-step-#{$step} {
      0% {
        background-position: 0% 0%;
      }
      100% {
        background-position: #{- ((+ $step) * 100)+'%'} 0;
      }
    }
    @keyframes bg-step-#{$step}-end {
      0% {
        background-position: 0% 0%;
      }
      100% {
        background-position: #{- ((+ $step) * 100)+'%'} 0;
      }
    }
  }
}
.process {
  position: absolute;
  width: 5.65rem;
  height: 0.56rem;
  top: 10.17rem;
  left: 2.2rem;
  border-radius: 0.4rem;
  overflow: hidden;
  z-index: 3;
  &-bar {
    width: 100%;
    height: 0.56rem;
    // background: url(../../assets/Question0/process.png) 100% 0 no-repeat;
    background-size: auto 100%;
  }
}
</style>
