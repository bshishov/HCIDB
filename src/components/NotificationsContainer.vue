<template>
  <div class="notifications-container">
    <Notification v-for="(item, i) in notifications"
                  :key="i"
                  :header="item.header"
                  :content="item.content"
                  :type="item.type"
                  closable
                  v-on:close="closeNotification(i)" />
  </div>
</template>

<script>
  import Notification from "@/components/Notification";
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: "NotificationsContainer",
    components: { Notification },
    mounted() {},
    methods: {
      ...mapActions({
        addToStore: 'notifications/add',
        removeFromStore: 'notifications/removeByIndex'
      }),
      closeNotification(index) {
        this.removeFromStore(index);
      }
    },
    computed: {
      ...mapGetters({
        notifications: 'notifications/notifications'
      })
    }
  }
</script>

<style scoped>
  .notifications-container {
    padding: 10px;
    position: absolute;
    height: 100%;
    width: 400px;
    top:0;
    left:0;
    /*background-color: yellow;*/
    display: flex;
    flex-flow: column;
    overflow: hidden;
    pointer-events: none;
  }
  .notifications-container * {
    pointer-events:auto;
    margin-bottom: 10px;
    box-shadow: 1px 3px 2px rgba(0,0,0,0.2);
  }
</style>
