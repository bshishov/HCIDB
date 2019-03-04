<i18n>
en:
  login: "Login"
  logout: "Logout"
ru:
  login: "Войти"
  logout: "Выход"
</i18n>

<template>
  <div class="auth">
    <div class="avatar item">
      <img class="avatar" :src="userPic" :alt="userName" v-if="isAuthenticated">
    </div>
    <div class="item" v-if="isAuthenticated">{{ userName }}</div>
    <div class="item link" v-if="isAuthenticated" @click="logout()">{{ $t('logout') }}</div>
    <div class="item link" v-if="!isAuthenticated" @click="login()">{{ $t('login') }}</div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: "AuthPanel",
    created() {},
    mounted() {},
    methods: mapActions({
      login: 'session/login',
      logout: 'session/logout',
    }),
    computed: mapGetters({
      isAuthenticated: 'session/isAuthenticated',
      userPic: 'session/userPic',
      userName: 'session/userName',
      userId: 'session/userId',
    })
  }
</script>

<style scoped>
  .auth {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .auth .item {
    margin-right: 10px;
  }
  .auth .link {
    text-decoration: underline;
    cursor: pointer;
  }
  .auth .avatar {
    height: 30px;
    border-radius: 100%;
  }
</style>
