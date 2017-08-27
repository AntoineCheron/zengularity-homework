<template>
<div id="home">
    <app-navbar></app-navbar>
    <div class="container">
        <div class="columns">
          <div class="column is-three-quarter">
            <!-- This router view is where we will display either the data or the power plant manager -->
            <dashboard-nav></dashboard-nav>
            <router-view></router-view>
          </div>
          <div class ="column is-one-quarter">
            <news-feed></news-feed>
          </div>
        </div>
    </div>
</div>
</template>

<script type="text/javascript">
import AppNavbar from './AppNavbar';
import NewsFeed from './NewsFeed';
import DashboardNav from './DashboardNav';

export default {
  components: {
    AppNavbar,
    NewsFeed,
    DashboardNav,
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
    
</style>