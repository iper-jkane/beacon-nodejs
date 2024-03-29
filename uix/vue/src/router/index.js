import { createRouter, createWebHashHistory } from 'vue-router'

import { RootRoute } from './endpoints/RootRoute.js'
import { InfoRoute } from './endpoints/info/InfoRoute.js'
import { ModelsRoute } from './endpoints/models/ModelsRoute.js'


const beaconRoutes =
[

  RootRoute,
  InfoRoute,
  ModelsRoute

  // ,{
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }

]
const router = createRouter({
  history: createWebHashHistory(),
  routes: beaconRoutes
})

export default router
