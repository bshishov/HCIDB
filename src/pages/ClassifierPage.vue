<i18n>
  en:
    edit: Edit
    delete: Delete
    editing: Editing
    content: Content,
    description: Description (markdown)
    save: Save
  ru:
    edit: Редактировать
    delete: Удалить
    editing: Редактирование
    content: Содержание
    description: Описание (markdown)
    save: Сохранить
</i18n>

<template>
  <BaseLayout>
    <template slot="title">
      <div class="horizontal-items float-right" v-if="canEdit">
        <div class="item control-button" @click="isEditing=!isEditing"><Icon>edit</Icon> {{ $t('edit') }}</div>
        <div class="item control-button" @click="remove()"><Icon>delete</Icon> {{ $t('delete') }}</div>
      </div>

      <h2>{{ type.name }}: {{ content }}</h2>
    </template>
    <div v-if="!isEditing">
      <div v-html="descriptionHtml"></div>
    </div>
    <Block v-if="isEditing" :caption="$t('editing')">
      <div class="form">
        <div class="field">
          <div class="label">{{ $t('content') }}</div>
          <input type="text" v-model="content" name="content">
        </div>
        <div class="field">
          <div class="label">{{ $t('description') }}</div>
          <textarea v-model="description" name="description"></textarea>
        </div>
        <div class="field">
          <input class="button" type="button" @click="save()" :value="$t('save')" />
        </div>
      </div>
    </Block>
    <FeaturesList :items="features"></FeaturesList>
  </BaseLayout>
</template>

<script>
  import db from '@/services/db';
  import BaseLayout from "@/components/BaseLayout";
  import FeaturesList from "@/components/FeaturesList";
  import {mapActions, mapGetters} from 'vuex';
  import Block from "@/components/Block";
  import Icon from "@/components/Icon";
  import marked from 'marked';
  import {debounce} from "@/utils";

  export default {
    name: "ClassifierPage",
    components: {Icon, Block, FeaturesList, BaseLayout},
    data() {
      return {
        id: -1,
        content: null,
        type: { name: null },
        description: null,
        descriptionHtml: null,
        features: [],
        isEditing: false
      }
    },
    watch: {
      description: debounce(function(newVal) {
        if (newVal) {
          this.descriptionHtml = marked(newVal, {sanitize: true});
        }
        else {
         this.descriptionHtml = null;
        }

      }, 300)
    },
    mounted() {
      this.init(this.$route.params.id);
    },
    beforeRouteUpdate(to, from, next) {
      next();
      this.init(to.params.id);
    },
    methods: {
      init(id) {
        this.id = id;
        db.getClassifier(id).then(r => {
          this.content = r.content;
          this.type = r.type;
          this.features = r.references.map(el => el.feature);
          this.description = r.description;
          if(r.description)
            this.descriptionHtml = marked(r.description);
        }).catch(this.dbError);
      },
      remove() {
        db.deleteClassifier(this.id).then(r => {
          this.$router.push('/');
        }).catch(this.dbError);
      },
      save() {
        db.updateClassifier(this.id, {
          content: this.content,
          description: this.description
        }).then(classifier => {
          this.content = classifier.content;
          this.description = classifier.description;
          this.isEditing = false;
          this.notify({
            type: 'success',
            header: 'Saved',
            time: 1000
          })
        }).catch(this.dbError);
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
