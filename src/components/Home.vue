<template>
<div id="home">
    <app-navbar></app-navbar>
    <div class="container">
        <div class="columns">
          <div class="column is-three-quarter">
            <!-- This router view is where we will display either the data or the power plant manager -->
            <dashboard-nav @showPowerPlantModal="togglePowerPlantModalDisplay"></dashboard-nav>
            <router-view></router-view>
          </div>
          <div class ="column is-one-quarter">
            <news-feed></news-feed>
          </div>
        </div>
    </div>
    <!-- ADD THE ADD POWER PLANT MODAL -->
    <add-power-plant-modal 
      :is-active="showAddPowerPlantModal"
      @closeAddPowerPlantModal="togglePowerPlantModalDisplay">
    </add-power-plant-modal>
</div>
</template>

<script type="text/javascript">
import AppNavbar from './AppNavbar';
import NewsFeed from './NewsFeed';
import DashboardNav from './DashboardNav';
import AddPowerPlantModal from './AddPowerPlantModal';

export default {
  components: {
    AppNavbar,
    NewsFeed,
    DashboardNav,
    AddPowerPlantModal,
  },
  data() {
    return {
      showAddPowerPlantModal: true,
    };
  },
  methods: {
    togglePowerPlantModalDisplay() {
      this.showAddPowerPlantModal = !this.showAddPowerPlantModal;
    },
  },
};
</script>

<style lang="scss" scoped>
    
</style>