import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
import 'swiper/dist/css/swiper.css'
import './common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueAwesomeSwiper);
Vue.use(VueLazyLoad, {
  loading: require('./common/image/default.png')
});
fastclick.attach(document.body);

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
