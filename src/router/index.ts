import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/leads',
  },
  {
    path: '/leads',
    name: 'LeadsList',
    component: () => import('@/pages/LeadsListPage.vue'),
  },
  {
    path: '/leads/:id',
    name: 'LeadDetails',
    component: () => import('@/pages/LeadDetailsPage.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
