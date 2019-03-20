import {Feature} from "@/services/model"

// Mutations
const SET_FEATURE = 'SET_FEATURE';
const HIDE = 'HIDE';
const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_ENDED = 'LOADING_ENDED';
const SHOW = 'SHOW';

const state = {
  isLoading: false,
  isShowing: false,
  hideRequested: false,
  feature: {}
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

    if(state.hideRequested) {
      state.isShowing = false;
      state.hideRequested = false;
    }
  },
  [SET_FEATURE](state, feature) {
    state.feature = feature;
    state.isShowing = true;
    state.description = feature.description;
  },
  [SHOW](state) {
    state.isShowing = true;
  },
  [HIDE](state) {
    if(state.isLoading) {
      state.hideRequested = true;
    } else {
      state.isShowing = false;
    }
  }
};

const actions = {
  showFeature({commit, state}, featureId) {
    if(state.feature.id === featureId) {
      commit(SHOW);
      return;
    }

    commit(LOADING_STARTED);
    Feature.getById(featureId).then(feature => {
      commit(SET_FEATURE, feature);
    }).finally(() => {
      commit(LOADING_ENDED);
    });
  },
  hideFeature({commit}) {
    commit(HIDE);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
