import { createRouter, createWebHashHistory } from 'vue-router'

import { AuthLoginRoute } from './beacon/endpoints/auth/AuthRoute.js'
import { AuthScopeRoute } from './beacon/endpoints/auth/ScopeRoute.js'
import { RootRoute } from './beacon/endpoints/RootRoute.js'
import { InfoRoute } from './beacon/endpoints/info/InfoRoute.js'
import { ModelsRoute } from './beacon/endpoints/models/ModelsRoute.js'
import { GenomicVariationsRoute } from './beacon/endpoints/models/genomicVariations/route.js'


const beaconRoutes =
[

  AuthLoginRoute,
  AuthScopeRoute,
  RootRoute,
  InfoRoute,
  ModelsRoute,
  GenomicVariationsRoute,
  

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
