import Auth from './../pages/Auth.vue'
import Home from './../pages/Index.vue'
import Chats from './../pages/Chats.vue'
import ChatPrivate from './../pages/ChatPrivate.vue'
import ChatGroups from './../pages/ChatGroups.vue'
import Groups from './../pages/Groups.vue'
const routes = [
  {
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/chats',
        component: Chats,
        name: 'Chats'
      },
      {
        path: '/groups',
        component: Groups,
        name: 'Groups',
      },
    ]
  },
  {
    path: '/chatPrivate',
    component: ChatPrivate,
    name: 'ChatPrivate',
  },
  {
    path: '/chatGroups',
    component: ChatGroups,
    name: 'ChatGroups',
  },
  {
    path: '/Auth',
    component: Auth,
    name: 'Auth'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
