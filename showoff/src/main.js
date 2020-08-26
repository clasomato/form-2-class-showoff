import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'fontawesome'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import router from './router'
import store from './store'
import 'toastr/build/toastr.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
