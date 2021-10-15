<template>
  <div class="chatBase">
    <!-- Header -->
    <div class="headerChatBase">
      <!-- Title Channel -->
      <div class="items-center row">
        <q-btn dense flat icon="arrow_back_ios" @click="this.$router.go(-1)" />
        <div class="items-center q-pl-sm">
          {{ currentChanel.name }}
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
    <div class="chatBoxBase" ref="checkMessage">
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
    ...mapGetters("User", ["getMessages"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
    ...mapState("User", ["currentChanel"]),
  },
  methods: {
    ...mapActions("User", ["sendMessage"]),
    sendMessageForm() {
      this.sendMessage(this.message);
      this.message = "";
    },
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
// .chatBase {
//   position: relative;
//   height: 100vh;
// }
// .headerChatBase {
//   z-index: 1;
//   width: 100%;
//   height: 3rem;
//   background: red;
//   display: flex;
//   justify-content: space-between;
//   padding: 0 1rem;
// }
// .chatBoxBase {
//   height: 100vh;
//   padding: 1rem 1rem 3.5rem;
//   overflow-y: auto;
// }

// .formBase {
//   position: fixed;
//   bottom: 0;
//   width: 100%;
//   background: red;
//   display: flex;
//   padding: 0 1rem;
//   justify-content: space-between;
//   height: 3rem;
//   align-items: center;
// }

// ::-webkit-scrollbar {
//   width: 5px;
// }

// /* Track */
// ::-webkit-scrollbar-track {
//   background: #020202;
// }

// /* Handle */
// ::-webkit-scrollbar-thumb {
//   background: #888;
// }

// /* Handle on hover */
// ::-webkit-scrollbar-thumb:hover {
//   background: #555;
// }
</style>
