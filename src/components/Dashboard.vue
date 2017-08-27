<template>
<div id="dashboard">
    <app-navbar></app-navbar>
    <div class="container">
        <div class="columns">
            <news-feed></news-feed>
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