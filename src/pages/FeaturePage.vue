<i18n>
  en:
    edit: Edit
    delete: Delete
    name: Name
    description: Description (markdown)
    save: Save
    references: Meta-information
    affects: Affects
    depends-on: Depends on
    editing: Editing
    add-relation: Add relation
  ru:
    editing: Редактирование
    edit: Редактировать
    delete: Удалить
    name: Название
    description: Описание (markdown)
    save: Сохранить
    references: Мета-информация
    affects: Влияет на
    depends-on: Зависит от
    add-relation: Добавить связь
</i18n>

<template>
  <BaseLayout>
    <template slot="title">
      <div class="horizontal-items float-right" v-if="canEdit">
        <div class="item control-button" @click="isEditing=!isEditing"><Icon>edit</Icon> {{ $t('edit') }}</div>
        <div class="item control-button" @click="remove()"><Icon>delete</Icon> {{ $t('delete') }}</div>
      </div>
      <h1>{{ name }}</h1>

    </template>
    <div v-if="!isEditing">
      <div v-html="descriptionHtml"></div>
    </div>
    <Block v-if="isEditing" class="form" :caption="$t('editing')">
      <div class="field">
        <div class="label">{{ $t('name') }}</div>
        <input type="text" v-model="name" name="name">
      </div>
      <div class="field">
        <div class="label">{{ $t('description') }}</div>
        <textarea v-model="description" name="description"></textarea>
      </div>
      <div class="field">
        <input class="button" type="button" @click="save()" :value="$t('save')" />
      </div>
    </Block>

    <div class="additional">
      <div class="relations">
        <h3>{{ $t('references') }}</h3>
        <References @add="onClassifierAdded"
                    @remove="onClassifierRemoved"
                    :items="classifiers"
                    editable />
      </div>

      <div class="relations">
        <h3>{{ $t('affects') }}</h3>
        <FeaturesList
          :items="affects"
          @remove="onAffectsLinkRemoved"
          :removable="canEdit"
          detailed>
        </FeaturesList>
        <div class="control-button" v-if="canEdit" @click="addingAffects = !addingAffects">
          <Icon>edit</Icon> {{ $t('add-relation') }}
        </div>
        <Block class="white" v-if="canEdit && addingAffects">
          <RelationAddForm @submit="addAffects" auto-create-custom />
        </Block>
      </div>

      <div class="relations">
        <h3>{{ $t('depends-on') }}</h3>
        <FeaturesList
          :items="depends"
          @remove="onDependsLinkRemoved"
          :removable="canEdit"
          detailed>
        </FeaturesList>
        <div class="control-button" v-if="canEdit" @click="addingDepends = !addingDepends">
          <Icon>edit</Icon> {{ $t('add-relation') }}
        </div>
        <Block class="white" v-if="canEdit && addingDepends">
          <RelationAddForm @submit="addDependency" auto-create-custom />
        </Block>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
  import db from '@/services/db';
  import BaseLayout from "@/components/BaseLayout";
  import RelationsList from "@/components/RelationsList";
  import {mapActions, mapGetters} from 'vuex';
  import Dropdown from "@/components/Dropdown";
  import FeaturesList from "@/components/FeaturesList";
  import References from "@/components/References";
  import RelationAddForm from "@/components/RelationAddForm";
  import Block from "@/components/Block";
  import {debounce} from "@/utils";
  import Icon from "@/components/Icon";
  import {Feature} from "@/services/model"

  export default {
    name: "FeaturePage",
    components: {Icon, Block, RelationAddForm, References, FeaturesList, Dropdown, RelationsList, BaseLayout},
    data() {
      return {
        isEditing: false,
        savingInProgress: false,
        id: -1,
        name: "",
        descriptionHtml: "",
        description: "",
        affects: [],
        depends: [],
        classifiers: [],
        addingAffects: false,
        addingDepends: false,
      }
    },
    watch: {
      description: debounce(function(newVal) {
        this.descriptionHtml = this.$marked(newVal);
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
      init: function(itemId) {
        db.getFeature(itemId).then(item => {
          this.id = item.id;
          this.name = item.name;
          this.description = item.description;
          this.descriptionHtml = this.$marked(item.description);
          this.affects = item.affects.map(el => el.to);
          this.depends = item.depends.map(el => el.from);
          this.classifiers = item.references.map(el => el.classifier);
        }).catch(err => {
          this.dbError(err);
          console.log(err);
        });
      },
      save: function() {
        this.savingInProgress = true;
        db.updateFeature(this.id, {
          name: this.name,
          description: this.description
        }).then(item => {
          this.isEditing = false;
          this.description = item.description;
          this.notify({
            type: 'success',
            header: 'Saved',
            time: 1000
          })
        }).catch(this.dbError)
          .finally(() => {
          this.savingInProgress = false;
        })
      },
      onAffectsLinkRemoved(item, index) {
        let itemToRemove = this.affects.splice(index, 1)[0];
        db.deleteRelation(this.id, itemToRemove.id, ).then(r => {
          this.notify({
            type: 'success',
            header: 'Relation deleted',
            time: 1000
          });
        }).catch(this.dbError);
      },
      onDependsLinkRemoved(item, index) {
        console.log('removed', index);
        let itemToRemove = this.depends.splice(index, 1)[0];
        db.deleteRelation(itemToRemove.id, this.id).then(r => {
          this.nofity({
            type: 'success',
            header: 'Relation deleted',
            time: 1000
          });
        }).catch(this.dbError);
      },
      remove: function() {
        if (confirm("Are you sure")) {
          console.log("Deleting feature", this.id);
          db.deleteFeature(this.id).then(r => {
            this.notify({
              type: 'success',
              header: 'Feature deleted',
              time: 1000
            });
            this.$router.push({ name: 'TablePage' });
          }).catch(this.dbError);
        }
      },
      addAffects(newFeature) {
        db.addNewRelation(this.id, newFeature.id)
          .then(relation => {
            this.affects.push(relation.to);
          }).catch(this.dbError);
      },
      addDependency(newFeature) {
        db.addNewRelation(newFeature.id, this.id)
          .then(relation => {
            this.depends.push(relation.from);
          }).catch(this.dbError);
      },
      onClassifierAdded(classifier){
        db.addReference(this.id, classifier.id).then(reference => {
          this.classifiers.push(reference.classifier);
        }).catch(this.dbError);
      },
      onClassifierRemoved(classifier) {
        db.deleteReference(this.id, classifier.id)
          .then(affectedRows => {
            let itemToRemove = this.classifiers.find(c => c.id === classifier.id);
            let index = this.classifiers.indexOf(itemToRemove);
            if (index >= 0)
              this.classifiers.splice(index, 1)
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
  .additional {
    display: flex;
    flex-flow: row wrap;
  }
  .relations {
    width: 300px;
    margin-right: 50px;
  }
</style>
