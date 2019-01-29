import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

//  组件按需加载
const Recommend = () => import('./components/recommend/Recommend');
const Singer = () => import('./components/singer/Singer');
const Rank = () => import('./components/rank/Rank');
const Search = () => import('./components/search/Search');
const SingerDetail = () => import('./components/singer-detail/SingerDetail');
const Disc = () => import('./components/disc/Disc');
const TopList = () => import('./components/top-list/TopList');
const UserCenter = () => import('./components/user-center/UserCenter');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
});
