<i18n>
en:
  title: HCI Systems Knowledge graph
  list: List
  graph: Graph
  debug: Debug
ru:
  title: HCI
  list: Список
  graph: Граф
  debug: Отладка
</i18n>

<template>
  <div class="app">
    <div class="toolbar">
      <div class="item logo">{{ $t('title') }}</div>
      <router-link class="item" :to="{ name: 'TablePage' }">{{ $t('list') }}</router-link>
      <router-link class="item" to="/graph">{{ $t('graph') }}</router-link>
      <router-link class="item" to="/debug">{{ $t('debug') }}</router-link>
      <div class="flex-grow"></div>
      <div class="item">
        <AuthPanel></AuthPanel>
      </div>
    </div>
    <router-view />
    <NotificationsContainer></NotificationsContainer>
  </div>
</template>

<script>
  import AuthPanel from './components/AuthPanel';
  import NotificationsContainer from "@/components/NotificationsContainer";

  export default {
    name: 'App',
    components: {NotificationsContainer, AuthPanel },
    data: () => ({
      leftPanel: null,
      rightPanel: false,
    }),
    props: {
      source: String
    }
  }
</script>

<style>

</style>

<style lang="sass">
  @import "assets/style.sass"
</style>
