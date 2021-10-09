<template>
  <div class="baseMessageContainer">
    <MessageHeader />
    <div class="q-pa-md bg-blue-grey-8 chatBoxBase" ref="checkMessagePrivate">
      <q-chat-message
        v-for="(messageSection, index) in getMessagesPrivateChat"
        :key="index"
        :name="messageSection.user.name"
        :avatar="messageSection.user.avatar"
        :text="[messageSection.content]"
        :stamp="messageSection.anotherTimeFormat"
        text-color="white"
        bg-color="light-blue-6"
        :sent="getCurrentUser.username === messageSection.user.name"
      />
    </div>
    <MessageForm />
  </div>
</template>
<script>
import MessageForm from "../DM-Section/MessageForm.vue";
import MessageHeader from "../DM-Section/MessageHeader.vue";
import { mapGetters, mapActions, mapState } from "vuex";
import { firebaseAuth } from "src/boot/firebase";
export default {
  components: {
    MessageHeader,
    MessageForm,
  },
  computed: {
    ...mapGetters("User", ["getMessagesPrivateChat"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
  },
  watch: {
    getMessagesPrivateChat: function (val) {
      let pageChatPrivate = this.$refs.checkMessagePrivate;
      setTimeout(() => {
        pageChatPrivate.scrollTo(0, pageChatPrivate.scrollHeight);
      }, 10);
    },
  },
  mounted() {
    let pageChatPrivate = this.$refs.checkMessagePrivate;
    pageChatPrivate.scrollTo(0, pageChatPrivate.scrollHeight);
  },
};
</script>
<style lang="scss">
.baseMessageContainer {
  height: 100%;
  width: 100%;
}
.chatBoxBase {
  height: 40rem;
  border-top: solid 1px grey;
  border-bottom: solid 1px grey;
  overflow-x: hidden;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #020202;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
