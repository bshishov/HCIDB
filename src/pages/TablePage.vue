<i18n>
  en:
    features: Features
    search-field: Search
    search-placeholder: Start typing...
    loading: Loading...
  ru:
    features: Характеристики
    search-field: Поиск
    search-placeholder: Поиск...
    loading: Загрузка...
</i18n>

<template>
  <BaseLayout>
    <template slot="title"><h1>{{ $t('features') }}</h1></template>

    <div class="horizontal-items">
      <div class="flex-grow">
        <div class="field">
          <div class="label">{{ $t('search-field') }}</div>
          <input type="text" :placeholder="$t('search-placeholder')" v-model="searchQuery">
        </div>
        <FeaturesList :items="searchItems"></FeaturesList>
        <div v-if="isSearchLoading">
          <i>{{ $t('loading' )}}</i>
        </div>
      </div>
      <div style="width:600px; height: 600px">
        <Graph :features="searchItems"></Graph>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
  import db from '@/services/db';
  import { mapActions, mapGetters } from 'vuex'
  import BaseLayout from "@/components/BaseLayout";
  import Dropdown from "@/components/Dropdown";
  import FeaturesList from "@/components/FeaturesList";
  import {debounce} from "@/utils";
  import Graph from "@/components/Graph";

  export default {
    name: "TablePage",
    components: {Graph, FeaturesList, Dropdown, BaseLayout},
    data() {
      return {
        searchQuery: null,
        isSearchLoading: false,
        searchItems: []
      }
    },
    watch: {
      searchQuery: debounce(function (newQuery) {
        console.log('Search changed', newQuery);
        this.isSearchLoading = true;
        db.searchFeatures(newQuery).then(r => {
          this.searchItems = r.features;
        }).catch(this.dbError)
          .finally(() => {
          this.isSearchLoading = false;
        });
      }, 300)
    },
    mounted() {
      this.isSearchLoading = true;
      db.query('{features {id name affects {from_id to_id} depends {from_id to_id} }}').then(r => {
        this.searchItems = r.features;
      }).catch(this.dbError)
        .finally(() => {
        this.isSearchLoading = false;
      });
    },
    methods: {
      ...mapActions({
        dbError: 'notifications/dbError'
      }),
    }
  }
</script>

<style scoped>

</style>

