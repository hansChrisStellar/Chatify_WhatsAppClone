import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import User from './store-user'
import Auth from './store-auth'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      User,
      Auth,
    },

    strict: process.env.DEBUGGING
  })

  return Store
})
