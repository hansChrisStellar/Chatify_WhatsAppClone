<template>
  <div>
    <div class="q-pa-xl text-center">
      <q-avatar>
        <img :src="getCurrentUser.photoURL" />
      </q-avatar>
      <p class="q-mt-md">{{ getCurrentUser.username }}</p>
    </div>

    <!-- User Dropdown -->
    <q-btn-dropdown
      color="pink"
      label="Dropdown Button"
      dropdown-icon="change_history"
    >
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
    <!-- Expansion -->
    <q-list padding bordered class="rounded-borders">
      <q-expansion-item dense dense-toggle expand-separator label="Channels">
        <q-card>
          <q-card-section
            @click="addNewChannel"
            class="
              flex
              text-green-2
              justify-between
              cursor-pointer
              items-center
              bg-green-9
            "
          >
            <div>Create A New Channel</div>
            <q-icon name="add" color="green-3" size="1.5rem" />
          </q-card-section>
          <q-card-section
            @click="joinChannel"
            class="
              flex
              text-green-2
              justify-between
              cursor-pointer
              items-center
              bg-green-7
            "
          >
            <div>Join Channel</div>
            <q-icon name="add" color="green-5" size="1.5rem" />
          </q-card-section>
          <q-card-section
            class="flex justify-between cursor-pointer items-center"
            v-for="(chanel, key) in getChannelsOffline"
            :key="key"
            @click="selectChanel(chanel)"
          >
            {{ chanel.name }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <!-- Modal -->
    <AddNewChannel v-model="showModalNewChannel" />
    <JoinChannel v-model="showModalJoinChannel" />
  </div>
</template>
<script>
import { firebaseAuth } from "../../boot/firebase";
import { mapActions, mapGetters } from "vuex";
import AddNewChannel from "./../Modals/AddNewChannel.vue";
import JoinChannel from "./../Modals/joinNewChannel.vue";
export default {
  methods: {
    ...mapActions("User", ["selectChanelVuex", "logOff", "addChannelToShow"]),
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
    ...mapGetters("User", ["getChanels"]),
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
    };
  },
};
</script>
