<i18n>
en:
  add: Add
  relation-field: New relation
  relation-placeholder: Link with...
ru:
  add: Добавить
  relation-placeholder: Связать с...
  relation-field: Новая связь
</i18n>

<template>
  <div class="form">
    <div class="field">
      <div class="label">
        {{ $t('relation-field') }}
      </div>
      <Dropdown :allow-custom-input="!permitCustom"
                v-model="feature"
                :items="searchResults"
                :placeholder="$t('relation-placeholder')"
                item-string-key="name"
                @textInput="onTextInput" />
    </div>
    <div class="field">
      <input type="button" class="button" :value="$t('add')" @click="submit">
    </div>
  </div>
</template>

<script>
  import db from '@/services/db';
  import {mapActions} from 'vuex';
  import Dropdown from "@/components/Dropdown";
  import {debounce} from "@/utils";

  export default {
    name: "RelationAddForm",
    components: {Dropdown},
    comments: {Dropdown},
    props: {
      permitCustom: { type: Boolean, default: false },
      autoCreateCustom: { type: Boolean, default: false }
    },
    data() {
      return {
        searchResults: [],
        feature: null
      }
    },
    mounted() {
      db.searchFeatures("").then(r => {
        this.searchResults = r.features;
      }).catch(this.dbError);
    },
    methods: {
      onTextInput: debounce( function (q) {
        db.searchFeatures(q).then(r => {
          this.searchResults = r.features;
        }).catch(this.dbError);
      }, 300),
      submit() {
        if (this.autoCreateCustom && (typeof this.feature === 'string' || this.feature instanceof String )) {
          db.addNewFeature({ name: this.feature, description: "" }).then(created => {
            this.feature = created;
            this.$emit('submit', this.feature);
          }).catch(this.dbError);
        } else  {
          this.$emit('submit', this.feature);
        }
      },
      ...mapActions({ dbError: 'notifications/dbError' })
    }
  }
</script>

<style scoped>

</style>
