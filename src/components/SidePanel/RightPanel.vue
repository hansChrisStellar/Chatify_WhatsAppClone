<template>
  <div class="bg-grey-10 relative-position">
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
      <div class="justify-center text-white items-center text-weight-light row">
        <div class="ellipsis">
          {{ getCurrentUser.username }}
        </div>
        <q-btn-dropdown color="white" dense flat dropdown-icon="expand_more">
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label> Change avatar </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="logInOff">
              <q-item-section>
                <q-item-label>Sign Out</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <q-avatar size="35px">
        <img :src="getCurrentUser.photoURL" />
      </q-avatar>
    </div>

    <!-- User Dropdown -->

    <!-- Expansion -->
    <q-list dark class="">
      <q-expansion-item dense-toggle expand-separator label="Channels">
        <q-card>
          <!-- Channels -->
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
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section>{{ chanel.name }}</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-expansion-item>
    </q-list>
    <q-separator color="grey" spaced />

    <q-list class="absolute-bottom">
      <q-separator color="grey" spaced />
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
    </q-list>
    <!-- Modal -->
    <AddNewChannel v-model="showModalNewChannel" />
    <JoinChannel v-model="showModalJoinChannel" />
  </div>
</template>
<script>
import { firebaseAuth } from "../../boot/firebase";
import { mapActions, mapGetters, mapState } from "vuex";
import AddNewChannel from "./../Modals/AddNewChannel.vue";
import JoinChannel from "./../Modals/joinNewChannel.vue";
export default {
  methods: {
    ...mapActions("User", ["selectChanelVuex", "logOff"]),
    addNewChannel() {
      this.showModalNewChannel = true;
    },
    selectChanel(chanel) {
      this.selectChanelVuex(chanel);
    },
    logInOff() {
      this.logOff();
    },
    joinChannel() {
      this.showModalJoinChannel = true;
    },
  },
  computed: {
    ...mapGetters("User", ["getChanels", "getCurrentChanel"]),
    ...mapGetters("Auth", ["getCurrentUser", "getChannelsOffline"]),
  },
  components: {
    AddNewChannel,
    JoinChannel,
  },
  data() {
    return {
      showModalNewChannel: false,
      showModalJoinChannel: false,
      link: "hola",
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
</style>
