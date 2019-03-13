import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import session from './session'
import notifications from './notifications'
import tooltip from './tooltip'

export default new Vuex.Store({
  modules: {
    session,
    notifications,
    tooltip
  }
});
