import { uid } from "quasar"
import { firebaseAuth, firebaseDb } from "src/boot/firebase"

const state = {
    loggedIn: false,
    currentUser: {}
}

const mutations = {
    selectUser(state, user){
        state.currentUser = user
    }
}

const actions = {
    registerUser({commit}, user){
        firebaseAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then((createdUser) => {
                const userId = firebaseAuth.currentUser.uid
                const refDb = firebaseDb.ref('users' + '/' + userId)
                createdUser.user.updateProfile({
                    displayName: user.username,
                    photoURL: `http://gravatar.com/avatar/${uid(createdUser.user.email)}?d=identicon`
                })
                .then(() => {
                    refDb.set({
                        username: createdUser.user.displayName,
                        photoURL: `http://gravatar.com/avatar/${uid(createdUser.user.email)}?d=identicon`
                    })
                })

            })
            .catch((err) => {
                
            })
    },
    logInUser({commit}, user){
        firebaseAuth.signInWithEmailAndPassword(user.email, user.password)
            .then((loggedInUser) => {
                console.log(loggedInUser)
            })
            .catch((err) => {
                console.log(err)
            })
    },
    handleAuthStateChange({commit, dispatch}){
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                commit('selectUser', user)
                dispatch('User/fbReadData', null, { root: true })
            } else {
                commit('selectUser', false)
            }
        })
    }
}

const getters = {
    getCurrentUser: (state) => {
        return state.currentUser
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}