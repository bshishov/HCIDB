<i18n>
en:
  add: Add
ru:
  add: Добавить
</i18n>

<template>
  <div class="references">
    <div class="classifiers" v-for="(group, key) in groupedItems" :key="key">
      <Block :caption="group.name" class="white">
        <List :items="group.items"
              :removable="editable && canEdit"
              @remove="onItemRemove">
          <template v-slot:default="{ item }">
            <router-link :to="{ name: 'ClassifierPage', params: { id: item.id }}">
              {{ item.content }}
            </router-link>
          </template>
        </List>
      </Block>
    </div>
    <div v-if="editable && canEdit" style="margin-top: 0.8em">
      <div @click="isAdding = !isAdding" class="control-button"><Icon icon="edit" /> {{ $t('add') }}</div>
      <Block class="white" v-if="isAdding">
        <ClassifierAddForm
          v-model="itemToAdd"
          @submit="onFormSubmit"
        />
      </Block>
    </div>
  </div>
</template>

<script>
  import Icon from "@/components/Icon";
  import ClassifierAddForm from "@/components/ClassifierAddForm";
  import db from '@/services/db';
  import {mapActions, mapGetters} from 'vuex';
  import ClassifierPage from "@/pages/ClassifierPage";
  import Block from "@/components/Block";
  import List from "@/components/List";

  export default {
    name: "References",
    components: {List, Block, ClassifierAddForm, Icon},
    props: {
      items: Array,
      editable: { type: Boolean, default: false }
    },
    data() {
      return {
        groupedItems: {},
        isAdding: false,
        itemToAdd: { content: null, type: null }
      }
    },
    mounted() {
    },
    watch: {
      items: function (val) {
        this.groupedItems = this.groupClassifiers(val);
      }
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
      onFormSubmit(value) {
        if (typeof value.content === 'string' || value.content instanceof String) {
          db.addClassifier(value.type.id, value.content).then(classifier => {
            this.$emit('add', classifier);
          }).catch(this.dbError);
        } else {
          this.$emit('add', value.content);
        }
      },
      onItemRemove(item, index, event) {
        this.$emit('remove', item, index, event);
      },
      ...mapActions({
        dbError: 'notifications/dbError',
        nofity: 'notifications/add',
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
  .references {
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
  }
  .classifiers {
    display: flex;
    flex-flow: row wrap;
  }
</style>
