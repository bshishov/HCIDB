<i18n>
  en:
    loading: Loading...
  ru:
    loading: Загрузка...
</i18n>

<template>
  <div class="tooltip" v-show="isShowing" ref="tooltip">
    <div v-if="!!feature">
      <strong>{{ feature.name }}</strong>
      <div class="small" v-html="feature.descriptionHtml"></div>
      <References :items="feature.classifiers"></References>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import References from "@/components/References";
  export default {
    name: "FeatureTooltip",
    components: {References},
    mounted() {
      document.addEventListener('mousemove', e => {
        if(!!this.$refs.tooltip) {
          this.$refs.tooltip.style.top = e.pageY + 10 + 'px';
          this.$refs.tooltip.style.left = e.pageX + 10 + 'px';
        }
      }, false);
    },
    computed: {
      ...mapGetters({
        isShowing: 'tooltip/isShowing',
        isLoading: 'tooltip/isLoading',
        feature: 'tooltip/feature',
      }),
    }
  }
</script>

<style scoped lang="sass">
.tooltip
  mouse-events: none
  max-width: 400px
  position: absolute
  padding: 10px
  background-color: #f8f8f8
  border-radius: 5px
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)

  h3
    margin-top: 0
</style>
