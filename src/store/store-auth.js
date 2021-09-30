import { uid } from "quasar"
import { firebaseAuth, firebaseDb } from "src/boot/firebase"

const state = {
    loggedIn: false,
    currentUser: {},
    channelsOffline: []
}

const mutations = {
    selectUser(state, user){
        state.currentUser = user
    },
    addChannelsOffline(state, channels){
        state.channelsOffline = channels
    },
    clearAllData(state, payload){
        state.currentUser = payload
        state.channelsOffline = payload
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
                const userId = firebaseAuth.currentUser.uid
                const UserRef = firebaseDb.ref('users')
                UserRef.on('child_added', snapshot => {
                    let user = snapshot.val()
                    if (snapshot.key === userId) {
                        commit('selectUser', user)
                    }
                })
                dispatch('User/fbReadChannels', null, { root: true })
                dispatch('User/fbReadMessages', null, { root: true })
                dispatch('fbReadDataUserChannels')
                this.$router.push('/')
            } else {
                commit('selectUser', false)
                commit('clearAllData', false)
                dispatch('User/clearData', null, { root: true })
                this.$router.push('/auth')
            }
        })
    },
    fbReadDataUserChannels({state, commit}){
        let channels = []
        const userId = firebaseAuth.currentUser.uid
        const chanels = firebaseDb.ref('users/' + userId + '/channels')
        chanels.on('child_added', snapshot => {
            channels.push(snapshot.val())
            commit('addChannelsOffline', channels)
        })
        chanels.on('child_changed', snapshot => {
            channels.push(snapshot.val())
            commit('addChannelsOffline', channels)
        })
    },
}

const getters = {
    getCurrentUser: (state) => {
        return state.currentUser
    },
    getChannelsOffline: (state) => {
        return state.channelsOffline
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}