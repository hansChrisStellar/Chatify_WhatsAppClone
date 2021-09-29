import { firebaseAuth, firebaseDb } from "src/boot/firebase"
import { uid } from "quasar"

const state = {
    chanels: {},
    currentChanel: {},

}

const mutations = {
    addChanels(state, chanels){
        state.chanels[chanels.id] = chanels
    },
    selectChanel(state, chanelSelected){
        state.currentChanel = chanelSelected
    },
    addMessage(state, actualChanel){
        state.currentChanel = actualChanel
    },
}

const actions = {
    addNewChanel({}, chanelForm){
        const IdChanel = uid()
        const chanelRef = firebaseDb.ref('chanels/' + IdChanel)
        const user = {
            name: firebaseAuth.currentUser.displayName,
            avatar: firebaseAuth.currentUser.photoURL
        }
        chanelRef.set({
            name: chanelForm.name,
            description: chanelForm.description,
            id: IdChanel,
            createdBy: user
        })
    },
    selectChanelVuex({commit}, chanelSelected){
        commit('selectChanel', chanelSelected)
    },
    sendMessage({state}, message){
        const messageUniqueId = uid()
        const currentChanel = state.currentChanel.id
        const refDb = firebaseDb.ref('chanels/' + currentChanel + '/messages/' + messageUniqueId)
        const actualDate = new Date().getTime()
        const anotherTimeFormat = new Date().getHours() + ':' + new Date().getMinutes()
        refDb.set({
            content: message,
            timestamp: actualDate,
            anotherTimeFormat: anotherTimeFormat,
            user: {
                avatar: firebaseAuth.currentUser.photoURL,
                id: firebaseAuth.currentUser.uid,
                name: firebaseAuth.currentUser.displayName
            }
        })
        
    },
    fbReadData({commit}){
        const chanels = firebaseDb.ref('chanels')
        chanels.on('child_added', snapshot => {
            let chanels = snapshot.val()
            commit('addChanels', chanels)
        })
        chanels.on('child_changed', snapshot => {
            let message = snapshot.val()
            commit('addMessage', message)
        })
    },
    logOff(){
        firebaseAuth.signOut()
    },
}

const getters = {
    getChanels: (state) => {
        return state.chanels
    },
    getMessages: (state) => {
        let message = []
        let actualChanelSectionMessages = state.currentChanel.messages
        for (const chanelMessage in actualChanelSectionMessages){
            message.push(actualChanelSectionMessages[chanelMessage])
        }
        return message.sort((a,b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}