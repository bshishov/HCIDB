<i18n>
en:
  classifiers: Classifiers
  add: Add
ru:
  classifiers: Классификаторы
  add: Добавить
</i18n>

<template>
  <BaseLayout>
    <template slot="title">
      <h1>{{ $t('classifiers') }}</h1>
    </template>

    <template>
      <div style="max-width:300px">
        <div class="control-button" v-if="canEdit" @click="adding = !adding">
          <Icon>edit</Icon> {{ $t('add') }}
        </div>
        <Block class="white" v-if="adding">
          <ClassifierAddForm @submit="onFormSubmit" />
        </Block>
      </div>

      <div v-for="group in groupedClassifiers" :key="group.id">
        <h3>{{ group.name }}</h3>
        <list :items="group.items">
          <template slot-scope="{ item }">
            <router-link :to="{ name: 'ClassifierPage', params: {id: item.id }}">{{ item.content }}</router-link>
          </template>
        </list>
      </div>
    </template>
  </BaseLayout>
</template>

<script>
  import db from '@/services/db';
  import BaseLayout from "@/components/BaseLayout";
  import {mapActions, mapGetters} from 'vuex';
  import List from "@/components/List";
  import Icon from "@/components/Icon";
  import Block from "@/components/Block";
  import ClassifierAddForm from "@/components/ClassifierAddForm";

  export default {
    name: "ClassifiersListPage",
    components: {ClassifierAddForm, Block, Icon, List, BaseLayout },
    data() {
      return {
        groupedClassifiers: [],
        adding: false
      }
    },
    created() {
      db.query(`{classifiers { id content type { id name }}}`)
        .then(result => {
          result.classifiers.forEach(this.addToGroup);
        })
        .catch(this.dbError);
    },
    methods: {
      onFormSubmit(value) {
        if (typeof value.content === 'string' || value.content instanceof String) {
          db.addClassifier(value.type.id, value.content).then(classifier => {
            this.addToGroup(classifier);
          }).catch(this.dbError);
        } else {
          this.addToGroup(value);
        }
      },
      addToGroup(classifier) {
        let group = this.groupedClassifiers.find(g => {
          return g.id === classifier.type.id;
        });

        if(!!group) {
          group.items.push(classifier);
        } else {
          this.groupedClassifiers.push({
            items: [classifier],
            name: classifier.type.name,
            id: classifier.type.id
          });
        }
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

<style scoped>

</style>
