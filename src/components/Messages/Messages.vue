<template>
  <div class="baseMessageContainer">
    <MessageHeader />
    <div class="q-pa-md bg-blue-grey-10 chatBoxBase">
      <q-chat-message
        v-for="(messageSection, index) in getMessages"
        :key="index"
        :name="messageSection.user.name"
        :avatar="messageSection.user.avatar"
        :text="[messageSection.content]"
        :stamp="messageSection.anotherTimeFormat"
        text-color="white"
        bg-color="light-blue-6"
        ref="checkMessage"
        :sent="getCurrentUser.username === messageSection.user.name"
      />
    </div>
    <MessageForm />
  </div>
</template>
<script>
import MessageForm from "./MessageForm.vue";
import MessageHeader from "./MessageHeader.vue";
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
  methods: {},
};
</script>
<style lang="scss">
.baseMessageContainer {
  height: 92.4vh;
  width: 100%;
}
.chatBoxBase {
  height: 37.1rem;
  border-top: solid 1px grey;
  border-bottom: solid 1px grey;
  overflow-x: hidden;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
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
