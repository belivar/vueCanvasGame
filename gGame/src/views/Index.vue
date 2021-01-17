<template>
  <div class="index-page">
    <Game v-if="loadEnd"></Game>
    <Loading v-else @doNext="doNext()"></Loading>
    <div class="audio-box" >
      <audio
        class="audio bgm"
        id="bgm"
        loop="loop"
        controls="controls"
        preload="auto"
        :src="require('@/assets/mp3/bgm.mp3')"
      >
        你的浏览器版本太低，不支持audio标签
      </audio>
      
      <div v-for="(item, index) in IMG_LIST.audio">
        <audio class="audio" :id="item.only" muted :class="item.id" controls="controls" preload="true" :src="item.mp3">
          你的浏览器版本太低，不支持audio标签
        </audio>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import { CommonModule } from '../store/modules/common';
import { VueType } from '../types';
import Game from '../components/game.vue';
import Loading from '../components/loading.vue';
import { getDelayTimestamp, isBaiduApp } from '../utils/index';
import IMG_LIST from '../components/imgList';

@Component({ name: 'index', components: { Game, Loading } })
export default class Index extends Vue implements VueType {
  private cmsData: any = null;
  private gatewayData: any = null;
  private getJoinDetailData: any = null;
  private gameBegin: boolean = false;
  private IMG_LIST: any = IMG_LIST;
  private loadEnd: boolean = false;

  async beforeMount() {
    
  }

  doNext() {
    this.loadEnd = true;
  }
}
</script>

<style lang="scss">
.index-page {
  .audio {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 20;
    width: 1rem;
    height: 1rem;
    background: #fff;
    opacity: 0;
  }
}
</style>
