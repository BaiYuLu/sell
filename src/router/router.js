import Vue from 'vue'
import Router from 'vue-router'

import ratings from '@/components/ratings/ratings.vue'
import goods from '@/components/goods/goods.vue'
import seller from '@/components/seller/seller.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes:[
    {path:'/',redirect:'/goods'},
    {path:'/goods',component:goods},
    {path:'/ratings',component:ratings},
    {path:'/seller',component:seller},
  ],
  linkActiveClass:'active'
})
