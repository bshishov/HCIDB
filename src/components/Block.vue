<template>
  <div class="block">
    <div class="caption" v-if="caption"><slot name="caption">{{ caption }}</slot></div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Block",
    props: {
      caption: String
    }
  }
</script>

<style scoped>
  .block {
    width: 100%;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    background-color: #fcfcfc;
    padding: 10px;
    position: relative;
    margin-top: 12px;
  }

  .block > .caption {
    font-size: 0.8em;
    position: absolute;
    top: -12px;
    left: 5px;
    padding: 1px 5px;
    border-radius: 5px;
    font-weight: bold;
    background-color: #fcfcfc;
  }

  .white {
    background-color: white;
  }

  .white > .caption {
    background-color: white;
  }
</style>
