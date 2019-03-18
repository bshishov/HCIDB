<template>
  <router-link
    @mouseover.native="tooltipShowFeature(feature.id)"
    @mouseout.native="tooltipHideFeature"
    @mousedown.native="tooltipHideFeature"
    :to="{ name: 'FeaturePage', params: { id: feature.id }}">
    <slot>{{ feature.name }}</slot>
  </router-link>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: "FeatureLink",
    props: {
      feature: {
        id: Number,
        name: String
      }
    },
    methods: {
      ...mapActions({
        tooltipShowFeature: 'tooltip/showFeature',
        tooltipHideFeature: 'tooltip/hideFeature'
      })
    }
  }
</script>

<style scoped>
</style>
