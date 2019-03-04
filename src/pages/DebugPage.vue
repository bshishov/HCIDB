<template>
  <BaseLayout>
    <template slot="title"><h1>Playground</h1></template>
    <Block caption="Some caption">
      Some stuff here
    </Block>

    <Block caption="String items, custom input allowed">
      <div>Items: {{ stringItems }}</div>
      <div>selected: {{ m1 }}</div>
      <Dropdown v-model="m1" placeholder="Start typing" allow-custom-input :items="stringItems">
      </Dropdown>
    </Block>

    <Block caption="String items, custom input not allowed">
      <div>Items: {{ stringItems }}</div>
      <div>selected: {{ m2 }}</div>
      <Dropdown v-model="m2" placeholder="Start typing" :items="stringItems">
      </Dropdown>
    </Block>


    <h3>Object items, custom input allowed</h3>
    <div>Items: {{ objectItems }}</div>
    <div>selected: {{ m3 }}</div>
    <Dropdown v-model="m3"
              placeholder="Custom input"
              allow-custom-input
              :items="objectItems"
              item-string-key="name">
    </Dropdown>

    <h3>No custom input</h3>
    <div>w/o custom value: {{ m4 }}</div>
    <Dropdown v-model="m4" placeholder="No custom input" :items="objectItems">
    </Dropdown>

    <h3>No items</h3>
    <Dropdown v-model="m5" placeholder="No items"></Dropdown>

    <h3>Autocomplete</h3>
    <div>Selected: {{ m6 }}</div>
    <Dropdown
      v-model="m6"
      placeholder="Start typing"
      allow-custom-input
      :items="searchItems"
      item-string-key="name"
      @textInput="onTextInput">
    </Dropdown>
  </BaseLayout>
</template>

<script>
  import Dropdown from "@/components/Dropdown";
  import BaseLayout from "@/components/BaseLayout";
  import db from '../services/db';
  import Block from "@/components/Block";
  export default {
    name: "DebugPage",
    components: {Block, Dropdown, BaseLayout},
    data() {
      return {
        m1: null,
        m2: null,
        m3: null,
        m4: null,
        m5: null,
        m6: null,
        objectItems: [
          { name: 'hello', id: 1 },
          { name: 'darkness', id: 2 }
        ],
        stringItems: [ 'hello', 'darkness', 'my', 'old', 'friend' ],
        searchedClassifiers: [],
        lastQ: null
      }
    },
    methods: {
      onTextInput(q) {
        if (this.lastQ !== q) {
          db.searchFeatures(q).then(r => {
            this.searchItems = r.features;
          });
          this.lastQ = q;
        }
      }
    }
  }
</script>

<style scoped>

</style>
