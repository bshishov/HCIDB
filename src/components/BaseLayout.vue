<template>
  <!-- TODO: Add sidebars? -->
  <div class="container">
    <slot name="title"></slot>
    <slot></slot>
  </div>
</template>

<script>
  import Notification from "@/components/Notification";
  export default {
    name: 'BaseLayout',
    components: { Notification },
    data: () => ({
      leftPanel: null,
      rightPanel: false,
    }),
    props: {
      source: String
    }
  }
</script>

<style>
</style>
