<i18n>
en:
  title: HCI Systems Knowledge graph
  features: Features
  graph: Graph
  debug: Debug
  classifiers: Classifiers
  search: Search...
  analytics: Analytics
ru:
  title: HCI
  features: Характеристики
  graph: Граф
  debug: Отладка
  classifiers: Классификаторы
  search: Поиск...
  analytics: Аналитика
</i18n>

<template>
  <div class="app">
    <div class="toolbar">
      <div class="item logo">{{ $t('title') }}</div>
      <router-link class="item" :to="{ name: 'TablePage' }">{{ $t('features') }}</router-link>
      <router-link class="item" to="/graph">{{ $t('graph') }}</router-link>
      <router-link class="item" :to="{ name: 'ClassifiersListPage' }">{{ $t('classifiers') }}</router-link>
      <router-link class="item" :to="{ name: 'AnalyticsPage' }">{{ $t('analytics') }}</router-link>
      <!--<router-link class="item" to="/debug">{{ $t('debug') }}</router-link>-->
      <div class="item searchbar">
        <Dropdown ref="search"
                  :placeholder="$t('search')"
                  :items="searchItems"
                  v-model="searchQuery"
                  itemStringKey="name"
                  class="dropdown"
                  @input="onSearchInput"
                  allow-custom-input>
          <template slot="item" slot-scope="{ item }">
            <router-link class="link" :to="{ name: 'FeaturePage', params: { id: item.id }}">
              {{ item.name }}
            </router-link>
            <div class="small subheader">
              <span v-for="ref in item.references" v-if="ref.classifier.type.required" class="classifier">
                {{ ref.classifier.content }}
              </span>
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="flex-grow"></div>
      <div class="item">
        <AuthPanel></AuthPanel>
      </div>
    </div>
    <router-view />
    <NotificationsContainer></NotificationsContainer>
    <FeatureTooltip></FeatureTooltip>
  </div>
</template>

<script>
  import AuthPanel from './components/AuthPanel';
  import NotificationsContainer from "@/components/NotificationsContainer";
  import Dropdown from "@/components/Dropdown";
  import {Feature} from "@/services/model";
  import { mapActions, mapGetters } from 'vuex';
  import {debounce} from "@/utils";
  import FeatureTooltip from "@/components/FeatureTooltip";

  export default {
    name: 'App',
    components: {FeatureTooltip, Dropdown, NotificationsContainer, AuthPanel },
    data: () => ({
      searchQuery: null,
      isSearchLoading: false,
      searchItems: []
    }),
    watch: {
      searchQuery: debounce(function (newQuery) {
        if (!newQuery)
          return;

        if(!(typeof newQuery === 'string' || newQuery instanceof String))
          return;

        if (newQuery.length < 2)
          return;

        console.log('Search changed', newQuery);
        this.isSearchLoading = true;
        Feature.search(newQuery)
          .then(features => {
            console.log(features);
            this.searchItems = features;
          })
          .catch(this.dbError)
          .finally(() => { this.isSearchLoading = false; });
      }, 300)
    },
    props: {
      source: String
    },
    methods: {
      ...mapActions({
        dbError: 'notifications/dbError'
      }),
      onNodeSelected(node) {
        this.$router.push({ name: 'FeaturePage', params: {id: node.id }});
      },
      onSearchInput(value) {
        if(!(typeof value === 'string' || value instanceof String))
          this.$refs.search.clear();
      }
    }
  }
</script>

<style scoped lang="sass">
@import "assets/style.sass"
.searchbar
  color: black
  max-width: 400px
  flex-grow: 2
  min-width: 200px

.link
  margin-top: 0.5em
  color: black !important

.subheader
  font-size: $small
  color: #7a7a7a
  margin-bottom: 0.5em
  border-bottom: 1px solid #eee
</style>


<style lang="sass">
  @import "assets/style.sass"
</style>
