import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      userName: null,
    },
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
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage, // 指定存储方式为 localStorage
    }),
  ],
});
