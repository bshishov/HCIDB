<template>
  <BaseLayout>
    <FeaturesTable></FeaturesTable>
  </BaseLayout>
</template>

<script>
  import FeaturesTable from "@/components/FeaturesTable"
  import BaseLayout from "@/components/BaseLayout";

  export default {
    name: 'MainPage',
    components: {BaseLayout, FeaturesTable},
    data () {
      return { }
    },
    mounted() {
      this.$router.push({ name: 'TablePage' });
    }
  }
</script>

<style scoped>
</style>
