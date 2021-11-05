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
          <q-tab-panel name="chats">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>

        <!-- Contacts -->
      </section>
      <!-- Chat Area -->
      <section class="col-9 bg-red">asdfdasf</section>
    </container>
    <!-- Mobile & Tablet -->
    <section class="row mobileVersion"></section>
  </q-page>
</template>
<script>
import { firebaseAuth, firebaseDb } from "src/boot/firebase";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {},
  methods: {},
  data() {
    return {
      tab: "contacts",
      active: true,
    };
  },
  methods: {
    ...mapActions("settingsUser", ["changeUserChat"]),
    logOut() {
      firebaseAuth.signOut();
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
    ...mapState("settingsUser", ["currentUserInfoData"]),
    getContacts() {
      let allContacts = this.currentUserInfoData.following;
      return allContacts;
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
