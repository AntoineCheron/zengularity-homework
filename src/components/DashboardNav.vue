<template>
  <nav id="dashboard-nav">
    <div>
      <router-link to="/home/dashboard" class="nav-link category-title">Dashboard</router-link>
      <router-link to="/home/power-plant-manager" class="nav-link nav-link-last category-title">Power plant manager</router-link>
    </div>
    <div>
      <button class="button green-button" @click="addPowerPlant"><span class="add-power-plant-button-span"><span class="icon is-small"><i class="fa fa-plus"></i></span> add power plant</span></button>
    </div>
  </nav>
</template>

<script type="text/javascript">
  export default {
    methods: {
      addPowerPlant() {
        // TODO
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/assets/css/var';

  #dashboard-nav {
    display: flex;
    margin-bottom: 26px;
    justify-content: space-between;

    .nav-link {
      margin-right: 40px;

      &:hover {
        color: $black;
      }
    }

    .nav-link-last {
      margin-right: 0px !important;
    }

    .router-link-active {
      border-bottom: 3px solid $green;
    }

    .add-power-plant-button-span {
      position: relative;
      top:-2px;
      left: 0px;
    }
  }
</style>