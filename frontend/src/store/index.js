import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {
      user_id: null,
      username: null,
      password: null,
      email: null,
      avatar_url: null,
    },
    token: null,
  },
  mutations: {
    setUserId(state, userId) {
      state.user.userId = userId;
    },
    clearUserId(state) {
      state.user.userId = null;
    },

    setUserName(state, userName) {
      state.user.userName = userName;
    },
    clearUserName(state) {
      state.user.userName = null;
    },
    setUser(state) {
      state.user = user;
    },
    setToken(state) {
      state.token = token;
    },
  },
  actions: {
    setUserId(context, userId) {
      context.commit("setUserId", userId);
    },
    clearUserId(context) {
      context.commit("clearUserId");
    },

    setUserName(context, userName) {
      context.commit("setUserName", userName);
    },
    clearUserName(context) {
      context.commit("clearUserName");
    },

    setUser(context, user) {
      context.commit("setUser", user);
    },
    setToken(context, token) {
      context.commit("setToken", token);
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage, // 指定存储方式为 localStorage
    }),
  ],
});
