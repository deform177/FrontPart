import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Login from './components/Login.vue'
import DataTable from './components/DataTable.vue'
import Registration from './components/Registration.vue'
import Router from 'vue-router'

Vue.use(Router)
Vue.config.productionTip = false

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/dataTable', name: 'dataTable', component: DataTable },
  { path: '/registration', name: 'registration', component: Registration },
  { path: '/', redirect: '/login' }
]

const router = new Router({
  routes 
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
