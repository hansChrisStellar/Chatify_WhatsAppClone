<template>
  <div>
    <!-- User Private Message -->
    <div v-if="Object.values(currentUserChat).length >= 1">
      <!-- Chat Box -->
      <div class="chatBoxBaseDesktop" ref="checkMessage">
        <q-chat-message
          v-for="(messageSection, index) in getMessagesPrivateChat"
          :key="index"
          :text="[messageSection.content]"
          :stamp="messageSection.anotherTimeFormat"
          text-color="white"
          bg-color="light-blue-6"
          :sent="getCurrentUser.username === messageSection.user.name"
        />
      </div>
      <!-- Form -->
      <q-form class="formBase">
        <q-input
          outlined
          v-model="message"
          maxlength="300"
          autocomplete="off"
          dense
          style="width: 100%"
          @keyup.enter.prevent="sendMessageForm"
        >
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
          <template v-slot:append>
            <q-icon
              name="send"
              @click.prevent="sendMessageForm"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-form>
    </div>
    <!-- Groups Channels Message -->
    <div v-if="Object.values(currentChanel).length >= 1">
      <!-- Chat Box -->
      <div class="chatBoxBaseDesktop" ref="checkMessage">
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
      <!-- Form -->
      <q-form class="formBase">
        <q-input
          outlined
          v-model="message"
          maxlength="300"
          autocomplete="off"
          dense
          style="width: 100%"
          @keyup.enter.prevent="sendMessageFormGroups"
        >
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
          <template v-slot:append>
            <q-icon
              name="send"
              @click.prevent="sendMessageFormGroups"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-form>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      message: "",
    };
  },
  computed: {
    ...mapGetters("User", ["getMessagesPrivateChat", "getMessages"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
    ...mapState("User", ["currentUserChat", "currentChanel"]),
  },
  methods: {
    ...mapActions("User", [
      "sendMessageToUser",
      "storageChatOnList",
      "sendMessage",
    ]),
    sendMessageForm() {
      this.storageChatOnList();
      this.sendMessageToUser(this.message);
      this.message = "";
    },
    sendMessageFormGroups() {
      this.sendMessage(this.message);
      this.message = "";
    },
    seeInfo() {
      this.$router.push("/contactInfo");
    },
  },
  watch: {
    getMessagesPrivateChat: function (val) {
      setTimeout(() => {
        if (Object.values(this.currentUserChat).length) {
          let pageChat = this.$refs.checkMessage;
          setTimeout(() => {
            pageChat.scrollTo(0, pageChat.scrollHeight);
          }, 10);
        }
      }, 100);
    },
    getMessages: function (val) {
      setTimeout(() => {
        if (Object.values(this.currentChanel).length) {
          let pageChat = this.$refs.checkMessage;
          setTimeout(() => {
            pageChat.scrollTo(0, pageChat.scrollHeight);
          }, 10);
        }
      }, 100);
    },
  },
  mounted() {
    if (Object.values(this.currentUserChat).length) {
      let pageChat = this.$refs.checkMessage;
      pageChat.scrollTo(0, pageChat.scrollHeight);
    }
    if (Object.values(this.currentChanel).length) {
      let pageChat = this.$refs.checkMessage;
      pageChat.scrollTo(0, pageChat.scrollHeight);
    }
  },
};
</script>
<style lang="scss">
.chatBoxBaseDesktop {
  padding: 1.5rem 1rem;
  overflow-y: auto;
  height: 88vh;
}
.formBaseDesktop {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: red;
  display: flex;
  padding: 0 1rem;
  justify-content: space-between;
  height: 3rem;
  align-items: center;
}
</style>
