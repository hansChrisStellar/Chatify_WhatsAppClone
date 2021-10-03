import { firebaseAuth, firebaseDb } from "src/boot/firebase"
import { uid } from "quasar"

const state = {
    chanels: {},
    currentChanel: {},
    currentUserChat: {},
    messages: {},
    contacts: {},
}

const mutations = {
    addChanels(state, chanels){
        state.chanels[chanels.id] = chanels
    },
    addContacts(state, contacts){
        state.contacts = contacts
    },
    addChanelsFirtsInstance(state, chanels){
        state.chanels = chanels
    },
    selectChanel(state, chanelSelected){
        state.currentChanel = chanelSelected
        state.currentUserChat = {}
    },
    selectUserChat(state, userChatSelected){
        state.currentUserChat = userChatSelected
        state.currentChanel = {}
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
    addNewContact({}, contactId){
        const contactRef = firebaseDb.ref('users/' + contactId)
        contactRef.on('value', snapshot => {
            const userInformation = snapshot.val()
            let userInfoPass = {
                name: userInformation.username,
                img: userInformation.photoURL,
                idUser: snapshot.key
            }
            const actualUserId = firebaseAuth.currentUser.uid
            const dbRef = firebaseDb.ref('users/' + actualUserId + '/contacts/' + contactId)
            dbRef.set({
                name: userInfoPass.name,
                img: userInfoPass.img,
                idUser: userInfoPass.idUser
            })
        })
    },
    selectChanelVuex({commit}, chanelSelected){
        commit('selectChanel', chanelSelected)
    },
    selectUserChatVuex({commit}, contactSelected){
        commit('selectUserChat', contactSelected)
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
            commit('addChanelsFirtsInstance', chanels)
        })

        chanels.on('child_added', snapshot => {
            let chanels = snapshot.val()
            commit('addChanels', chanels)
        })
        chanels.on('child_changed', snapshot => {
            let message = snapshot.val()
            commit('addMessage', message)
        })
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
    fbReadContacts({state, commit}){
        const actualUserId = firebaseAuth.currentUser.uid
        const fbRef = firebaseDb.ref('users/' + actualUserId + '/contacts')
        fbRef.once('value', snapshot => {
            let contacts = snapshot.val()
            commit('addContacts', contacts)
        })
    }
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
    },
    getContacts: (state) => {
        return state.contacts
    },
    getCurrentUserChat: (state) => {
        return state.currentUserChat
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}