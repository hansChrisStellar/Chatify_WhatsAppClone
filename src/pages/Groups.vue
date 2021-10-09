<template>
  <div class="chatsBase">
    <q-list class="bg-grey-10 text-primary">
      <q-item
        dark
        v-for="(chanel, key) in getChannelsOffline"
        :key="key"
        @click="selectChanel(chanel)"
        clickable
        v-ripple
      >
        <q-item-section>{{ chanel.name }}</q-item-section>
        <q-item-section avatar>
          <!-- <q-icon name="groups" /> -->
          <q-icon name="circle" color="red" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <chatWindow class="chatWindowBase" />
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters("Auth", ["getCurrentUser", "getChannelsOffline"]),
    ...mapGetters("User", ["getCurrentChanel"]),
  },
  methods: {
    ...mapActions("User", ["selectChanelVuex"]),
    selectChanel(chanel) {
      this.selectChanelVuex(chanel);
      this.$router.push("/chatGroups");
    },
  },
  components: {
    chatWindow: require("./DesktopWindow.vue").default,
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
  }
}
</style>
