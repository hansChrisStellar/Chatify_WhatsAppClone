<template>
  <div class="chatBase">
    <!-- Header -->
    <div class="headerChatBase bg-white shadow-5">
      <!-- Title Channel -->
      <div class="items-center row">
        <q-btn dense flat icon="arrow_back_ios" @click="this.$router.go(-1)" />
        <!-- Img -->
        <q-avatar size="28px">
          <img
            :src="currentUserChat.userImg.photoURL"
            :alt="currentUserChat.username.userName"
          />
        </q-avatar>
        <!-- Name -->
        <div @click="seeInfo" class="items-center q-pl-sm cursor-pointer">
          <div v-if="currentUserChat.idUser.idUser in getContacts">
            {{ currentUserChat.username.userName }}
          </div>
          <div v-else class="ellipsis" style="max-width: 10rem">
            {{ currentUserChat.idUser.idUser }}
          </div>
        </div>
      </div>
      <!-- Input search -->
      <q-btn-dropdown
        class=""
        color="grey"
        dense
        flat
        size="15px"
        dropdown-icon="search"
        no-icon-animation
      >
        <q-list>
          <q-input
            label="Search Messages"
            dense
            label-color="white"
            outlined
            bg-color="grey-8"
            dark
          />
        </q-list>
      </q-btn-dropdown>
    </div>
    <!-- Chat Box -->
    <div class="chatBoxBase" ref="checkMessagePrivate">
      <q-chat-message
        v-for="(messageSection, index) in getMessagesPrivateChat"
        :key="index"
        :text="[messageSection.content]"
        :stamp="messageSection.anotherTimeFormat"
        text-color="black"
        :bg-color="
          messageSection.user.name === getCurrentUser.username.nameUser
            ? 'cyan-4'
            : 'cyan-1'
        "
        :sent="getCurrentUser.username.nameUser === messageSection.user.name"
      />
    </div>
    <!-- Form -->
    <div class="formBase bg-white shadow-5 row">
      <q-input
        rounded
        maxlength="300"
        autocomplete="off"
        color="cyan-9"
        dense
        outlined
        @keyup.enter.prevent="sendMessageForm"
        v-model="message"
        label="Type something"
        class="col-10"
      />

      <q-btn
        icon="send"
        flat
        rounded
        :color="disabled === true ? 'grey-6' : 'cyan-9'"
        :disable="disabled === true"
        @click.prevent="sendMessageForm"
        class="cursor-pointer col-2"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      message: "",
      disabled: true,
    };
  },
  computed: {
    ...mapGetters("User", ["getMessagesPrivateChat", "getContacts"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
    ...mapState("User", ["currentUserChat"]),
  },
  methods: {
    ...mapActions("User", [
      "sendMessageToUser",
      "storageChatOnList",
      "clearAllMessagesNotChecked",
      "addNewContact",
    ]),
    sendMessageForm() {
      this.storageChatOnList();
      this.sendMessageToUser(this.message);
      this.message = "";
    },
    seeInfo() {
      this.$router.push("/contactInfo");
    },
  },
  watch: {
    getMessagesPrivateChat: function (val) {
      this.clearAllMessagesNotChecked();
      let pageChatPrivate = this.$refs.checkMessagePrivate;
      setTimeout(() => {
        pageChatPrivate.scrollTo(0, pageChatPrivate.scrollHeight);
      }, 10);
    },
    message: function (val) {
      if (val.length >= 1) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
  mounted() {
    let pageChatPrivate = this.$refs.checkMessagePrivate;
    pageChatPrivate.scrollTo(0, pageChatPrivate.scrollHeight);
  },
};
</script>
<style lang="scss">
.chatBase {
  position: relative;
  height: 100vh;
}
.headerChatBase {
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
  height: 3rem;

  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
}

.chatBoxBase {
  height: 100vh;
  padding: 3.5rem 1rem;
  overflow-y: auto;
  background-color: silver;
  background-image: radial-gradient(
      circle at 100% 150%,
      silver 24%,
      white 24%,
      white 28%,
      silver 28%,
      silver 36%,
      white 36%,
      white 40%,
      transparent 40%,
      transparent
    ),
    radial-gradient(
      circle at 0 150%,
      silver 24%,
      white 24%,
      white 28%,
      silver 28%,
      silver 36%,
      white 36%,
      white 40%,
      transparent 40%,
      transparent
    ),
    radial-gradient(
      circle at 50% 100%,
      white 10%,
      silver 10%,
      silver 23%,
      white 23%,
      white 30%,
      silver 30%,
      silver 43%,
      white 43%,
      white 50%,
      silver 50%,
      silver 63%,
      white 63%,
      white 71%,
      transparent 71%,
      transparent
    ),
    radial-gradient(
      circle at 100% 50%,
      white 5%,
      silver 5%,
      silver 15%,
      white 15%,
      white 20%,
      silver 20%,
      silver 29%,
      white 29%,
      white 34%,
      silver 34%,
      silver 44%,
      white 44%,
      white 49%,
      transparent 49%,
      transparent
    ),
    radial-gradient(
      circle at 0 50%,
      white 5%,
      silver 5%,
      silver 15%,
      white 15%,
      white 20%,
      silver 20%,
      silver 29%,
      white 29%,
      white 34%,
      silver 34%,
      silver 44%,
      white 44%,
      white 49%,
      transparent 49%,
      transparent
    );
  background-size: 100px 50px;
}
.formBase {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 0 1rem;
  justify-content: space-between;
  height: 3rem;
  align-items: center;
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
