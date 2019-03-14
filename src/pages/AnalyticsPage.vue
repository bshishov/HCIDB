<i18n>
  en:
    analytics: Analytics
    completeness: Completeness
    connectivity: Connectivity
    graph-analysis: Graph Analysis
    without-description: Features without description
    without-classifiers: Features without classifier
    without-relations: Features without relations
    with-bypass-relations: Features with bypass relations
  ru:
    analytics: Аналитика
    completeness: Полнота
    connectivity: Связность
    graph-analysis: Анализ графа
    without-description: Характеристики без описания
    without-classifiers: Характеристики без классификатора
    without-relations: Характеристики без связей
    with-bypass-relations: Характеристики с «проходной» связью
</i18n>

<template>
  <BaseLayout>
    <template slot="title"><h1>{{ $t('analytics') }}</h1></template>

    <h2>{{ $t('completeness' )}}</h2>
    <ToggleGroup>
      <template slot="header">
        <h3><Icon>warning</Icon> {{ $t('without-description') }}: {{ featuresWithoutDescription.length }}</h3>
      </template>
      <FeaturesList :items="featuresWithoutDescription"></FeaturesList>
    </ToggleGroup>

    <div v-for="classifierType in requiredClassifierTypes" :key="classifierType.id">
      <ToggleGroup>
        <template slot="header">
          <h3><Icon>warning</Icon> {{ $t('without-classifiers') }} <i>{{ classifierType.name }}</i></h3>
        </template>
        <FeaturesList :items="featuresWithUnsetClassifiers(classifierType)"></FeaturesList>
      </ToggleGroup>
    </div>

    <ToggleGroup>
      <template slot="header">
        <h3><Icon>warning</Icon> {{ $t('without-relations') }} </h3>
      </template>
      <FeaturesList :items="featuresWithoutRelations"></FeaturesList>
    </ToggleGroup>

    <h2>{{ $t('graph-analysis') }}</h2>
    <ToggleGroup>
      <template slot="header">
        <h3><Icon>warning</Icon> {{ $t('with-bypass-relations') }} </h3>
      </template>
      <FeaturesList :items="featuresWithBypassRelation"></FeaturesList>
    </ToggleGroup>

    <ToggleGroup>
      <template slot="header">
        <h3>{{ $t('cycles') }} </h3>
      </template>
      <FeaturesList :items="cycles"></FeaturesList>
    </ToggleGroup>

    <h2>{{ $t('connectivity') }}</h2>
  </BaseLayout>
</template>

<script>
  import BaseLayout from "@/components/BaseLayout";
  import db from '../services/db';
  import {mapActions, mapGetters} from 'vuex';
  import FeaturesList from "@/components/FeaturesList";
  import Icon from "@/components/Icon";
  import ToggleGroup from  "@/components/ToggleGroup"
  import Graph from "@/graphUtils"

  export default {
    name: "AnalyticsPage",
    components: {Icon, FeaturesList, BaseLayout, ToggleGroup},
    data() {
      return {
        features: [],
        relations: [],
        classifierTypes: [],
        requiredClassifierTypes: []
      }
    },
    mounted() {
      db.getClassifierTypes().then(cTypes => {
        this.classifierTypes = cTypes;
        cTypes.forEach(t => {
          if(t.required === 1)
            this.requiredClassifierTypes.push(t);
        });
      }).catch(this.dbError);

      db.query(`{
        features {
          id
          name
          description
          affects { from_id to_id }
          depends{ from_id to_id }
          references {
            classifier {
              type_id
            }
          }
        }
      }`).then(r => {
        this.features = r.features;
      }).catch(this.dbError);
    },
    methods: {
      featuresWithUnsetClassifiers(classifierType) {
        return this.features.filter(feature => {
          let featureTypeIds = feature.references.map(ref => ref.classifier.type_id);
          return !featureTypeIds.includes(classifierType.id);
        });
      },
      ...mapActions({
        dbError: 'notifications/dbError',
        notify: 'notifications/add',
      })
    },
    computed: {
      featuresWithoutDescription() {
        return this.features.filter(f => {
          if (!f.description)
            return true;

          if (f.description.length < 10)
            return true;

          return false;
        });
      },
      featuresWithoutRelations() {
        return this.features.filter(feature => {
          return feature.affects.length === 0 && feature.depends.length === 0;
        });
      },
      featuresWithBypassRelation() {
        return this.features.filter(feature => {
          return feature.affects.length === 1 && feature.depends.length === 1;
        });
      },
      cycles() {
        let graph = new Graph();
        graph.fromFeatures(this.features);
        console.log(graph);
        console.log('strongly-connected', graph.stronglyConnectedComponents());
        console.log('cycles', graph.findCycles());
        return [];
      },
      ...mapGetters({
        canEdit: 'session/canEdit'
      })
    }
  }
</script>

<style scoped lang="sass">
</style>
