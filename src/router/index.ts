import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/Forum.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/Events.vue'),
    },
    {
      path: '/informations',
      name: 'informations',
      component: () => import('../views/Informations.vue'),
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: () => import('../views/Announcements.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/Account.vue'),
    },
    {
      path: '/merchants',
      name: 'merchants',
      component: () => import('../views/MerchantsList.vue'),
    },

  ],
})

export default router
