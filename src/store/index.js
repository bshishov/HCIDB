import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import session from './session'
import notifications from './notifications'

export default new Vuex.Store({
  modules: {
    session: session,
    notifications: notifications
  }
});
