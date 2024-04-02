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
    isLogin: false,
    positionCity: null,
    userPosition: null,
  },
  mutations: {
    changeisLogin(state) {
      state.isLogin = !state.isLogin;
    },
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
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    },
    setPositionCity(state, positionCity) {
      state.positionCity = positionCity;
    },
    setuserPosition(state, userPosition) {
      state.userPosition = userPosition;
    },
  },
  actions: {
    changeisLogin(context) {
      context.commit("changeisLogin");
    },
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
    clearUser(context) {
      context.commit("clearUser");
    },
    clearToken(context) {
      context.commit("clearToken");
    },
    setPositionCity(context, positionCity) {
      context.commit("setPositionCity", positionCity);
    },
    setuserPosition(context, userPosition) {
      context.commit("setuserPosition", userPosition);
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage, // 指定存储方式为 localStorage
    }),
  ],
});
