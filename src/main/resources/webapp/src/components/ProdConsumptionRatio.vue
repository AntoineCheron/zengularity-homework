<template>
<div class="prod-consumption-ratio">
  <h2 class="dashboard-card-title top">Production / Consumption</h2>
  <div class="icon">
    <div class="percentages">
      <p><span class="big-number">{{ parseInt(ratio * 100) }}</span><span class="small-text">%</span></p>
      <p><span class="big-number right">{{ parseInt((1 - ratio) * 100) }}</span><span class="small-text">%</span></p>
    </div>
    <div>
    <svg width="142" height="130">
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dashboard-screen" transform="translate(-503.000000, -386.000000)"><g id="Dashboard-content" transform="translate(86.000000, 110.000000)"><g id="Conso/prod-gloabl" transform="translate(326.000000, 62.000000)"><g id="Icon" transform="translate(76.000000, 110.000000)"><g id="link" transform="translate(15.000000, 104.000000)"><rect id="Rectangle-14" stroke="#939DA3" stroke-width="4" x="16" y="76" width="108" height="47" rx="8"></rect><rect id="Rectangle-2" fill="#FFFFFF" x="14" y="74" width="112" height="34"></rect></g></g></g></g></g></g>
      <g class="production-part">
        <rect width="36" height="100" class="production-bar-bg"></rect>
        <rect width="36" :height="ratio * 100" :y="100 - (ratio*100)" class="production-bar-level"></rect>
      </g>
      <g class="consumption-part">
        <rect width="36" height="100" x="106" class="consumption-bar-bg"></rect>
        <rect width="36" :height="(1 - ratio) * 100" :y="100 - ((1 - ratio)*100)" x="106" class="consumption-bar-level"></rect>
      </g>
    </svg>
    </div>
  </div>
  <h2 v-if="ratio > 1" class="production-label green-text">Producing !</h2>
  <h2 v-if="ratio < 1" class="production-label red-text">Consuming !</h2>
  <h2 v-if="ratio === 1" class="production-label purple-text">Balanced !</h2>
</div>
</template>

<script type="text/javascript">
export default {
  props: {
    ratio: Number,
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

$margin-between-parts: 25px;

.prod-consumption-ratio {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 15px;

  .dashboard-card-title{
    text-align: center;
    margin-bottom: $margin-between-parts;
  }

  .icon{
    width: 142px;
    height: 154px;
    align-self: center;
    flex-direction: column;

    .percentages {
      width: 142px;
      min-height: 27px;
      display: flex;
      justify-content: space-between;

      p {
        display: inline-block;
      }

      .right {
        text-align: right;
      }

      .big-number {
        font-size: 22px;
        font-weight: bold;
        color: $black;
      }

      .small-text {
        font-size: 8px;
        color: $black;
      }
    }

    .production-part {
      .production-bar-bg {
        fill: $green;
        opacity: 0.15;
      }

      .production-bar-level {
        fill: $green;
      }
    }

    .consumption-part {
      .consumption-bar-bg {
        fill: $red;
        opacity: 0.15;
      }

      .consumption-bar-level {
        fill: $red;
      }
    }
  }

  .production-label {
    @extend .dashboard-card-title;
    margin-bottom: 0px !important;
    margin-top: $margin-between-parts;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>