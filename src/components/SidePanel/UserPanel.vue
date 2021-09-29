<template>
  <div>
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
            <q-item-label>Sign out</q-item-label>
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
            <div>Add new channel</div>
            <q-icon name="add" color="green-3" size="1.5rem" />
          </q-card-section>
          <q-card-section
            class="flex justify-between cursor-pointer items-center"
            v-for="(chanel, key) in getChanels"
            :key="key"
            @click="selectChanel(chanel)"
          >
            {{ chanel.name }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <!-- Modal -->
    <AddNewChannel v-model="showModal" />
  </div>
</template>
<script>
import { firebaseAuth } from "../../boot/firebase";
import { mapActions, mapGetters } from "vuex";
import AddNewChannel from "./../Modals/AddNewChannel.vue";
export default {
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    ...mapActions("User", ["selectChanelVuex", "logOff"]),
    addNewChannel() {
      this.showModal = true;
    },
    selectChanel(chanel) {
      this.selectChanelVuex(chanel);
    },
    logInOff() {
      this.logOff();
    },
  },
  computed: {
    ...mapGetters("User", ["getChanels"]),
  },
  components: {
    AddNewChannel,
  },
};
</script>
