import { firebaseAuth, firebaseDb } from "src/boot/firebase"
import { uid } from "quasar"

const state = {
    chanels: {},
    currentChanel: {},
    messages: {},
}

const mutations = {
    addChanels(state, chanels){
        state.chanels[chanels.id] = chanels
    },
    selectChanel(state, chanelSelected){
        state.currentChanel = chanelSelected
    },
    addMessages(state, messages){
        state.messages[messages.messageId] = messages.message
    },  
    clearAllData(state, payload){
        state.currentChanel = {}
        state.chanels = {}
        state.messages = {}
    }
}

const actions = {
    addNewChanel({}, chanelForm){
        const IdChanel = uid()
        const idUser = firebaseAuth.currentUser.uid
        const channelsRef = firebaseDb.ref('channels/' + IdChanel)
        const channelUserRef = firebaseDb.ref('users/' + idUser + '/channels/' + IdChanel)
        const user = {
            name: firebaseAuth.currentUser.displayName,
            avatar: firebaseAuth.currentUser.photoURL
        }
        channelUserRef.set({
            name: chanelForm.name,
            description: chanelForm.description,
            id: IdChanel,
            createdBy: user
        })
        channelsRef.set({
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
        const refDb = firebaseDb.ref('messages/' + currentChanel + '/' + messageUniqueId)
        const actualDate = new Date().getTime()
        const anotherTimeFormat = new Date().getHours() + ':' + new Date().getMinutes()
        refDb.set({
            content: message,
            timestamp: actualDate,
            anotherTimeFormat: anotherTimeFormat,
            channelId: currentChanel,
            user: {
                avatar: firebaseAuth.currentUser.photoURL,
                id: firebaseAuth.currentUser.uid,
                name: firebaseAuth.currentUser.displayName
            }
        })
        
    },
    joinAnotherChannel({state, commit, dispatch}, channel){
        const userId = firebaseAuth.currentUser.uid
        const channelsRef = firebaseDb.ref('channels')
        channelsRef.on('child_added', snapshot => {
            let channels = snapshot.val()
            if (channel === channels.id) {
                const channelUserRef = firebaseDb.ref('users/' + userId + '/channels/' + channels.id)
                channelUserRef.set({
                    name: channels.name,
                    description: channels.description,
                    id: channels.id,
                    createdBy: {
                        avatar: channels.createdBy.avatar,
                        name: channels.createdBy.name
                    }
                })
            }
            dispatch('Auth/fbReadDataUserChannels', null, {root: true})
        })
    },
    clearData({commit}){
        commit('clearAllData', false)
    },
    logOff(){
        firebaseAuth.signOut()
    },
    fbReadChannels({state, commit}){
        const chanels = firebaseDb.ref('channels')

        chanels.once('value', snapshot => {
            let chanels = snapshot.val()
            commit('addChanels', chanels)
        })

        chanels.on('child_added', snapshot => {
            let chanels = snapshot.val()
            commit('addChanels', chanels)
        })
        // chanels.on('child_changed', snapshot => {
        //     let message = snapshot.val()
        //     commit('addMessage', message)
        // })
    },
    fbReadMessages({state, commit}){
        let currentChannelId = state.currentChanel.id
        const messages = firebaseDb.ref('messages/' )
        messages.on('child_added', snapshot => {
            let messages = {
                messageId: snapshot.key,
                message: snapshot.val()
            }
            commit('addMessages', messages)
        })

        messages.on('child_changed', snapshot => {
            let messages = {
                messageId: snapshot.key,
                message: snapshot.val()
            }
            commit('addMessages', messages)
        })
    },
}

const getters = {
    getChanels: (state) => {
        return state.chanels
    },
    getMessages: (state) => {
        let messages = []
        let currentChannelId = state.currentChanel.id
        let allMessages = state.messages
        for (const message in allMessages){
            if (currentChannelId === message) {
                Object.values(allMessages[message]).forEach(message => {
                    messages.push(message)
                })
            }
        }
        return messages.sort((a,b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        })
        
     
        
        
        
        // let message = state.currentChanel.messages
        // for (const chanelMessage in actualChanelSectionMessages){
        //      message.push(actualChanelSectionMessages[chanelMessage])
        //  }
       
    },
    getCurrentChanel: (state) => {
        return state.currentChanel
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}