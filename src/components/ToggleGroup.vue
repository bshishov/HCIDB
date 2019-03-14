<template>
  <div class="toggle-group">
    <div @click="isShowing = !isShowing" class="toggle">
      <slot name="header" ></slot>
    </div>
    <slot v-if="isShowing"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShowing: false
      }
    },
    name: "ToggleGroup"
  }
</script>

<style scoped lang="sass">
.toggle
  cursor: pointer
  border-bottom: 1px dashed black
</style>
