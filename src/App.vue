<i18n>
en:
  title: HCI Systems Knowledge graph
  features: Features
  graph: Graph
  debug: Debug
  classifiers: Classifiers
ru:
  title: HCI
  features: Характеристики
  graph: Граф
  debug: Отладка
  classifiers: Классификаторы
</i18n>

<template>
  <div class="app">
    <div class="toolbar">
      <div class="item logo">{{ $t('title') }}</div>
      <router-link class="item" :to="{ name: 'TablePage' }">{{ $t('features') }}</router-link>
      <router-link class="item" to="/graph">{{ $t('graph') }}</router-link>
      <router-link class="item" :to="{ name: 'ClassifiersListPage' }">{{ $t('classifiers') }}</router-link>
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
