<template>
<div class="news card">
  <div class="news-header">
    <div class="news-header-container">
      <div class="news-icon">
        <svg :class="iconDirection" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.49 31.49" style="enable-background:new 0 0 31.49 31.49;" xml:space="preserve"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/></svg>
      </div>
      <div class="news-header-text">
        <h2 class="black-text">{{ news.powerPlant }} <span v-if="news.state === 'producing'">started</span> <span v-else>stopped</span></h2>
        <p class="grey-text">{{ time }}</p>
      </div>
    </div>
    <div class="news-header-badge" :class="colors.badge"></div>
  </div>
  <div class="news-body">
    <p class="grey-text">During the last period, it <span v-if="news.state === 'producing'">consumed </span><span v-else>produced </span><span :class="colors.consumption">{{ news.lastPeriod }}kW</span>, fixing its new stored quantity to <span class="black-text">{{ news.storage }}%</span>, at <span class="black-text">{{ news.storageQuantity }}kwh</span>.</p>
  </div>
</div>
</template>

<script type="text/javascript">
import moment from 'moment';

export default {
  props: ['news'],
  data() {
    return {

    };
  },
  computed: {
    time() {
      return moment(this.news.timestamp).calendar();
    },
    colors() {
      return {
        badge: this.news.state === 'producing' ? 'green-badge' : 'red-badge',
        consumption: this.news.state === 'producing' ? 'red-text' : 'green-text',
      };
    },
    iconDirection() {
      return this.news.state === 'producing' ? 'up' : 'down';
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

.news {
  padding: 20px 20px;

  .news-header {
    display: flex;
    margin-bottom: 15px;
    justify-content: space-between;

    .news-header-container {
      display: flex;
      flex-direction: row;

      .news-icon {
        fill: $grey;
        width: 33px;
        margin-right: 10px;
        padding-top: 3px;
      }

      .down {
        transform: rotate(90deg);
        -ms-transform: rotate(90deg); /* IE 9 */
        -webkit-transform: rotate(90deg); /* Chrome, Safari, Opera */
      }

      .up {
        transform: rotate(-90deg);
        -ms-transform: rotate(-90deg); /* IE 9 */
        -webkit-transform: rotate(-90deg); /* Chrome, Safari, Opera */
      }

      .news-header-text {
        p {
          font-weight: lighter;
          font-size: 11px;
        }
      }
    }

    .news-header-badge {
      width: 20px;
      min-width: 20px;
      height: 4px;
    }

    .green-badge {
      background-color: $green;
    }
    
    .red-badge {
      background-color: $red;
    }
  }

  .news-body {
    font-size: 12px;
  }
}
</style>