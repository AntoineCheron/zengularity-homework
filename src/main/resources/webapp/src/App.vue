<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import VueHighcharts from 'vue-highcharts';

Vue.use(VueHighcharts);

export default {
  name: 'app',
};
</script>

<style lang='scss'>
// Import css framework bulma + fonts
@import 'src/assets/css/style';
@import 'src/assets/css/var';
@import 'src/assets/css/bulma-custom';
@import 'node_modules/bulma/bulma';
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Roboto:400,500,700');
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import 'src/assets/css/buttons';

body {
  background-color: $background-white;

  h1 {
  	font-weight: bold;
  	font-size: 26px;
  }
}

#app {
  font-family: 'Montserrat', 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  min-height: 100vh;
}
</style>
