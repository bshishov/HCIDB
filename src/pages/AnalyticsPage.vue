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
    cycles: Cycle dependencies
    cycle: Cycle
    synonyms: Synonyms
  ru:
    analytics: Аналитика
    completeness: Полнота
    connectivity: Связность
    graph-analysis: Анализ графа
    without-description: Характеристики без описания
    without-classifiers: Характеристики без классификатора
    without-relations: Характеристики без связей
    with-bypass-relations: Характеристики с «проходной» связью
    cycles: Циклические зависимости
    cycle: Цикл
    synonyms: Синонимы
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
          <h3 v-if="featuresWithUnsetClassifiers[classifierType.id]">
            <Icon>warning</Icon> {{ $t('without-classifiers') }} <i>{{ classifierType.name }}</i>: {{ featuresWithUnsetClassifiers[classifierType.id].length }}
          </h3>
        </template>
        <FeaturesList :items="featuresWithUnsetClassifiers[classifierType.id]"></FeaturesList>
      </ToggleGroup>
    </div>

    <ToggleGroup>
      <template slot="header">
        <h3><Icon>warning</Icon> {{ $t('without-relations') }}: {{ featuresWithoutRelations.length }} </h3>
      </template>
      <FeaturesList :items="featuresWithoutRelations"></FeaturesList>
    </ToggleGroup>

    <h2>{{ $t('graph-analysis') }}</h2>
    <ToggleGroup>
      <template slot="header">
        <h3><Icon>warning</Icon> {{ $t('with-bypass-relations') }}: {{ featuresWithBypassRelation.length }} </h3>
      </template>
      <FeaturesList :items="featuresWithBypassRelation"></FeaturesList>
    </ToggleGroup>

    <ToggleGroup>
      <template slot="header">
        <h3>{{ $t('cycles') }}: {{ cycles.length }} </h3>
      </template>
      <div v-for="(cycle, i) in cycles">
        <h4>{{ $t('cycle')}} {{ i }}</h4>
        <FeaturesList :items="cycle"></FeaturesList>
      </div>
    </ToggleGroup>

    <ToggleGroup>
      <template slot="header">
        <h3>{{ $t('synonyms') }}: {{ synonyms.length }} </h3>
      </template>
      <div v-for="(synonym, i) in synonyms">
        <Block class="white" v-for="s in synonym">
          <FeaturesList :items="s"></FeaturesList>
        </Block>
      </div>
    </ToggleGroup>

    <h2>{{ $t('connectivity') }}</h2>
  </BaseLayout>
</template>

<script>
  import BaseLayout from "@/components/BaseLayout";
  import db from '../services/db';
  import {Feature} from "@/services/model";
  import {mapActions, mapGetters} from 'vuex';
  import FeaturesList from "@/components/FeaturesList";
  import Icon from "@/components/Icon";
  import ToggleGroup from  "@/components/ToggleGroup"
  import Graph from "@/graphUtils"
  import Block from "@/components/Block";

  export default {
    name: "AnalyticsPage",
    components: {Block, Icon, FeaturesList, BaseLayout, ToggleGroup},
    data() {
      return {
        features: [],
        relations: [],
        classifierTypes: [],
        requiredClassifierTypes: [],

        cycles: [],
        synonyms: [],
        featuresWithoutDescription: [],
        featuresWithUnsetClassifiers: {},
        featuresWithoutRelations: [],
        featuresWithBypassRelation: []
      }
    },
    watch: {
      features() { this.featuresUpdated(); },
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
      featuresUpdated() {
        this.featuresWithoutDescription = this.features.filter(f => {
          if (!f.description)
            return true;

          if(f.description.length < 10)
            return true;

          return false;
        });

        this.featuresWithoutRelations = this.features.filter(feature => {
          return feature.affects.length === 0 && feature.depends.length === 0;
        });

        this.featuresWithBypassRelation = this.features.filter(feature => {
          return feature.affects.length === 1 && feature.depends.length === 1;
        });

        this.requiredClassifierTypes.forEach(cType => {
          this.featuresWithUnsetClassifiers[cType.id] = this.features.filter(feature => {
            let featureTypeIds = feature.references.map(ref => ref.classifier.type_id);
            return !featureTypeIds.includes(cType.id);
          });
        });

        // Cycles;
        let graph = new Graph();
        graph.fromFeatures(this.features);
        this.cycles = graph.findCycles();

        let pathMap = new Map();
        this.features.forEach(feature => {
          let sources = feature.depends.map(rel => rel.from_id);
          let targets = feature.affects.map(rel => rel.to_id);

          sources.forEach(s => {
            targets.forEach(t => {
              if(s === t)
                return;

              let entry = pathMap.get(s);
              if(entry === undefined) {
                entry = new Set();
                entry.add(t);
              } else {
                entry.add(t);
              }
              pathMap.set(s, entry);
            });
          });
        });

        console.log(pathMap);

        this.synonyms = [];
        pathMap.forEach((set, s) => {
          set.forEach(t => {
            let localSynonyms = [];
            graph.searchPaths(s, t).forEach(path => {
              localSynonyms.push(path);
            });
            if(localSynonyms.length > 1) {
              this.synonyms.push(localSynonyms);
            }
          });
        });
      },
      ...mapActions({
        dbError: 'notifications/dbError',
        notify: 'notifications/add',
      })
    },
    computed: {
      ...mapGetters({
        canEdit: 'session/canEdit'
      })
    }
  }
</script>

<style scoped lang="sass">
</style>
