import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import User from './store-user'
import Auth from './store-auth'
import settingsUser from './settingsUser'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      User,
      Auth,
      settingsUser,
    },

    strict: process.env.DEBUGGING
  })

  return Store
})
