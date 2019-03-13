import db from '@/services/db';

// Mutations
const SET_FEATURE = 'SET_FEATURE';
const UNSET_FEATURE = 'UNSET_FEATURE';
const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_ENDED = 'LOADING_ENDED';

const state = {
  isLoading: false,
  isShowing: false,
  feature: {
    id: -1,
    name: "",
    description: "",
    descriptionHtml: "",
    classifiers: []
  }
};

const getters = {
  isShowing(state) {
    return state.isShowing;
  },
  isLoading(state) {
    return state.isLoading;
  },
  feature(state) {
    return state.feature;
  }
};

const mutations = {
  [LOADING_STARTED](state) {
    state.isLoading = true;
  },
  [LOADING_ENDED](state) {
    state.isLoading = false;
  },
  [SET_FEATURE](state, feature) {
    state.isShowing = true;
    state.feature.name = feature.name;
    state.description = feature.description;
    state.feature.classifiers = feature.references.map(el => el.classifier);
  },
  [UNSET_FEATURE](state) {
    state.isShowing = false;
  }
};

const actions = {
  showFeature({commit, state}, featureId) {
    if(state.feature.id === featureId)
      return;

    commit(LOADING_STARTED);
    db.getFeature(featureId).then(feature => {
      commit(SET_FEATURE, feature);
    }).finally(() => {
      commit(LOADING_ENDED);
    });
  },
  hideFeature({commit}) {
    commit(UNSET_FEATURE);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
