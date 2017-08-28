// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './src/components/App'
import router from './src/router'
import store from './src/store'

Vue.config.productionTip = false

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

import 'vue-awesome/icons/square-o'
import 'vue-awesome/icons/check-square-o'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)

require('./node_modules/reset-css/reset.css')
require('./node_modules/spectre.css/dist/spectre.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
