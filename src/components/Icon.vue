<template>
  <i class="material-icons"><slot>{{ icon }}</slot></i>
</template>

<script>
  export default {
    name: "Icon",
    props: {
      icon: String
    }
  }
</script>

<style scoped>
  .material-icons {
    font-size: inherit;
    line-height: inherit;
  }
</style>
