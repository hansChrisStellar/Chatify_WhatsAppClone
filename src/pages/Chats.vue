<template>
  <div class="chatsBase">
    <q-list class="bg-grey-10 text-white">
      <q-item
        dark
        v-for="(chat, key) in getChatList"
        :key="key"
        clickable
        v-ripple
        @click="selectUserChat(chat.userInfo)"
        class="q-py-md"
      >
        <q-item-section avatar top>
          <q-avatar>
            <img :src="chat.userInfo.img" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-section>{{ chat.userInfo.name }}</q-item-section>
          <!-- <q-item-section v-else>{{ key }}</q-item-section> -->
          <q-item-label caption class="row">
            <div>You:&nbsp;</div>
            {{ chat.lastMessage.content }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            v-if="chat.messagesNotCheked"
            color="green"
            :label="Object.values(chat.messagesNotCheked).length"
          />
        </q-item-section>
      </q-item>
      <q-separator color="grey-9" size="1px" />
    </q-list>
  </div>
  <chatWindow class="chatWindowBase" />
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    chatWindow: require("./DesktopWindow.vue").default,
  },
  methods: {
    ...mapActions("User", ["selectUserChatVuex"]),
    addNewContact() {
      this.showModalNewContact = true;
    },
    selectUserChat(contact) {
      this.selectUserChatVuex(contact);
      this.$router.push("/chatPrivate");
    },
  },
  computed: {
    ...mapGetters("User", ["getContacts", "getChatList"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
    ...mapState("User", ["messagesPrivateChat", "messagesNotRead"]),
  },
  data() {
    return {
      showModalNewContact: false,
    };
  },
};
</script>
<style lang="scss">
//iPhone
@media (max-width: 480px) {
  .chatsBase {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .chatWindowBase {
    display: none;
  }
}
//Tablet
@media (min-width: 480px) {
  .chatsBase {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .chatWindowBase {
    display: none;
  }
}
//Desktop
@media (min-width: 768px) {
  .chatsBase {
    display: none;
  }
  .chatWindowBase {
    display: flex;
    position: relative;
    flex-direction: column;
  }
}
</style>
