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
  components: {},
};
</script>
<style lang="scss">
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
