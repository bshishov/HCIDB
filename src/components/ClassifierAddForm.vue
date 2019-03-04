<i18n>
en:
  add: "Add"
  type: "Type"
  content: "Content"
ru:
  add: "Добавить"
  type: "Тип классификатора"
  content: "Значение"
</i18n>

<template>
  <div class="form">
    <div class="field">
      <div class="label">{{ $t('type')}}</div>
      <Dropdown
        :items="types"
        item-string-key="name"
        v-model="type"
        @input="onTypeChanged"
      />
    </div>
    <div class="field">
      <div class="label">{{ $t('content')}}</div>
      <Dropdown
        allow-custom-input
        v-model="content"
        :items="searchedClassifiers"
        item-string-key="content"
        @input="onContentChanged"
        @textInput="onContentTextInput"
      />
    </div>
    <div class="field">
      <input type="button" class="button" :value="$t('add')" @click="submit">
    </div>
  </div>
</template>

<script>
  import db from '@/services/db';
  import Dropdown from "@/components/Dropdown";
  import {mapActions} from 'vuex';
  import {debounce} from '@/utils';

  export default {
    name: "ClassifierAddForm",
    components: {Dropdown},
    data() {
     return {
       types: [],
       content: null,
       type: null,
       searchedClassifiers: []
     }
    },
    mounted() {
      db.getClassifierTypes().then(types => {
        this.types = types;
      }).catch(err => {
        this.dbError(err);
      });
    },
    computed: {
      value() {
        return { type: this.type, content: this.content }
      }
    },
    methods: {
      onContentChanged() {
        this.$emit('input', this.value);
      },
      onTypeChanged() {
        if (this.type) {
          db.searchClassifiers(this.value.type.id, "").then(classifiers => {
            this.searchedClassifiers = classifiers;
            this.content = null;
          }).catch(this.dbError);
        }
        this.$emit('input', this.value);
      },
      submit() {
        this.$emit('submit', this.value);
      },
      onContentTextInput: debounce( function(query) {
        if (this.type) {
          db.searchClassifiers(this.type.id, query).then(classifiers => {
            this.searchedClassifiers = classifiers;
          }).catch(this.dbError);
        }
      }, 300),
      ...mapActions({
        dbError: 'notifications/dbError',
        nofity: 'notifications/add',
      })
    }
  }
</script>

<style scoped>

</style>
