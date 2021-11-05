import { firebaseAuth, firebaseDb } from "src/boot/firebase";

const state = {
    currentUserInfoData: {},
    currentUserChat: {}
}

const mutations = {
    getDataUserInfo(state, data){
        state.currentUserInfoData = data
    },
    insertNewUser(state, newUser){
        state.currentUserChat = newUser
    }
}

const actions = {
    sendUserInformation({commit}, data){
        commit('getDataUserInfo', data)
    },
    changeUserChat({commit}, newUser){
        commit('insertNewUser', newUser)
    }
}

const getters = {
   
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}