<template>
<div id="home">
    <app-navbar></app-navbar>
    <div class="container">
        <div class="columns">
          <div class="column is-three-quarter">
            <!-- This router view is where we will display either the data or the power plant manager -->
            <router-view></router-view>
          </div>
          <div class ="column is-one-third">
            <news-feed></news-feed>
          </div>
        </div>
        
    </div>
</div>
</template>

<script type="text/javascript">
import AppNavbar from './AppNavbar';
import NewsFeed from './NewsFeed';

export default {
  components: {
    AppNavbar,
    NewsFeed,
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
    
</style>