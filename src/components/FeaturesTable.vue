<template>
    <div>
      <div v-for="item in items">
        {{ item.name }}
      </div>
    </div>
</template>

<script>
  import db from '../services/db';

  export default {
    name: "FeaturesTable",
    data() {
      return {
        items: []
      }
    },
    mounted() {
      db.query('{features {id name}}').then(r => {
        this.items = r.features;
      }).catch(err => {
        console.log(err);
      })
    }
  }
</script>

<style scoped>

</style>
