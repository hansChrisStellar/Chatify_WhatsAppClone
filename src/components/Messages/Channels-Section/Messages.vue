<template>
  <div class="baseMessageContainer">
    <MessageHeader />
    <div class="q-pa-md bg-blue-grey-8 chatBoxBase" ref="checkMessage">
      <q-chat-message
        v-for="(messageSection, index) in getMessages"
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
import MessageForm from "../Channels-Section/MessageForm.vue";
import MessageHeader from "../Channels-Section/MessageHeader.vue";
import { mapGetters, mapActions, mapState } from "vuex";
import { firebaseAuth } from "src/boot/firebase";
export default {
  components: {
    MessageHeader,
    MessageForm,
  },
  computed: {
    ...mapGetters("User", ["getMessages"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
  },
  watch: {
    getMessages: function (val) {
      let pageChat = this.$refs.checkMessage;
      setTimeout(() => {
        pageChat.scrollTo(0, pageChat.scrollHeight);
      }, 10);
    },
  },
  mounted() {
    let pageChat = this.$refs.checkMessage;
    pageChat.scrollTo(0, pageChat.scrollHeight);
  },
};
</script>
<style lang="scss">
// iPhone
@media (max-width: 480px) {
  .baseMessageContainer {
    height: auto;
  }
}
// Tablet
@media (min-width: 480px) {
  .baseMessageContainer {
    height: auto;
  }
}
// Desktop
@media (min-width: 768px) {
  .baseMessageContainer {
    height: auto;
  }
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
