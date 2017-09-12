<template>
<div id="dashboard">
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <energy-distribution 
      class="tile is-child box" 
      :producing="true" 
      :distribution="productionDistribution" 
      :current="currentProduction">
    </energy-distribution>
  </div>
  <div class="tile is-parent">
    <prod-consumption-ratio 
      class="tile is-child box"
      :ratio="ratio">
    </prod-consumption-ratio>
  </div>
  <div class="tile is-parent">
      <energy-distribution 
        class="tile is-child box" 
        :producing="false" 
        :distribution="consumptionDistribution" 
        :current="currentConsumption">
      </energy-distribution>
  </div>
</div>
<div class="tile is-ancestor">
  <div class="tile is-parent">
    <chart 
      class="tile is-child box"
      :currentStorage="currentStorage"
      :currentLevel="currentLevel"
      :autonomy="autonomy">
    </chart>
  </div>
</div>
</div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex';
import EnergyDistribution from './EnergyDistribution';
import ProdConsumptionRatio from './ProdConsumptionRatio';
import Chart from './Chart';

export default {
  components: {
    EnergyDistribution,
    ProdConsumptionRatio,
    Chart,
  },
  data() {
    return {
    };
  },
  computed: {
    ratio() {
      let res;

      if (this.currentConsumption === 0) {
        res = 1;
      } else {
        res = this.currentProduction / (this.currentProduction + this.currentConsumption);
      }

      return res;
    },
    // mix the getters into computed with object spread operator
    ...mapGetters({
      currentProduction: 'getTotalPowerPlantProduction',
      currentConsumption: 'getTotalPowerPlantConsumption',
      currentStorage: 'getCurrentStoredQuantity',
      currentLevel: 'getCurrentStorageLevel',
      autonomy: 'getEnergyAutonomy',
      productionDistribution: 'getProductionDistribution',
      consumptionDistribution: 'getConsumptionDistribution',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/css/var';

#dashboard {
  
}
</style>