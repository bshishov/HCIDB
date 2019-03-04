// Mutations
const ADD = 'ADD';
const REMOVE = 'REMOVE';
const REMOVE_BY_INDEX = 'REMOVE_BY_INDEX';

const state = {
  notifications: []
};

const getters = {
  notifications(state) {
    return state.notifications;
  }
};

const mutations = {
  [ADD](state, notification) {
    state.notifications.push(notification);
  },
  [REMOVE](state, notification) {
    let idx = state.notifications.indexOf(notification);
    if (idx >= 0){
      state.notifications.splice(idx, 1);
    }
  },
  [REMOVE_BY_INDEX](state, idx) {
    if (idx >= 0){
      state.notifications.splice(idx, 1);
    }
  }
};

const actions = {
  add({commit}, notification) {
    commit(ADD, notification);
    if ('time' in notification && notification.time > 0) {
      setTimeout(() => {
        commit(REMOVE, notification);
      }, notification.time);
    }
  },
  success({commit}, header) {
    commit(ADD, {
      header: header,
      type: 'success',
      time: 2000
    });
  },
  warning({commit}, header) {
    commit(ADD, {
      header: header,
      type: 'warning',
      time: 2000
    });
  },
  error({commit}, header) {
    commit(ADD, {
      header: header,
      type: 'error',
    });
  },
  dbError({commit}, dbErr) {
    if (!Array.isArray(dbErr))
    {
      commit(ADD, {
        header: 'Database error',
        type: 'error',
        content: dbErr,
      });
      return;
    }

    dbErr.forEach(err => {
      commit(ADD, {
        header: 'Database error',
        type: 'error',
        content: err.message,
      });
    });
  },
  remove({commit}, notification) {
    commit(REMOVE, notification);
  },
  removeByIndex({commit}, index) {
    commit(REMOVE_BY_INDEX, index);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
