<template>
  <div class="list" v-if="items">
    <div class="item" v-for="(item, index) in items" :key="index">
      <div class="link horizontal-items">
        <div class="content">
          <div class="header">
            <slot :item="item" :index="index">{{ item }}</slot>
          </div>
          <div class="subheader" v-if="detailed">
            <slot name="sub" :item="item" :index="index"></slot>
          </div>
        </div>
        <div class="controls">
          <div class="item" @click="remove(item, index, $event)" v-if="removable"><Icon>close</Icon></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Icon from "@/components/Icon";
  export default {
    name: "List",
    components: {Icon},
    props: {
      items: { type: Array },
      removable: { type: Boolean, default: false },
      detailed: { type: Boolean, default: false },
      to: null
    },
    methods: {
      remove(idx) {
        if (event) event.preventDefault();
        this.$emit('remove', idx);
      }
    }
  }
</script>

<style scoped lang="sass">
@import "../assets/style.sass"

.list
  & > .item
    width: 100%
    border-bottom: 1px solid #eee
    padding: 5px 0
    cursor: pointer
    & > .link
      text-decoration: none
      color: inherit
    &:hover
      background-color: lighten($primary-color, 10%)
      .controls
        display: inline-block
        font-size: $small
    .controls
      display: none
    &:last-child
      border-bottom: 0

.subheader
  font-size: $small
  color: #7a7a7a
</style>
