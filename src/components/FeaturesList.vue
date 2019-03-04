<template>
  <div class="list">
    <div class="item" v-for="(item, index) in items">
      <router-link class="link horizontal-items" :to="{ name: 'FeaturePage', params: { id: item.id }}">
        <div class="content">
          {{ item.name }}
        </div>
        <div class="controls">
          <div class="item" @click="remove(index, $event)" v-if="removable"><Icon>close</Icon></div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Icon from "@/components/Icon";
  export default {
    name: "FeaturesList",
    components: {Icon},
    props: {
      items: { type: Array },
      removable: { type: Boolean, default: false }
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
    padding: 5px 0px
    cursor: pointer
    & > .link
      text-decoration: none
      color: inherit
    &:hover
      background-color: lighten($primary-color, 10%)
      .controls
        display: inline-block
    .controls
      display: none
    &:last-child
      border-bottom: 0
</style>
