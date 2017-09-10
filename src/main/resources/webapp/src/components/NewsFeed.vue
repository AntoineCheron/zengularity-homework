<template>
<div id="newsfeed">
    <h1 class="category-title">Events</h1>
    <news v-for="singleEvent in events" :news="singleEvent"></news>
</div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex';
import News from './News';

export default {
  components: {
    News,
  },
  computed: {
    ...mapGetters({
      events: 'getNewsfeedEvents',
    }),
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$store.dispatch('fetchAllEvents');
    },
  },
};
</script>

<style lang="scss" scoped>
#newsfeed {
  .category-title {
    margin-bottom: 35px;
  }

  .news {
    margin-bottom: 26px;
  }
}
</style>