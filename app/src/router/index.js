import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Log In',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/messages/:matchId',
    name: 'Messages',
    component: () => import('../views/Messages.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
