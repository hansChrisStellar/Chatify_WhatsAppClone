<template>
  <q-layout view="hHh lpR fFr">
    <!-- Head Toolbar -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Title -->
        <q-toolbar-title> {{ this.$route.name }} </q-toolbar-title>
        <!-- Button Right -->
        <q-btn
          class="buttonRight"
          dense
          flat
          round
          icon="menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
        <!-- Button Left -->
        <q-btn
          class="buttonLeft"
          dense
          flat
          round
          icon="create"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
    </q-header>
    <!-- Left Side -->
    <div class="leftSide">
      <q-drawer
        v-model="leftDrawerOpen"
        side="left"
        overlay
        elevated
        class="bg-black"
      >
        <q-banner dense class="bg-grey-9">
          <div class="justify-between row items-center">
            <div class="q-pl-sm">New Chat</div>
            <q-btn
              color="red"
              dense
              flat
              icon="close"
              @click="leftDrawerOpen = !leftDrawerOpen"
            />
          </div>
          <q-input label="Search" dense rounded standout>
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-banner>
        <!-- Add contacts -->
        <q-item dark @click="addNewContact" clickable v-ripple>
          <q-item-section>Add Contact</q-item-section>
          <q-item-section avatar>
            <!-- <q-icon name="groups" /> -->
            <q-icon name="add" color="green" />
          </q-item-section>
        </q-item>
        <!-- Create Channel -->
        <q-item dark @click="addNewChannel" clickable v-ripple>
          <q-item-section>Create Channel</q-item-section>
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
        </q-item>
        <!-- Join Channel -->
        <q-item dark @click="joinChannel" clickable v-ripple>
          <q-item-section>Join Channel</q-item-section>
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
        </q-item>
        <q-separator color="grey-3" size="1px" />
        <!-- Contacts -->
        <q-item
          dark
          v-for="(contact, key) in getContacts"
          :key="key"
          clickable
          v-ripple
          active-class="my-menu-link"
          @click="selectUserChat(contact)"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="contact.img" />
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ contact.name }}</q-item-section>
        </q-item>
      </q-drawer>
    </div>
    <!-- Right Side -->
    <div class="rightSide">
      <q-drawer v-model="rightDrawerOpen" side="right" overlay elevated>
        <div class="bg-grey-10 relative-position rightPanel">
          <!-- Profile section -->
          <div
            class="
              q-pa-md
              text-center
              row
              flex
              bg-grey-10
              items-center
              justify-between
              headerName
            "
          >
            <div
              class="
                justify-center
                text-white
                items-center
                text-weight-light
                row
              "
            >
              <div class="ellipsis">
                {{ getCurrentUser.username }}
              </div>
            </div>
            <q-avatar size="35px">
              <img :src="getCurrentUser.photoURL" />
            </q-avatar>
          </div>
          <!-- Tabs -->
          <q-card>
            <!-- Upper Tabs -->
            <q-tabs
              v-model="tabFooter"
              dense
              class="bg-grey-10 text-grey-7"
              active-color="primary"
              indicator-color="purple"
              align="justify"
            >
              <q-tab
                name="groups"
                icon="groups"
                @click="changeJustTab('groups')"
              />
              <q-tab
                name="chats"
                icon="all_inbox"
                @click="changeJustTab('chats')"
              />
              <q-tab
                name="settings"
                icon="settings"
                @click="changeJustTab('settings')"
              />
            </q-tabs>
            <!-- Bottom Tabs -->
            <q-tab-panels
              v-model="tabFooter"
              animated
              class="text-white no-border no-border-radius"
            >
              <!-- Channels -->
              <q-tab-panel name="groups" class="no-padding">
                <q-list class="bg-grey-10 text-primary">
                  <q-item
                    dark
                    v-for="(chanel, key) in getChannelsOffline"
                    :key="key"
                    @click="selectChanel(chanel)"
                    clickable
                    v-ripple
                    :active="chanel.name == getCurrentChanel.name"
                    active-class="my-menu-link"
                  >
                    <q-item-section>{{ chanel.name }}</q-item-section>
                    <q-item-section avatar>
                      <!-- <q-icon name="groups" /> -->
                      <q-icon name="circle" color="red" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <!-- Direct Messages -->
              <q-tab-panel name="chats" class="no-padding">
                <q-list class="bg-grey-10 text-white">
                  <!-- Contacts -->
                  <q-item
                    dark
                    v-for="(contact, key) in getContacts"
                    :key="key"
                    clickable
                    v-ripple
                    active-class="my-menu-link"
                    @click="selectUserChatDesktop(contact)"
                  >
                    <q-item-section>{{ contact.name }}</q-item-section>
                    <q-item-section avatar>
                      <!-- <q-icon name="groups" /> -->
                      <q-icon name="circle" color="red" />
                    </q-item-section>
                  </q-item>
                  <!-- Add contacts -->
                  <q-item dark @click="addNewContact" clickable v-ripple>
                    <q-item-section>Add Contact</q-item-section>
                    <q-item-section avatar>
                      <!-- <q-icon name="groups" /> -->
                      <q-icon name="add" color="green" />
                    </q-item-section>
                  </q-item>
                  <!-- Chats -->
                  <q-item
                    dark
                    v-for="(chat, key) in getChatList"
                    :key="key"
                    clickable
                    v-ripple
                    active-class="my-menu-link"
                    @click="selectUserChat(chat)"
                  >
                    <q-item-section v-if="key in getContacts">{{
                      chat.name
                    }}</q-item-section>
                    <q-item-section v-else>{{ key }}</q-item-section>
                    <q-item-section avatar>
                      <!-- <q-icon name="groups" /> -->
                      <q-icon name="circle" color="red" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <!-- Settings -->
              <q-tab-panel name="settings" class="no-padding">
                <q-list class="bg-grey-10 text-primary">
                  <!-- Create Channel -->
                  <q-item
                    dark
                    @click="addNewChannel"
                    clickable
                    class="bg-green-5"
                    v-ripple
                  >
                    <q-item-section>Create Channel</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="add" />
                    </q-item-section>
                  </q-item>
                  <!-- Join Channel -->
                  <q-item
                    dark
                    @click="joinChannel"
                    clickable
                    class="bg-green-3"
                    v-ripple
                  >
                    <q-item-section>Join Channel</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="add" />
                    </q-item-section>
                  </q-item>
                  <q-separator spaced="1px" color="grey" />
                  <!-- Change avatar -->
                  <q-item dark clickable v-ripple>
                    <q-item-section>Change Avatar</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="account_circle" />
                    </q-item-section>
                  </q-item>
                  <!-- Change name -->
                  <q-item dark clickable v-ripple>
                    <q-item-section>Change Name</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="drive_file_rename_outline" />
                    </q-item-section>
                  </q-item>
                  <q-separator spaced="1px" color="grey" />
                  <!-- Log Out -->
                  <q-item
                    dark
                    @click="logInOff"
                    clickable
                    class="bg-red-5"
                    v-ripple
                  >
                    <q-item-section>Log Out</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="logout" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
          <!-- Modal -->
          <AddNewChannel v-model="showModalNewChannel" />
          <JoinChannel v-model="showModalJoinChannel" />
          <AddNewContact v-model="showModalNewContact" />
        </div>
      </q-drawer>
    </div>
    <!-- Footer -->
    <q-footer reveal elevated class="bg-grey-8 text-white footerLayout">
      <q-tabs
        v-model="tabFooter"
        dense
        align="justify"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab
          name="chats"
          icon="question_answer"
          @click="changeTabFr('chats')"
        />
        <q-tab name="groups" icon="groups" @click="changeTabFr('groups')" />
        <q-tab
          name="settings"
          icon="settings"
          @click="changeTabFr('settings')"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import AddNewChannel from "./../components/Modals/AddNewChannel.vue";
import JoinChannel from "./../components/Modals/joinNewChannel.vue";
import AddNewContact from "./../components/Modals/AddNewContact.vue";
export default {
  methods: {
    ...mapActions("User", [
      "selectChanelVuex",
      "logOff",
      "selectUserChatVuex",
      "changeTab",
    ]),
    // Change tab and page
    changeTabFr(value) {
      this.changeTab(value);
      this.$router.push("/" + value);
    },
    // Just Change the tab
    changeJustTab(value) {
      this.changeTab(value);
    },
    selectChanel(chanel) {
      this.selectChanelVuex(chanel);
    },
    // Mobile Version Page Redirect
    selectUserChat(contact) {
      this.selectUserChatVuex(contact);
      this.$router.push("/chatPrivate");
    },
    // Desktop Version Not Redirect
    selectUserChatDesktop(contact) {
      this.selectUserChatVuex(contact);
    },
    logInOff() {
      this.logOff();
    },
    //Modals
    addNewChannel() {
      this.showModalNewChannel = true;
    },
    addNewContact() {
      this.showModalNewContact = true;
    },
    joinChannel() {
      this.showModalJoinChannel = true;
    },
  },
  computed: {
    ...mapState("User", ["tabFooter"]),
    ...mapGetters("User", [
      "getChanels",
      "getCurrentChanel",
      "getContacts",
      "getChatList",
    ]),
    ...mapGetters("Auth", ["getCurrentUser", "getChannelsOffline"]),
  },
  components: {
    AddNewChannel,
    JoinChannel,
    AddNewContact,
  },
  data() {
    return {
      showModalNewChannel: false,
      showModalJoinChannel: false,
      showModalNewContact: false,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
    };
  },
};
</script>
<style lang="scss">
.headerName {
  border-bottom: solid 1px grey;
}

.my-menu-link {
  color: white;
  background: #359bdf;
}
//iPhone
@media (max-width: 480px) {
  .leftSide {
  }
  .rightSide {
    display: none;
  }
  .buttonRight {
    display: none;
  }
}
//Tablet
@media (min-width: 480px) {
  .rightSide {
    display: none;
  }
  .buttonRight {
    display: none;
  }
}
//Desktop
@media (min-width: 768px) {
  .leftSide {
    display: none;
  }
  .rightSide {
    display: flex;
  }
  .buttonRight {
    display: flex;
  }
  .buttonLeft {
    display: none;
  }
  .footerLayout {
    display: none;
  }
}
</style>
