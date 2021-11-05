import Auth from './../pages/Auth.vue'
import Main from './../pages/Main.vue'
import ChatPrivate from './../pages/ChatPrivate.vue'
import ChatGroups from './../pages/ChatGroups.vue'
import Groups from './../pages/Groups.vue'
import ContactInfo from './../pages/ContactInfo.vue'
import UserSettings from './../pages/UserSettings.vue'
import Chats from './../pages/Chats.vue'
const routes = [
  {
    component: () => import('layouts/MainLayout.vue'),
    children: [
      
      {
        path: '/groups',
        component: Groups,
        name: 'Groups',
      },
      {
        path: '/settings',
        component: UserSettings,
        name: 'Settings',
      },
    ]
  },
  {
    component: () => import('layouts/noLayout.vue'),
    children: [
      {
        path: '/main',
        component: Main,
        name: 'Main'
      },
      {
        path: '/main/:userId',
        component: Chats,
        name: 'Chat',
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
    path: '/contactInfo',
    component: ContactInfo,
    name: 'ContactInfo',
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
