<template>
  <div class="chatsBase">
    <q-item-label header>Your info</q-item-label>
    <!-- Img -->
    <div class="imgUserInfoBase">
      <img :src="getCurrentUser.userImg.photoURL" class="imgUserInfo" />
    </div>
    <!-- Username -->
    <q-item class="currentUserName text-black">
      <q-item-section v-if="!barName">
        <q-item-label lines="1">{{
          getCurrentUser.username.nameUser
        }}</q-item-label>
      </q-item-section>
      <q-item-section v-else>
        <q-item-label lines="1"
          ><q-input
            color="cyan-5"
            v-model="newUsername"
            @keyup.enter.prevent="
              changeUsername(newUsername);
              barName = !barName;
            "
            label="Change your name"
            dense
        /></q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon
          name="edit"
          @click="barName = !barName"
          class="cursor-pointer"
          v-if="!barName"
        />
        <q-icon
          v-else
          name="cancel"
          @click="barName = !barName"
          class="cursor-pointer"
        />
      </q-item-section>
    </q-item>
    <!-- Log Off -->
    <q-item clickable v-ripple @click="signOff" class="logOff text-red">
      <q-item-section>
        <q-item-label lines="1">Log Out</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="logout" color="red" />
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
    ...mapActions("User", ["logOff", "changeUsername"]),
    signOff() {
      this.logOff();
    },
  },
  components: {},
  data() {
    return {
      barName: false,
      newUsername: "",
    };
  },
};
</script>
<style lang="scss">
//iPhone
@media (max-width: 480px) {
  .chatsBase {
  }
  .imgUserInfoBase {
    width: 100%;
    height: 16rem;
    border-radius: 100%;
    padding: 0 2rem 1rem;
    text-align: center;
  }
  .imgUserInfo {
    width: 15rem;
    height: 100%;
    border-radius: 100%;
  }
}
//Tablet
@media (min-width: 480px) {
  .chatsBase {
  }
  .imgUserInfoBase {
    width: 100%;
    height: 16rem;
    border-radius: 100%;
    padding: 0 2rem 1rem;
    text-align: center;
  }
  .imgUserInfo {
    width: 15rem;
    height: 100%;
    border-radius: 100%;
  }
}
//Desktop
@media (min-width: 768px) {
  .chatsBase {
  }
  .imgUserInfoBase {
    width: 100%;
    height: 16rem;
    border-radius: 100%;
    padding: 0 2rem 1rem;
    text-align: center;
  }
  .imgUserInfo {
    width: 15rem;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
