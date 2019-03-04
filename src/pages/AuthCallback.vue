<template>
    <div>Authenticating...</div>
</template>

<script>
  import { mapActions } from 'vuex'
  import router from '@/router'

  export default {
    name: "AuthCallback",
    methods: mapActions({
      handleAuthentication: 'session/handleAuthentication'
    }),
    created() {
      this.handleAuthentication();
      router.push({ name: 'MainPage' });
      return {};
    }
  }
</script>

<style scoped>

</style>
