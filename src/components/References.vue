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
        <div class="item" v-for="item in group.items" :key="item.key">
          <router-link class="link" :to="{ name: 'ClassifierPage', params: { id: item.id }}">
            {{ item.content }}
          </router-link>
          <div class="controls">
            <span @click="onItemRemove(item)" class="edit">
              <Icon icon="close" v-if="editable && canEdit" />
            </span>
          </div>
        </div>
      </Block>
    </div>
    <div v-if="editable && canEdit">
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

  export default {
    name: "References",
    components: {Block, ClassifierAddForm, Icon},
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
        this.groupedItems = this.group(val);
      }
    },
    methods: {
      group(items){
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
      onItemRemove(item) {
        this.$emit('remove', item);
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
  .item > .link {
    text-decoration: none;
    color: inherit;
  }
  .item {
    padding: 1px 6px;
    /*margin-bottom: 10px;*/
    margin-right: 10px;
  }
  .item:last-child {
    margin-right: 0;
  }
  .item .controls {
    display: none;
    width: 0;
    cursor: pointer;
  }
  .item:hover {
    box-shadow: 0px 0px 2px rgba(0, 1, 1, 0.3);
  }
  .item:hover .controls {
    display: inline-block;
    width: auto;
    font-size: 0.8em;
  }
</style>
