<i18n>
en:
  classifiers: Classifiers
ru:
  classifiers: Классификаторы
</i18n>

<template>
  <BaseLayout>
    <template slot="title">
      <h1>{{ $t('classifiers') }}</h1>
    </template>

    <div v-for="group in groupedClassifiers" :key="group.id">
      <h3>{{ group.name }}</h3>
      <list :items="group.items">
        <template v-slot:default="{ item }">
          <router-link :to="{ name: 'ClassifierPage', params: {id: item.id }}">{{ item.content }}</router-link>
        </template>
      </list>
    </div>
  </BaseLayout>
</template>

<script>
  import db from '@/services/db';
  import BaseLayout from "@/components/BaseLayout";
  import {mapActions, mapGetters} from 'vuex';
  import List from "@/components/List";

  export default {
    name: "ClassifiersListPage",
    components: {List, BaseLayout },
    data() {
      return {
        groupedClassifiers: []
      }
    },
    mounted() {
      db.query(`{classifiers {
          id
          content
          type {
            id
            name
          }}}`).then(result => {
            console.log(result.classifiers);
            this.groupedClassifiers = this.groupClassifiers(result.classifiers);
      }).catch(this.dbError);
    },
    methods: {
      groupClassifiers(items){
        let grouped = {};
        items.forEach(i => {
          if(i.type.id in grouped) {
            grouped[i.type.id].items.push(i);
          } else {
            grouped[i.type.id] = {
              items: [i],
              name: i.type.name,
              id: i.type.id
            };
          }
        });
        return grouped;
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
