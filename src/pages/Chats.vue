<template>
  <div class="chatsBase">
    <q-list dark separator class="bg-black text-white">
      <q-item
        v-for="(chat, key) in getChatList"
        :key="key"
        clickable
        v-ripple
        @click="
          selectUserChat(chat.userInfo);
          clearMessagesNotChecked();
        "
        dark
        class="q-py-md"
        style="border-bottom: grey solid 0.5px"
      >
        <q-item-section avatar top>
          <q-avatar>
            <img :src="chat.userInfo.img" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-section
            v-if="chat.userInfo.idUser in getContacts"
            class="textShortOrLargeUpper text-weight-bold"
            >{{ chat.userInfo.name }}</q-item-section
          >
          <q-item-section
            v-else
            class="textShortOrLargeUpper text-weight-bold ellipsis"
            >{{ key }}</q-item-section
          >
          <q-item-label caption class="row">
            <div class="row" v-if="chat.lastMessage">
              <div
                v-if="chat.lastMessage.user.name === getCurrentUser.username"
              >
                You:&nbsp;
              </div>
              <div class="ellipsis textShortOrLarge">
                {{ chat.lastMessage.content }}
              </div>
            </div>
          </q-item-label>
        </q-item-section>
        <!-- Problem -->
        <q-item-section side class="q-gutter-sm" v-if="chat.lastMessage">
          <div style="font-size: 11px">
            {{ chat.lastMessage.fullTimeYearFormat }}
          </div>
          <q-badge
            v-if="chat.messagesNotCheked"
            color="cyan-3"
            text-color="black"
            rounded
          >
            <div>
              {{ Object.keys(chat.messagesNotCheked).length }}
            </div>
          </q-badge>
        </q-item-section>
        <!-- Problem -->
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {},
  methods: {
    ...mapActions("User", ["selectUserChatVuex", "clearAllMessagesNotChecked"]),
    addNewContact() {
      this.showModalNewContact = true;
    },
    selectUserChat(contact) {
      this.selectUserChatVuex(contact);
      this.$router.push("/chatPrivate");
    },
    clearMessagesNotChecked() {
      this.clearAllMessagesNotChecked();
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
.chatsBase {
  font-family: "Montserrat";
}
//iPhone
@media (max-width: 480px) {
  .textShortOrLargeUpper {
    max-width: 10rem;
  }
  .textShortOrLarge {
    max-width: 7rem;
  }
}
//Tablet
@media (min-width: 480px) {
  .textShortOrLargeUpper {
    max-width: 20rem;
  }
  .textShortOrLarge {
    max-width: 20rem;
  }
}
//Desktop
@media (min-width: 768px) {
  .textShortOrLargeUpper {
    max-width: 40rem;
  }
  .textShortOrLarge {
    max-width: 40rem;
  }
}
</style>
