<template>
  <q-layout view="lHh lpR lFf" style="font-family: 'Montserrat'">
    <!-- Head Toolbar -->
    <q-header elevated class="bg-white text-grey-9">
      <q-toolbar>
        <!-- Title -->
        <q-toolbar-title class="text-h5 text-weight-regular">
          {{ this.$route.name }}
        </q-toolbar-title>
        <!-- Button Left -->
        <q-btn
          class="buttonLeft"
          dense
          color="cyan-3"
          flat
          round
          icon="create"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
    </q-header>
    <!-- Left Bar -->
    <div class="leftSide">
      <q-drawer
        v-model="leftDrawerOpen"
        side="left"
        overlay
        elevated
        class="bg-black"
        style="border-right: solid 1px grey"
      >
        <q-banner dense class="bg-grey-9 q-pb-md">
          <div class="justify-between row items-center q-pb-sm">
            <div class="q-pl-sm text-white text-weight-medium">New Chat</div>
            <q-btn
              color="red"
              dense
              flat
              icon="close"
              @click="leftDrawerOpen = !leftDrawerOpen"
            />
          </div>
          <q-input
            style="
              -webkit-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
              box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
            "
            color="white"
            bg-color="grey-6"
            label="Search"
            class="text-white"
            label-color="white"
            dense
            standout
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white" />
            </template>
          </q-input>
        </q-banner>
        <q-separator color="grey-8" size="1px" />

        <!-- Add contacts -->
        <q-item
          clickable
          v-ripple
          dark
          @click="addNewContact"
          class=""
          style="border-bottom: grey solid 0.5px"
        >
          <q-item-section avatar top>
            <q-avatar>
              <q-icon name="person_add" color="cyan-3" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-section>Add Contact</q-item-section>
          </q-item-section>
        </q-item>
        <!-- Create Group -->
        <q-item
          clickable
          v-ripple
          @click="addNewChannel"
          dark
          class=""
          style="border-bottom: grey solid 0.5px"
        >
          <q-item-section avatar top>
            <q-avatar>
              <q-icon name="groups" color="cyan-3" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-section>Create a Group Chat</q-item-section>
          </q-item-section>
        </q-item>
        <!-- Join Group Chat -->
        <q-item
          clickable
          v-ripple
          @click="joinChannel"
          dark
          class=""
          style="border-bottom: grey solid 0.5px"
        >
          <q-item-section avatar top>
            <q-avatar>
              <q-icon name="reply_all" color="cyan-3" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-section>Join Group</q-item-section>
          </q-item-section>
        </q-item>

        <!-- Contacts -->
        <q-item dark v-for="(contact, key) in getContacts" :key="key">
          <q-item-section
            class="cursor-pointer"
            avatar
            @click="selectUserChat(contact)"
          >
            <q-avatar>
              <img :src="contact.userImg.photoURL" />
            </q-avatar>
          </q-item-section>
          <q-item-section
            @click="selectUserChat(contact)"
            class="cursor-pointer"
            >{{ contact.username.userName }}</q-item-section
          >
          <q-item-section side
            ><q-btn-dropdown
              no-icon-animation
              dropdown-icon="more_vert"
              color="cyan"
              dense
              flat
            >
              <q-list>
                <!-- Invite to a group -->
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-avatar
                      icon="group_add"
                      color="primary"
                      text-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Invite user to a group</q-item-label>
                  </q-item-section>
                </q-item>
                <!-- Erase Contact -->
                <q-item
                  clickable
                  v-close-popup
                  @click="eraseContact(contact.idUser.idUser)"
                >
                  <q-item-section avatar>
                    <q-avatar
                      icon="delete"
                      color="primary"
                      text-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Erase contact</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown></q-item-section
          >
        </q-item>
        <!-- Modal -->
        <AddNewChannel v-model="showModalNewChannel" />
        <JoinChannel v-model="showModalJoinChannel" />
        <AddNewContact v-model="showModalNewContact" />
      </q-drawer>
    </div>

    <!-- Footer -->
    <q-footer reveal elevated>
      <q-tabs
        v-model="tabFooter"
        dense
        align="justify"
        class="bg-white text-cyan-8 shadow-2"
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
      "eraseContact",
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
}
//Tablet
@media (min-width: 480px) {
}
//Desktop
@media (min-width: 768px) {
}
</style>
