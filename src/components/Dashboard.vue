<template>
<div id="dashboard">
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <energy-distribution class="tile is-child box" :producing="true" :distribution="productionDistribution" :current="currentProduction"></energy-distribution>
  </div>
  <div class="tile is-parent">
    <prod-consumption-ratio class="tile is-child box"></prod-consumption-ratio>
  </div>
  <div class="tile is-parent">
      <energy-distribution class="tile is-child box" :producing="false" :distribution="consumptionDistribution" :current="currentConsumption"></energy-distribution>
  </div>
</div>
</div>
</template>

<script type="text/javascript">
import EnergyDistribution from './EnergyDistribution';
import ProdConsumptionRatio from './ProdConsumptionRatio';

export default {
  components: {
    EnergyDistribution,
    ProdConsumptionRatio,
  },
  data() {
    return {
      productionDistribution: [
        {
          name: 'Solar',
          percentage: 32,
          color: 'green',
        },
        {
          name: 'Hydroelectric',
          percentage: 30,
          color: 'red',
        },
        {
          name: 'Biomass',
          percentage: 20,
          color: 'purple',
        },
        {
          name: 'Nuclear',
          percentage: 6,
          color: 'green',
        },
        {
          name: 'Geothermal',
          percentage: 6,
          color: 'red',
        },
        {
          name: 'Gas',
          percentage: 6,
          color: 'purple',
        },
      ],
      currentProduction: 33.3,
      consumptionDistribution: [],
      currentConsumption: 66.6,
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

#dashboard {
  
}
</style>