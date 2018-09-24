import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import auth from './modules/auth.js'
import notebooks from './modules/notebooks.js'
export default new Vuex.Store({
    modules: { auth, notebooks }
})