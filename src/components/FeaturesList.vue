<template>
  <List
    :items="items"
    :detailed="detailed"
    :removable="removable"
    @remove="remove">
    <template slot-scope="{ item }">
      <FeatureLink :feature="item" class="link horizontal-items" />
    </template>
    <template slot="sub" slot-scope="{ item }">
      <span v-for="ref in item.references" v-if="showRef(ref)" class="classifier">
        {{ ref.classifier.content }}
      </span>
    </template>
  </List>
</template>

<script>
  import Icon from "@/components/Icon";
  import List from "@/components/List";
  import { mapActions, mapGetters } from 'vuex'
  import FeatureLink from "@/components/FeatureLink";
  export default {
    name: "FeaturesList",
    components: {FeatureLink, List, Icon},
    props: {
      items: { type: Array },
      removable: { type: Boolean, default: false },
      detailed: { type: Boolean, default: false }
    },
    methods: {
      remove(item, index, event) {
        if (event) event.preventDefault();
        this.$emit('remove', item, index, event);
      },
      showRef(reference) {
        if (!reference)
          return false;

        if (![1, 2, 5].includes(reference.classifier.type_id))
          return false;

        return true;
      },
      ...mapActions({
        tooltipShowFeature: 'tooltip/showFeature',
        tooltipHideFeature: 'tooltip/hideFeature'
      })
    }
  }
</script>

<style scoped lang="sass">
@import "../assets/style.sass"

.list
  & > .item
    width: 100%
    border-bottom: 1px solid #eee
    padding: 5px 0px
    cursor: pointer
    & > .link
      text-decoration: none
      color: inherit
    &:hover
      background-color: lighten($primary-color, 10%)
      .controls
        display: inline-block
    .controls
      display: none
    &:last-child
      border-bottom: 0

.subheader
  font-size: $small
  color: #7a7a7a

.classifier
  margin-right: 10px
</style>
