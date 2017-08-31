<template>
<div id="newsfeed">
    <h1 class="category-title">Events</h1>
    <news v-for="singleNews in news" :news="singleNews"></news>
</div>
</template>

<script type="text/javascript">
import News from './News';

export default {
  components: {
    News,
  },
  // props: ['news'],
  data() {
    return {
      // TODO : remove those fake data. They are used only to test the UI.
      news: [
        {
          powerPlant: 'Centrale 1',
          state: 'producing',
          lastPeriod: 18.5,
          storage: 42,
          storageQuantity: 19,
          timestamp: 1503523672205,
        },
        {
          powerPlant: 'Centrale 3',
          state: 'producing',
          lastPeriod: 18.5,
          storage: 42,
          storageQuantity: 19,
          timestamp: 1503520672205,
        },
        {
          powerPlant: 'Nuclear of the future',
          state: 'consuming',
          lastPeriod: 18.5,
          storage: 42,
          storageQuantity: 19,
          timestamp: 1500523672205,
        },
      ],
    };
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