import { firebaseAuth, firebaseDb } from "src/boot/firebase"
import { uid } from "quasar"

const state = {
    chanels: {},
    currentChanel: {},
    currentUserChat: {},
    messages: {},
    messagesPrivateChat: {},
    messagesNotRead: {},
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
        let messagesOrderedByTime = Object.values(messages.message).sort((a,b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        })
        state.messagesPrivateChat[messages.messageId] = messagesOrderedByTime
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
    },
    // Send Messages not checked to array
    sendMessagesToNotCheckedArray(state, message){
        state.messagesNotRead[message.messageKey] = message.messageInfo
    }
}

const actions = {
    // Add New Channel
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
    // Add New Contact
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
    // Select Channel
    selectChanelVuex({commit}, chanelSelected){
        commit('selectChanel', chanelSelected)
    },
    // Select Private Chat
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
    sendMessageToUser({state, dispatch}, message){
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
            messageId: randomId,
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
            messageId: randomId,
            messageChecked: false,
            user: {
                avatar: firebaseAuth.currentUser.photoURL,
                id: firebaseAuth.currentUser.uid,
                name: firebaseAuth.currentUser.displayName
            }
        })
        dispatch('checkMessagesNotReaded')
        dispatch('getLastMessageOfEveryChat')
    },
    //Store Chat on List
    storageChatOnList({state}){
        //Information
        const currentUserId = firebaseAuth.currentUser.uid
        const currentUserAnother = state.currentUserChat.idUser

        //Actual User
        const refMessageActualUser = firebaseDb.ref('users/' + currentUserId + '/chatList/' + currentUserAnother + '/userInfo')
        refMessageActualUser.set({
            idUser: state.currentUserChat.idUser,
            img: state.currentUserChat.img,
            name: state.currentUserChat.name
        })
        //Another User
        const refMessageAnotherUser = firebaseDb.ref('users/' + currentUserAnother + '/chatList/' + currentUserId + '/userInfo')
        refMessageAnotherUser.set({
            idUser: firebaseAuth.currentUser.uid,
            img: firebaseAuth.currentUser.photoURL,
            name: firebaseAuth.currentUser.displayName
        })
    },
    // Check Globally Messages not Readed 
    checkMessagesNotReaded({commit, state}){
        const userId = firebaseAuth.currentUser.uid
        // Access to the Actual User Logged In Chats
        const dbRef = firebaseDb.ref('users/' + userId + '/chats')
        dbRef.on('child_added', snapshot => {
            // Grab every single chat from the user
            let chatsFromUser = snapshot.val()
            let chatKey = snapshot.key
            Object.values(chatsFromUser).forEach((messageFromChat) => {
                // If any message has message checked property on false goes to the array of not checked messages
                if (messageFromChat.messageChecked === false) {
                    // If theres any, we make a loop for the chat list of the actual user to send it to that object
                    Object.values(state.chatList).forEach((userFromChatList, key) => {
                        if (chatKey === userFromChatList.idUser) {
                            const refMessageActualUser = firebaseDb.ref('users/' + userId + '/chatList/' + chatKey + '/messagesNotCheked/' + messageFromChat.messageId)
                            refMessageActualUser.set({
                                anotherTimeFormat: messageFromChat.anotherTimeFormat,
                                content: messageFromChat.content,
                                messageChecked: messageFromChat.messageChecked,
                                timestamp:  messageFromChat.timestamp,
                                user: messageFromChat.user
                            })
                        }
                    })
                }
            })
        })
    },
    // Get the last message from every chat
    getLastMessageOfEveryChat({commit, state}){
        // First, we access to the chats of the actual user
        const userId = firebaseAuth.currentUser.uid
        const refChatsUser = firebaseDb.ref('users/' + userId + '/chats')
        refChatsUser.on('child_added', snapshot => {
            // Second, we access to every message of every chat
            let chatFromUser = snapshot.val()
            let chatIdFromUser = snapshot.key
            // We order the messages by timestamp
            let messagesOrdered = Object.values(chatFromUser).sort((a, b) => {
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            })
            // We search for the last item of the array that we just ordered
            let lastMessageFromChat = messagesOrdered[messagesOrdered.length - 1];
            // Now, lets set the ref in order to access to every chatList child in the Firebase
            const chatListLastMessageRef = firebaseDb.ref('users/' + userId + '/chatList')
            chatListLastMessageRef.on('child_added', snapshot => {
                // We create the variable id from every single chat
                let chatListIdChat = snapshot.key
                // We must create a conditional in order for every single chat goes to his specific root
                if (chatIdFromUser === chatListIdChat) {
                    // We create a new root inside the one that we had already for the last message
                    const lastMessageRef = firebaseDb.ref('users/' + userId + '/chatList/' + chatListIdChat + '/lastMessage')
                    lastMessageRef.set({
                        anotherTimeFormat: lastMessageFromChat.anotherTimeFormat,
                        content: lastMessageFromChat.content,
                        messageId: lastMessageFromChat.messageId,
                        timestamp: lastMessageFromChat.timestamp,
                        user: {
                            avatar: lastMessageFromChat.user.avatar,
                            id: lastMessageFromChat.user.id,
                            name: lastMessageFromChat.user.name,
                        }
                    })

                    // We do the same thing for the other user 
                    const lastMessageFromOtherUserRef = firebaseDb.ref('users/' + chatListIdChat + '/chatList/' + userId + '/lastMessage')
                    lastMessageFromOtherUserRef.set({
                        anotherTimeFormat: lastMessageFromChat.anotherTimeFormat,
                        content: lastMessageFromChat.content,
                        messageId: lastMessageFromChat.messageId,
                        timestamp: lastMessageFromChat.timestamp,
                        user: {
                            avatar: lastMessageFromChat.user.avatar,
                            id: lastMessageFromChat.user.id,
                            name: lastMessageFromChat.user.name,
                        }
                    })
                }

               
            })
        }
        )
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
        
        fbRef.on('value', snapshot => {
            let contacts = snapshot.val()
            commit('addContacts', contacts)
        })
        fbRef.on('value', snapshot => {
            let contacts = snapshot.val()
            commit('addContacts', contacts)
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