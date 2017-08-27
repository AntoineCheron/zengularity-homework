<template>
<div class="energy-distribution">
  <h2 class="dashboard-card-title top">{{ type }} distribution</h2>
  <div class="middle">
    <div v-if="distribution.length !== 0" v-for="el in distribution" class="single-el-percentage">
      <p :style="{ 'min-width': distributionLabelWidth*5.6 + 'px' }">{{ el.name }}</p>
      <progress class="progress" :class="el.color" :value="el.percentage" max="100"></progress>
      <p class="percentage">{{ el.percentage }}%</p>
    </div>
    <p v-if="distribution.length === 0" style="text-align: center">No data available</p>
  </div>
  <div class="bottom">
    <p class="grey-text">You are currently {{ actionType }}</p>
    <p><span class="current-text" :class="currentColorClass">{{ current }}</span><span class="unit"> {{ unit }}</span>
    </p>
  </div>
</div>
</template>

<script type="text/javascript">
  export default {
    props: {
      producing: Boolean,
      distribution: Array,
      current: Number,
    },
    computed: {
      type() {
        return this.producing ? 'production' : 'consumption';
      },
      actionType() {
        return this.producing ? 'producing' : 'consuming';
      },
      currentColorClass() {
        return this.producing ? 'green-text' : 'red-text';
      },
      distributionLabelWidth() {
        let max = 0;
        for (let i = 0; i < this.distribution.length; i += 1) {
          max = this.distribution[i].name.length > max ? this.distribution[i].name.length : max;
        }
        return max;
      },
    },
    data() {
      return {
        unit: 'kWh',
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/assets/css/var';

  $margin-between-parts: 35px;

  @mixin progress-colored ($color) {
    color: $color;
    &::-webkit-progress-value { background: $color; }
    &::-moz-progress-bar { background: $color; }
  }

  .energy-distribution {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 15px;

    .dashboard-card-title{
      text-align: center;
      margin-bottom: $margin-between-parts;
    }

    .middle {
      margin-bottom: $margin-between-parts;

      .single-el-percentage {
        display: flex;
        flex-wrap: no-wrap;
        justify-content: space-between;
        align-items: center;

        p {
          display: inline-block;
          font-size: 11px;
          font-weight: bold;
          color: $grey;
          margin: 0;
        }

        progress {
          display: inline-block;
          margin: 0 10px;
          height: 9px;
        }

        progress.red {
          @include progress-colored($red);
        }

        progress.purple {
          @include progress-colored($purple);
        }

        progress.green {
          @include progress-colored($green);
        }

        .percentage {
          width: 25px;
          min-width: 25px;
        }
      }
    }

    .bottom {
      font-size: 12px;
      line-height: 1;

      .current-text {
        font-size: 36px;
        font-weight: bold;
      }

      .unit {
        color: $black;
        font-weight: bold;
        font-size: 11px;
      }
    }
  }
</style>