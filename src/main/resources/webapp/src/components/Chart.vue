<template>
<div class="chart-component">
  <div class="columns">
    <!-- This is the left part of the component, containing the chart and its controls -->
    <div class="column is-two-thirds">
      <!-- This is the top part containing the title and the buttons to control the chart content -->
      <div class="chart-toppart">
        <h2 class="dashboard-card-title">Energy storage evolution</h2>
        <div class="buttons">
          <button @click="previousPeriod" class="no-outline-button chevron-button"><span class="icon is-small"><i class="fa fa-chevron-left"></i></span></button>
          <button @click="nextPeriod" class="no-outline-button chevron-button"><span class="icon is-small"><i class="fa fa-chevron-right"></i></span></button>
          <div class="tabs is-toggle">
            <ul>
              <li @click="selectPeriod('week')" :class="selectedPeriod === 'week' ? 'is-active' : ''"><a>Week</a></li>
              <li @click="selectPeriod('month')" :class="selectedPeriod === 'month' ? 'is-active' : ''"><a>Month</a></li>
              <li @click="selectPeriod('year')" :class="selectedPeriod === 'year' ? 'is-active' : ''"><a>Year</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- This is the chart itself -->
      <highcharts :options="options"></highcharts>
    </div>
    <!-- This is the right part of the component, containing a few data -->
    <div class="column is-one-third chart-right-data">
      <!-- Current storage data -->
      <div class="single-data">
        <p class="upper-text">You currently store</p>
        <p><span class="big-number purple-text">{{ currentStorage }}</span><span class="unit">kWh</span></p>
      </div>
      <!-- Storage level data -->
      <div class="single-data">
        <p class="upper-text">Storage level</p>
        <p><span class="big-number green-text">{{ currentLevel }}</span><span class="unit">%</span></p>
      </div>
      <!-- Autonomy data -->
      <div class="single-data last">
        <p class="upper-text">In the current configuration, you will stay autonomous for another</p>
        <p v-if="autonomy !== 'Inf'"><span class="big-number yellow-text">{{ parseInt(autonomy) }}:{{ parseInt((autonomy - parseInt(autonomy)) * 60) }}</span><span class="unit">min</span></p>
        <p v-else><span class="big-number yellow-text">Forever</span></p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import HighchartsOptions from '../assets/json/highcharts-options';

export default {
  props: [
    'data',
    'currentStorage',
    'currentLevel',
    'autonomy',
  ],
  data() {
    return {
      selectedPeriod: 'week',
    };
  },
  computed: {
    options() {
      const opt = HighchartsOptions.week;
      opt.series[0].data = this.$store.getters.getProductionHistory;
      return opt;
    },
  },
  methods: {
    selectPeriod(period) {
      this.selectedPeriod = period;
      // TODO
    },
    previousPeriod() {
      // TODO
    },
    nextPeriod() {
      // TODO
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

.chart-component {
  padding: 35px;

  .chart-toppart {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 35px;

    .dashboard-card-title {
      display: inline-block;
    }

    .buttons {
      display: flex;
      flex-direction: row;
      align-items: center;

      .chevron-button {
        color: $grey;
        margin-right: 5px;

        &:hover {
          color: $green;
        }
      }

      .tabs {
        margin-left: 8px;
        display: inline-block;
        font-size: 10px;
        color: $grey;

        .is-active a {
          background-color: $green;
          border-color: $green;
        }
      }
    }
  }

  .chart-right-data {
    border-left: 1px solid $light-grey;
    display: flex;
    flex-direction: column;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>