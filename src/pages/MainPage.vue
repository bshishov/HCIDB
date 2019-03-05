<template>
  <BaseLayout>
  </BaseLayout>
</template>

<script>
  import BaseLayout from "@/components/BaseLayout";

  export default {
    name: 'MainPage',
    components: {BaseLayout},
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
