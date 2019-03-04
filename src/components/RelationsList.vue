<template>
  <v-card color="blue">
    <v-card-title primary-title class="">
      <div class="headline white--text">Depends on</div>
      <v-spacer></v-spacer>
      <v-btn dark icon class="mr-3" @click="isSearching = !isSearching">
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn dark icon @click="isAdding = !isAdding">
        <v-icon>add</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <v-list-tile v-for="item in items" :key="item.id" @click="">
        <v-list-tile-content>
          <v-list-tile-title v-html="item.name"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.id"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="!items" color="grey">
        <v-list-tile>
          <v-list-tile-content>No items</v-list-tile-content>
        </v-list-tile>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile v-if="isSearching">
        <v-list-tile-content>
          <v-autocomplete
           v-model="selectedSearchItem"
           :loading="isSearchLoading"
           :items="searchItems"
           :search-input.sync="search"
           item-text="name"
           item-value="id"
           no-data-text
           cache-items
           solo
           clearable
           dense
           label="Feature"
          >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title>
                  Add
                  <strong>{{ selectedSearchItem }}</strong>
                </v-list-tile-title>
              </v-list-tile>
            </template>
          </v-autocomplete>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn :disabled="!selectedSearchItem" class="primary">Add</v-btn>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile v-if="isAdding">
        <v-layout justify-space-between row>
          <v-flex grow pa-1 d-flex>
            <v-text-field label="Regular"></v-text-field>
          </v-flex>
          <v-flex shrink pa-1>
            <v-btn icon class="primary"><v-icon>add</v-icon></v-btn>
          </v-flex>
        </v-layout>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  import db from '@/services/db';
  export default {
    name: "RelationsList",
    props: {
      items: Array
    },
    data() {
      return {
        isAdding: false,
        isSearching: false,
        isSearchLoading: false,
        searchedClassifiers: [],
        search: null,
        selectedSearchItem: null,
      }
    },
    mounted() {
    },
    watch: {
      search(val) {
        val && val !== this.selectedSearchItem && this.querySelections(val)
      }
    },
    methods: {
      querySelections(q) {
        this.isSearchLoading = true;
        db.searchFeatures(q).then(r => {
          this.searchItems = r.features;
          this.isSearchLoading = false;
        })
      }
    }
  }
</script>

<style scoped>

</style>
