<template>
  <div class="chatsBase">
    <q-item-label header>Your info</q-item-label>
    <!-- Img -->
    <div class="imgUserInfoBase">
      <img :src="getCurrentUser.photoURL" class="imgUserInfo" />
    </div>
    <!-- Username -->
    <q-item clickable v-ripple>
      <q-item-section>
        <q-item-label lines="1">{{ getCurrentUser.username }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="edit" />
      </q-item-section>
    </q-item>
    <!-- Log Off -->
    <q-item clickable v-ripple @click="signOff">
      <q-item-section>
        <q-item-label lines="1">Log Out</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="logout" />
      </q-item-section>
    </q-item>
  </div>
  <chatWindow class="chatWindowBase" />
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("Auth", ["getCurrentUser"]),
  },
  methods: {
    ...mapActions("User", ["logOff"]),
    signOff() {
      this.logOff();
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
  .imgUserInfoBase {
    width: 100%;
    height: 15rem;
    padding: 1rem 3rem;
  }
  .imgUserInfo {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
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
