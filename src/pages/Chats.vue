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
        class="no-padding"
        style="border-bottom: grey solid 0.5px"
      >
        <q-slide-item
          right-color="red"
          v-if="chat"
          @right="eraseChat(key)"
          class="full-width no-padding bg-black col"
        >
          <template v-slot:right>
            <q-icon name="delete" />
          </template>
          <!-- Content -->
          <div class="row q-pa-sm items-center" v-if="chat.userInfo">
            <!-- Img -->
            <div class="q-pr-sm">
              <q-avatar>
                <img :src="chat.userInfo.img" />
              </q-avatar>
            </div>
            <!-- Right Side -->
            <div class="col">
              <!-- Name and full time year -->
              <div class="row items-center justify-between">
                <!-- Name -->
                <div
                  v-if="chat.userInfo.idUser in getContacts"
                  class="textShortOrLargeUpper text-weight-bold"
                >
                  {{ chat.userInfo.name }}
                </div>
                <div
                  v-else
                  class="textShortOrLargeUpper text-weight-bold ellipsis"
                >
                  {{ key }}
                </div>
                <!-- Full time year -->
                <div style="font-size: 11px" v-if="chat.lastMessage">
                  {{ chat.lastMessage.fullTimeYearFormat }}
                </div>
              </div>
              <!-- Content and notification -->
              <div class="row items-end justify-between">
                <!-- Content -->
                <div class="row" v-if="chat.lastMessage">
                  <div
                    v-if="
                      chat.lastMessage.user.name === getCurrentUser.username
                    "
                  >
                    You:&nbsp;
                  </div>
                  <div
                    class="ellipsis textShortOrLarge"
                    v-if="chat.lastMessage"
                  >
                    {{ chat.lastMessage.content }}
                  </div>
                </div>
                <!-- Notification -->
                <div side class="q-gutter-sm" v-if="chat.messagesNotChecked">
                  <q-badge color="cyan-3" text-color="black" rounded>
                    <div>
                      {{ Object.keys(chat.messagesNotChecked).length }}
                    </div>
                  </q-badge>
                </div>
              </div>
            </div>
          </div>
        </q-slide-item>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {},
  methods: {
    ...mapActions("User", [
      "selectUserChatVuex",
      "clearAllMessagesNotChecked",
      "eraseChat",
    ]),
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
