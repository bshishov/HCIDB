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

  const paddingLeft = 10;
  const paddingTop = 10;

  export default {
    name: "FeatureTooltip",
    components: {References},
    data() {
      return {
        mousePageX: 0,
        mousePageY: 0,
        mouseClientY: 0,
        mouseClientX: 0,
      }
    },
    mounted() {
      document.addEventListener('mousemove', (e) => {
        this.mouseClientX = e.clientX;
        this.mouseClientY = e.clientY;
        this.mousePageX = e.pageX;
        this.mousePageY = e.pageY;
        this.updatePosition();
      }, false);
    },
    watch: {
      feature() {
        this.updatePosition();
      }
    },
    methods: {
      updatePosition() {
        if(!!this.$refs.tooltip) {
          let h = this.$refs.tooltip.clientHeight;
          let w = this.$refs.tooltip.clientHeight;
          let distanceToBottom = window.innerHeight - this.mouseClientY;
          let distanceToRight = window.innerWidth - this.mouseClientX;
          this.$refs.tooltip.style.left = this.mousePageX + paddingLeft + 'px';

          if (distanceToRight < w) {
            this.$refs.tooltip.style.left = this.mousePageX - w + 'px';
          } else {
            this.$refs.tooltip.style.left = this.mousePageX + paddingLeft + 'px';
          }

          if(distanceToBottom < h) {
            this.$refs.tooltip.style.top = this.mousePageY - h + distanceToBottom - paddingTop + 'px';
          } else {
            this.$refs.tooltip.style.top = this.mousePageY + paddingTop + 'px';
          }
        }
      }
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
