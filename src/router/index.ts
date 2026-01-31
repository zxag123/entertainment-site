import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/games',
      name: 'Games',
      component: () => import('../views/Games.vue')
    },
    {
      path: '/jokes',
      name: 'Jokes',
      component: () => import('../views/Jokes.vue')
    },
    {
      path: '/music',
      name: 'Music',
      component: () => import('../views/Music.vue')
    },
    {
      path: '/tools',
      name: 'Tools',
      component: () => import('../views/Tools.vue')
    }
  ]
})

export default router
