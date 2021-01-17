<template>
  <div class="entrance-box">
    <div class="entrance-bg">
      <div class="entrance">
        <div class="tit-box">
          <img src="../../assets/manticore_tit.png" alt="" class="tit" />
          <p>挑战时间：{{ cmsData.loop2[0].title }}</p>
        </div>
        <div class="box" v-if="userInfo">
          <img src="../../assets/manticore_machine.png" alt="" class="machine" />
          <div class="transcript" v-if="userInfo.has_played">
            <h1>
              我的最佳成绩：<span>{{ userInfo.best_score }}</span> 分
            </h1>
            <h2 v-if="userInfo.is_in_rank">
              暂居：<i>第</i> <span>{{ userInfo.rank }}</span> 位
            </h2>
            <h2 v-else>
              距离入榜还差：<span> {{ userInfo.rank_gap }} </span>分
            </h2>
          </div>
          <p>
            今日剩余挑战次数: <span>{{ userInfo.game_chance }}</span> 次
          </p>
          <button class="rule abs lifefestival2020_gameindex_rules_ck" @click="jumpToRule">
            <img src="../../assets/manticore_rule.png" alt="" />
          </button>
          <button class="list abs lifefestival2020_gameindex_top_ck" @click="jumpToList">
            <img src="../../assets/manticore_list.png" alt="" />
          </button>

          <button class="next isEnd" v-if="+userInfo.is_end">
            <img src="../../assets/manticore_end.png" alt="" />
          </button>
          <button
            class="next isStart lifefestival2020_gameindex_start_ck"
            @click="doGame"
            v-else-if="+userInfo.game_chance"
          >
            <img src="../../assets/manticore_start.png" alt="" />
          </button>
          <button class="next isGetChance" @click="jumpToGet" v-else>
            <img src="../../assets/manticore_get.png" alt="" />
          </button>
          <button class="lucky lifefestival2020_gameindex_draw_ck" @click="jumpToLucky"></button>
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
import { getUserInfoData } from '../../api';
import { getDelayTimestamp } from '../../utils';

import { JUMP_HOST } from '../../environment';
@Component({ name: 'Entrance' })
export default class Entrance extends Vue {
  @Prop()
  cmsData!: any;

  private userInfo: any = null;

  get source() {
    return CommonModule.source;
  }

  created() {
    this.getUserInfo();
  }

  async getUserInfo() {
    const result = await getUserInfoData({
      city_code: getQueryString('city_code') || '110000',
      utm_source: getQueryString('utm_source') || '',
      source: this.source,
    });

    if (result.isNotValid) return false;
    this.userInfo = result.data;

    console.log('getUserInfo', result.data);
  }

  doGame() {
    this.$emit('doGameBegin');
  }

  jumpToGet() {
    window.location.href = `${JUMP_HOST}/2020/zrk_life_lottery/index/${getDelayTimestamp()}?city_code=${getQueryString(
      'city_code',
    )}&utm_source=${getQueryString('utm_source')}&autoRefresh=true&task=true&`;
  }

  jumpToLucky() {
    window.location.href = `${JUMP_HOST}/2020/zrk_life_lottery/index/${getDelayTimestamp()}?city_code=${getQueryString(
      'city_code',
    )}&utm_source=${getQueryString('utm_source')}&autoRefresh=true&lottery=true&`;
  }

  jumpToList() {
    // window.location.href=`${JUMP_HOST}/2020/zrk_life_lottery/rank/${getDelayTimestamp()}?city_code=${getQueryString('city_code')}&utm_source=${getQueryString('utm_source')}&autoRefresh=true&`;
    window.location.replace(
      `${JUMP_HOST}/2020/zrk_life_home/?city_code=${getQueryString(
        'city_code',
      )}&channelcode=${getQueryString('utm_source')}`,
    );
  }

  jumpToRule() {
    this.$modal(this.cmsData.loop1[0].title, this.cmsData.loop1[0].description);
  }
}
</script>
<style lang="scss">
.entrance-box {
  width: 100vw;
  min-height: 100vh;
  background: #111c46;
  position: relative;
  overflow: auto;
  .entrance-bg {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background: url(../../assets/manticore_bg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
  .entrance {
    overflow: hidden;
  }
  img {
    display: block;
  }
  .bg {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .tit-box {
    position: relative;
    // margin-top: r(175);
    margin-left: r(67);
    width: r(626);
    height: r(385);
    img {
      width: 100%;
      position: relative;
    }
    p {
      width: r(608);
      position: absolute;
      top: r(345);
      text-align: center;
      font-size: r(28);
      font-family: PingFang SC;
      font-weight: 400;
      font-style: italic;
      color: #fef6d1;
      line-height: r(28);
    }
  }
  .box {
    position: relative;
    width: 100%;
    margin-top: r(20);
    // left: 0;
    text-align: center;
    p {
      font-size: r(24);
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 245, 221, 1);
      margin-top: r(23);
      span {
        color: rgba(255, 192, 43, 1);
      }
    }
    .next {
      width: r(485);
      height: r(93);
      margin-top: r(20);
      img {
        width: 100%;
      }
    }
  }
  .transcript {
    position: absolute;
    top: r(80);
    left: 0;
    width: 100%;
    h1,
    h2 {
      font-size: r(24);
      font-family: PingFang SC;
      font-weight: 500;
      color: #3d0b0c;
      line-height: r(24);
    }
    h1 {
      span {
        color: rgba(0, 132, 178, 1);
        font-size: r(35);
        // font-family: ZGrowth;
      }
    }
    h2 {
      margin-top: r(9);
      span {
        color: rgba(239, 82, 13, 1);
        font-size: r(35);
      }
      i {
        font-family: PingFangSC-Semibold;
        font-size: r(27);
        font-style: inherit;
      }
    }
  }
  .abs {
    width: r(119);
    height: r(119);
    position: absolute;

    img {
      width: 100%;
    }
  }
  .rule {
    top: r(0);
    right: r(44);
  }
  .list {
    top: r(136);
    right: r(44);
  }
  .machine {
    width: r(534);
    height: r(438);
    margin: 0 0 0 r(79);
  }
  .lucky {
    position: relative;
    width: r(665);
    height: r(96);
    margin: r(10) auto r(50);
    background-image: url(../../assets/manticore_blink.png);
    animation: bg-step-2 0.5s both steps(2) infinite;
    background-size: 200% 100%;
  }
}
</style>
