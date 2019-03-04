<template>
  <div :class="itemClass">
    <div class="headline">
      <div class="header">
        <slot name="header">
          {{ header }}
        </slot>
      </div>
      <div class="close" v-if="closable" @click="close()">x</div>
    </div>
    <slot>{{ content }}</slot>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: "Notification",
    props: {
      type: { type: String },
      header: { type: String },
      content: { type: String },
      closable: { type: Boolean, default: false },
    },
    data: () => {
     return {
       itemClass: ['notification']
     }
    },
    mounted() {
      this.itemClass = ['notification', {
        error: this.type === 'error',
        success: this.type === 'success',
        warning: this.type === 'warning',
      }];
    },
    methods: {
      close() {
        // TODO: do smth
        this.$emit('close');
      },
      ...mapActions({
        removeFromStore: 'notifications/remove'
      })
    }
  }
</script>

<style scoped>
  .notification {
    padding: 10px;
    background-color: #ccc;
    border: 1px solid #bbb;
    border-radius: 5px;
  }
  .notification.success {
    background-color: #75cd72;
    border: 1px solid limegreen;
  }
  .notification.warning {
    background-color: #cbcd45;
    border: 1px solid #cda649;
  }
  .notification.error {
    background-color: #cdac93;
    border: 1px solid #cd4238;
  }
  .headline {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  .header {
    font-weight: bold;
  }
  .close {
    font-weight: bold;
    cursor: pointer;
    padding: 1px;
    font-size: 0.8em;
  }
</style>
