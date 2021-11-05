<template>
  <q-page class="flex">
    <!-- Desktop -->
    <container class="row desktopVersion full-width">
      <!-- Control Area -->
      <section class="col-3 bg-blue">
        <!-- Header Actual User -->
        <q-banner inline-actions rounded class="bg-orange text-white">
          <q-img
            :ratio="1"
            width="42px"
            height="42px"
            :src="currentUserInfoData.img"
            style="border-radius: 100%; border: solid 1px black"
          />

          <template v-slot:action>
            <q-btn flat icon="settings" round />
            <q-btn flat icon="logout" round class="q-ml-sm" @click="logOut" />
          </template>
        </q-banner>
        <!-- Search -->
        <q-input
          rounded
          class="q-pa-sm"
          dense
          outlined
          v-model="text"
          label="Rounded outlined"
        />
        <!-- Tabs -->
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="contacts" label="Contacts" icon="contacts" />
          <q-tab name="chats" label="Chats" icon="chat" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <!-- Contacts -->
          <q-tab-panel name="contacts" class="no-padding">
            <q-list style="max-height: 36.6rem">
              <q-item
                v-for="(contact, index) in getContacts"
                :key="index"
                class="q-my-none"
                clickable
                v-ripple
                @click="sendUserToChat(contact)"
              >
                <q-item-section avatar>
                  <q-img
                    :ratio="1"
                    width="42px"
                    height="42px"
                    :src="contact.img"
                    style="border-radius: 100%; border: solid 1px black"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ contact.name }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    contact.fullname
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
          <!-- Chats -->
          <!-- <q-tab-panel name="chats">
            <q-list style="max-height: 36.6rem">
              <q-item
                v-for="(contact, index) in getChats"
                :key="index"
                class="q-my-none"
                clickable
                v-ripple
                @click="sendUserToChat(contact)"
              >
                <q-item-section avatar>
                  <q-img
                    :ratio="1"
                    width="42px"
                    height="42px"
                    :src="contact.img"
                    style="border-radius: 100%; border: solid 1px black"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ contact.name }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    contact.fullname
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list> -->
        </q-tab-panels>
      </section>
      <!-- Chat Area -->
      <section class="col-9 bg-red">
        <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">
          <q-header>
            <!-- Header Actual User -->
            <q-banner
              inline-actions
              rounded
              class="bg-orange text-white q-py-none q-pl-none q-pr-md"
            >
              <q-item class="q-my-none">
                <q-item-section avatar>
                  <q-img
                    :ratio="1"
                    width="42px"
                    height="42px"
                    :src="currentUserChat.img"
                    style="border-radius: 100%; border: solid 1px black"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ currentUserChat.name }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    currentUserChat.fullname
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <template v-slot:action>
                <q-btn-dropdown
                  color="primary"
                  no-icon-animation
                  dense
                  flat
                  rounded
                  dropdown-icon="more_vert"
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="onItemClick">
                      <q-item-section>
                        <q-item-label>Photos</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="onItemClick">
                      <q-item-section>
                        <q-item-label>Videos</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="onItemClick">
                      <q-item-section>
                        <q-item-label>Articles</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </template>
            </q-banner>
          </q-header>

          <q-footer>
            <q-toolbar class="q-px-none">
              <q-banner
                dense
                inline-actions
                class="text-white bg-red full-width"
              >
                <q-input
                  rounded
                  @keyup.enter.prevent="sendMessage"
                  outlined
                  dense
                  v-model="text"
                  label="Rounded outlined"
                />
                <template v-slot:action>
                  <q-btn
                    flat
                    color="white"
                    icon="send"
                    round
                    @click.prevent="sendMessage"
                  />
                </template>
              </q-banner>
            </q-toolbar>
          </q-footer>

          <q-page-container>
            <q-page class="q-pa-md">
              <q-chat-message
                v-for="(baseMessage, index) in getBaseMessages"
                :key="index"
                :stamp="baseMessage.showDate"
                :sent="
                  baseMessage.from ===
                  this.currentUserInfoData.userInformation.id
                "
                text-color="white"
                bg-color="primary"
              >
                <div
                  v-for="(message, index) in baseMessage.messages"
                  :key="index"
                >
                  {{ message }}
                </div>
              </q-chat-message>
            </q-page>
          </q-page-container>
        </q-layout>
      </section>
    </container>
    <!-- Mobile & Tablet -->
    <section class="row mobileVersion"></section>
  </q-page>
</template>
<script>
import { firebaseAuth, firebaseDb } from "src/boot/firebase";
import { mapActions, mapGetters, mapState } from "vuex";
import { uid } from "quasar";
export default {
  components: {},
  methods: {},
  data() {
    return {
      tab: "contacts",
      active: true,
      text: "",
    };
  },
  mounted() {
    setTimeout(() => {
      let currentChatUserId = this.$route.params.userId;
      let currentUserChat = firebaseDb.ref(
        "toneygram/users/" + currentChatUserId + "/userInformation"
      );
      currentUserChat.once("value", (allData) => {
        this.changeUserChat(allData.val());
      });
    }, 1000);
  },
  methods: {
    ...mapActions("settingsUser", ["changeUserChat"]),
    logOut() {
      firebaseAuth.signOut();
    },
    sendMessage() {
      let messageObject = {
        showDate:
          new Date().getHours() +
          ":" +
          (new Date().getMinutes() < 10 ? "0" : "") +
          new Date().getMinutes() +
          " | " +
          new Date().getDate() +
          " - " +
          new Date().getMonth() +
          " - " +
          new Date().getFullYear(),
        date:
          new Date().getHours() +
          "-" +
          (new Date().getMinutes() < 10 ? "0" : "") +
          new Date().getMinutes() +
          "-" +
          (new Date().getSeconds() < 10 ? "0" : "") +
          new Date().getSeconds() +
          "-" +
          new Date().getDate() +
          "-" +
          new Date().getMonth() +
          "-" +
          new Date().getFullYear() +
          "-" +
          firebaseAuth.currentUser.uid,
        messageRead: false,
        from: firebaseAuth.currentUser.uid,
        messages: {
          [new Date().getTime()]: this.text,
        },
      };
      // Send message to current user database
      let currentUserBaseRef = firebaseDb.ref(
        "toneygram/users/" + firebaseAuth.currentUser.uid
      );
      currentUserBaseRef.once("value", (base) => {
        let secondUserBaseRef = firebaseDb.ref(
          "toneygram/users/" +
            firebaseAuth.currentUser.uid +
            "/chats/" +
            this.currentUserChat.id +
            "/"
        );
        let baseVar = base.val();
        secondUserBaseRef.once("value", (secondBase) => {
          let secondBaseVar = secondBase.val();
          if (!baseVar.chats) {
            const newRoute = firebaseDb.ref(
              "toneygram/users/" +
                firebaseAuth.currentUser.uid +
                "/chats/" +
                this.currentUserChat.id +
                "/" +
                messageObject.date
            );
            newRoute.set(messageObject);
          } else if (baseVar.chats) {
            let thirdUserBaseRef = firebaseDb.ref(
              "toneygram/users/" + firebaseAuth.currentUser.uid + "/chats/"
            );
            thirdUserBaseRef.once("value", (thirdBase) => {
              let thirdBaseVar = thirdBase.val();
              if (!thirdBaseVar[this.currentUserChat.id]) {
                const newBaseRef = firebaseDb.ref(
                  "toneygram/users/" +
                    firebaseAuth.currentUser.uid +
                    "/chats/" +
                    this.currentUserChat.id +
                    "/" +
                    messageObject.date
                );
                newBaseRef.set(messageObject);
              } else if (thirdBaseVar[this.currentUserChat.id]) {
                if (!secondBaseVar[messageObject.date]) {
                  const newRoute = firebaseDb.ref(
                    "toneygram/users/" +
                      firebaseAuth.currentUser.uid +
                      "/chats/" +
                      this.currentUserChat.id +
                      "/" +
                      messageObject.date
                  );
                  newRoute.set(messageObject);
                } else if (secondBaseVar[messageObject.date]) {
                  const newRoute = firebaseDb.ref(
                    "toneygram/users/" +
                      firebaseAuth.currentUser.uid +
                      "/chats/" +
                      this.currentUserChat.id +
                      "/" +
                      messageObject.date +
                      "/messages/" +
                      new Date().getTime()
                  );
                  newRoute.set(this.text);
                }
              }
            });
          }
        });
      });

      // Send message to other user database
      let otherUserBaseRef = firebaseDb.ref(
        "toneygram/users/" + this.currentUserChat.id
      );
      otherUserBaseRef.once("value", (base) => {
        let secondUserBaseRef = firebaseDb.ref(
          "toneygram/users/" +
            this.currentUserChat.id +
            "/chats/" +
            firebaseAuth.currentUser.uid +
            "/"
        );
        let baseVar = base.val();
        secondUserBaseRef.once("value", (secondBase) => {
          let secondBaseVar = secondBase.val();
          if (!baseVar.chats) {
            const newRoute = firebaseDb.ref(
              "toneygram/users/" +
                this.currentUserChat.id +
                "/chats/" +
                firebaseAuth.currentUser.uid +
                "/" +
                messageObject.date
            );
            newRoute.set(messageObject);
          } else if (baseVar.chats) {
            let thirdUserBaseRef = firebaseDb.ref(
              "toneygram/users/" + this.currentUserChat.id + "/chats/"
            );
            thirdUserBaseRef.once("value", (thirdBase) => {
              let thirdBaseVar = thirdBase.val();
              if (!thirdBaseVar[firebaseAuth.currentUser.uid]) {
                const newBaseRef = firebaseDb.ref(
                  "toneygram/users/" +
                    this.currentUserChat.id +
                    "/chats/" +
                    firebaseAuth.currentUser.uid +
                    "/" +
                    messageObject.date
                );
                newBaseRef.set(messageObject);
              } else if (thirdBaseVar[firebaseAuth.currentUser.uid]) {
                if (!secondBaseVar[messageObject.date]) {
                  const newRoute = firebaseDb.ref(
                    "toneygram/users/" +
                      this.currentUserChat.id +
                      "/chats/" +
                      firebaseAuth.currentUser.uid +
                      "/" +
                      messageObject.date
                  );
                  newRoute.set(messageObject);
                } else if (secondBaseVar[messageObject.date]) {
                  const newRoute = firebaseDb.ref(
                    "toneygram/users/" +
                      this.currentUserChat.id +
                      "/chats/" +
                      firebaseAuth.currentUser.uid +
                      "/" +
                      messageObject.date +
                      "/messages/" +
                      new Date().getTime()
                  );
                  newRoute.set(this.text);
                }
              }
            });
          }
        });
      });
    },
    sendUserToChat(conctact) {
      this.$router
        .push({
          name: "Chat",
          params: {
            userId: conctact.id,
          },
        })
        .then(() => {
          this.changeUserChat(conctact);
        });
    },
  },
  computed: {
    ...mapState("settingsUser", ["currentUserInfoData", "currentUserChat"]),
    getContacts() {
      let allContacts = this.currentUserInfoData.following;
      return allContacts;
    },
    getChats() {
      let allChats = this.currentUserInfoData.chats;
      return allChats;
    },
    getBaseMessages() {
      let messages = [];
      const messageRef = firebaseDb.ref(
        "toneygram/users/" +
          this.currentUserInfoData.userInformation.id +
          "/chats/" +
          this.$route.params.userId
      );
      messageRef.on("value", (allMessages) => {
        messages = allMessages.val();
      });

      return messages;
    },
    getMessage() {
      let messages = [];
      const messageRef = firebaseDb.ref(
        "toneygram/users/" +
          this.currentUserInfoData.userInformation.id +
          "/chats/" +
          this.$route.params.userId
      );
      messageRef.on("value", (allMessages) => {
        Object.values(allMessages.val()).forEach((message) => {
          Object.values(message).forEach((mess) => {
            messages.push(mess);
          });
        });
      });
      console.log(messages, "mensajito");
      return messages;
    },
    getKeyChat() {
      let key = "";
      const messageRef = firebaseDb.ref(
        "toneygram/users/" +
          this.currentUserInfoData.userInformation.id +
          "/chats/" +
          this.$route.params.userId
      );
      messageRef.on("value", (keyChat) => {
        key = keyChat.key;
      });
      return key;
    },
  },
};
</script>
<style lang="scss">
//iPhone
@media (max-width: 480px) {
  .desktopVersion {
    display: none;
  }
  .mobileVersion {
    display: flex;
  }
}
//Tablet
@media (min-width: 480px) {
  .desktopVersion {
    display: none;
  }
  .mobileVersion {
    display: flex;
  }
}
//Desktop
@media (min-width: 768px) {
  .desktopVersion {
    display: flex;
  }
  .mobileVersion {
    display: none;
  }
}
</style>
