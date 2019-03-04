<i18n>
en:
  title: Semantic feature relations graph
  affects: Affects
  depends: Depends
ru:
  title: Сеть зависимостей характеристик
  affects: Влияет на
  depends: Зависит от
</i18n>

<template>
  <BaseLayout>
    <template slot="title"><h1>{{ $t('title') }}</h1></template>

    <Graph :features="features" @nodeSelected="onGraphSelectedNode" class="graph"></Graph>

    <div class="layout">
      <div class="inspector">
        <router-link :to="{ name: 'FeaturePage', params: { id: selectedFeature.id }}" v-if="selectedFeature.id"><h3>{{ selectedFeature.name }}</h3></router-link>
        <References :items="selectedFeature.classifiers" />
        <p>{{ selectedFeature.description }}</p>
        <div class="horizontal-items">
          <div class="list">
            <h4>{{ $t('depends') }}</h4>
            <FeaturesList :items="selectedFeature.depends">
            </FeaturesList>
          </div>
          <div class="list">
            <h4>{{ $t('affects') }}</h4>
            <FeaturesList :items="selectedFeature.affects">
            </FeaturesList>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
  import db from '@/services/db';
  import BaseLayout from "@/components/BaseLayout";
  import FeaturePage from "@/pages/FeaturePage";
  import References from "@/components/References";
  import FeaturesList from "@/components/FeaturesList";
  import Graph from "@/components/Graph";
  import {mapActions} from 'vuex';

  export default {
    name: "GraphPage",
    components: {Graph, FeaturesList, References, FeaturePage, BaseLayout},
    data() {
      return {
        features: [],
        selectedFeature: {
          id: null,
          name: null,
          description: null,
          affects: [],
          depends: [],
          classifiers: []
        }
      }
    },
    mounted() {
      db.query('{features {id name affects {from_id to_id} depends {from_id to_id }}}').then(r => {
        this.features = r.features;
      }).catch(this.dbError);
    },
    methods: {
      onGraphSelectedNode(data) {
        console.log('[Graph] selected', data);
        db.getFeature(data.id).then(item => {
          this.selectedFeature.id = item.id;
          this.selectedFeature.name = item.name;
          this.selectedFeature.description = item.description;
          this.selectedFeature.affects = item.affects.map(el => el.to);
          this.selectedFeature.depends = item.depends.map(el => el.from);
          this.selectedFeature.classifiers = item.references.map(el => el.classifier);
        }).catch(this.dbError);
      },
      ...mapActions({
        dbError: 'notifications/dbError',
        notify: 'notifications/add',
      })
    }
  }
</script>

<style scoped lang="sass">
.graph
  width: 100%
  height: 1000px

.layout
  display: flex
  flex-flow: row nowrap
  justify-content: stretch

.inspector
  flex-grow: 1
  margin-left: 20px

.list
  width: 300px

.horisontal-items
  justify-content: flex-start

</style>


