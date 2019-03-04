import {Auth, validateToken} from "@/services/auth";

'../services/auth'


// Localstorage keys
const ID_TOKEN = 'id_token';

// Mutations
const AUTHENTICATE = 'AUTHENTICATE';
const LOGOUT = 'LOGOUT';

const auth = new Auth();

const state = {
  accessToken: null,
  idToken: null,
  userRole: null,
  userName: null,
  userPic: null,
  userId: null
};

function stateFromPayload(payload) {
  state.userName = payload.name;
  state.userPic = payload.picture;
  state.userId = payload.sub;
  state.userRole = payload['https://hasura.io/jwt/claims']['x-hasura-default-role'];
}

// Get token from local storage if it exists
let existingToken = localStorage.getItem(ID_TOKEN);
if (existingToken) {
  validateToken(existingToken, payload => {
    state.idToken = existingToken;
    stateFromPayload(payload);
  }, err => {
    localStorage.removeItem('id_token');
    existingToken = null;
  });
}

const getters = {
  isAuthenticated(state) {
    return !!state.idToken;
  },
  userName(state) {
    return state.userName;
  },
  userPic(state) {
    return state.userPic;
  },
  userId(state) {
    return state.userId;
  },
  userRole(state) {
    return state.userRole;
  },
  canEdit(state) {
    return state.userRole === 'admin';
  }
};

const mutations = {
  [AUTHENTICATE](state, authData) {
    let payload = authData.idTokenPayload;

    state.accessToken = authData.accessToken;
    state.idToken = authData.idToken;

    stateFromPayload(payload);
    localStorage.setItem(ID_TOKEN, state.idToken);
  },

  [LOGOUT](state) {
    state.idToken = null;
    state.accessToken = null;
    state.userName = null;
    state.userPic = null;
    state.userId = null;
    state.userRole = null;

    localStorage.removeItem(ID_TOKEN);
  }
};

const actions = {
  login({ commit }) {
    // This will load auth0 auth page
    auth.login();
  },
  logout({ commit }) {
    commit(LOGOUT);
  },
  handleAuthentication({ commit }) {
    auth.handleAuthentication().then(authData => {
      commit(AUTHENTICATE, authData);
    })
    .catch(err => {
      console.log(err);
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
