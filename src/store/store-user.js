import { firebaseAuth, firebaseDb } from "src/boot/firebase"
import { uid } from "quasar"

const state = {
    chanels: {},
    currentChanel: {},
    currentUserChat: {},
    messages: {},
    messagesPrivateChat: {},
    contacts: {},
    chatList: {},
    tabFooter: 'chats',
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
    // Add Messages Group Chat
    addMessages(state, messages){
        state.messages[messages.messageId] = messages.message
    },  
    // Add Messages Private User
    addMessagesUser(state, messages){
        state.messagesPrivateChat[messages.messageId] = messages.message
    },
    //Add ChatList
    addChatList(state, chats){
        state.chatList[chats.chatKey] = chats.chatInfo
    },
    clearAllData(state, payload){
        state.currentChanel = {}
        state.chanels = {}
        state.messages = {}
        state.chatList = {}
        state.currentUserChat = {}
        state.contacts = {}
    },
    //Change Tab Footer
    changeFooterTab(state, payload){
        state.tabFooter = payload
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
    //Send message to group chats
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
    //Send message to users
    sendMessageToUser({state}, message){
        //Information
        let randomId = uid()
        const currentUserId = firebaseAuth.currentUser.uid
        const currentUser = state.currentUserChat.idUser
        const actualDate = new Date().getTime()
        const anotherTimeFormat = new Date().getHours() + ':' + new Date().getMinutes()
        // Actual user
        const refMessageActualUser = firebaseDb.ref('users/' + currentUserId + '/chats/' + currentUser + '/' + randomId)
        refMessageActualUser.set({
            content: message,
            timestamp: actualDate,
            anotherTimeFormat: anotherTimeFormat,
            user: {
                avatar: firebaseAuth.currentUser.photoURL,
                id: firebaseAuth.currentUser.uid,
                name: firebaseAuth.currentUser.displayName
            }
        })
        // Another User
        const refMessageAnotherUser = firebaseDb.ref('users/' + currentUser + '/chats/' + currentUserId + '/' + randomId)
        refMessageAnotherUser.set({
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
    //Store Chat on List
    storageChatOnList({state}){
        //Information
        const currentUserId = firebaseAuth.currentUser.uid
        const currentUserAnother = state.currentUserChat.idUser
        //Actual User
        const refMessageActualUser = firebaseDb.ref('users/' + currentUserId + '/chatList/' + currentUserAnother)
        refMessageActualUser.set({
            idUser: state.currentUserChat.idUser,
            img: state.currentUserChat.img,
            name: state.currentUserChat.name
        })
        //Another User
        const refMessageAnotherUser = firebaseDb.ref('users/' + currentUserAnother + '/chatList/' + currentUserId)
        refMessageAnotherUser.set({
            idUser: firebaseAuth.currentUser.uid,
            img: firebaseAuth.currentUser.photoURL,
            name: firebaseAuth.currentUser.displayName
        })
    },
    //Change Tab Footer
    changeTab({commit}, payload){
        commit('changeFooterTab', payload)
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
    // Read Channels
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
    // Read Messages from Group Chats
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
    // Read Messages from Private Chats
    fbReadMessagesPrivate({state, commit}){
        // Information
        const actualUserId = firebaseAuth.currentUser.uid
        const messages = firebaseDb.ref('users/' + actualUserId + '/chats')
        messages.on('child_added', snapshot => {
            let messages = {
                messageId: snapshot.key,
                message: snapshot.val()
            }
            commit('addMessagesUser', messages)
        })

        messages.on('child_changed', snapshot => {
            let messages = {
                messageId: snapshot.key,
                message: snapshot.val()
            }
            commit('addMessagesUser', messages)
        })

    },
    // Read Chat List
    fbReadChatList({state, commit}){
        //Information
        const userId = firebaseAuth.currentUser.uid
        const chatList = firebaseDb.ref('users/' + userId + '/chatList')
        chatList.on('child_added', snapshot => {
            let chatList = {
                chatKey: snapshot.key,
                chatInfo: snapshot.val(),
            }
            commit('addChatList', chatList)
        })

        chatList.on('child_changed', snapshot => {
            let chatList = {
                chatKey: snapshot.key,
                chatInfo: snapshot.val(),
            }
            commit('addChatList', chatList)
        })
    },
    // Read Contacts
    fbReadContacts({state, commit}){
        const actualUserId = firebaseAuth.currentUser.uid
        const fbRef = firebaseDb.ref('users/' + actualUserId + '/contacts')
        fbRef.once('value', snapshot => {
            let contacts = snapshot.val()
            if (contacts !== null) {
                commit('addContacts', contacts)
            } else {
                commit('addContacts', {})
            }
        })
    },

}

const getters = {
    getChanels: (state) => {
        return state.chanels
    },
    // Group Messages
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
    },
    // Private Chat Messages
    getMessagesPrivateChat: (state) => {
        let actualChatUserId = state.currentUserChat.idUser
        let messages = []
        let usersMessages = state.messagesPrivateChat
        for (const userId in usersMessages){
            if (actualChatUserId === userId) {
                Object.values(usersMessages[userId]).forEach(message => {
                    messages.push(message)
                })
            }
        }
        return messages.sort((a,b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        })  
    },
    getCurrentChanel: (state) => {
        return state.currentChanel
    },
    getContacts: (state) => {
        return state.contacts
    },
    getCurrentUserChat: (state) => {
        return state.currentUserChat
    },
    // Get Chats
    getChatList: (state) => {
        return state.chatList
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}