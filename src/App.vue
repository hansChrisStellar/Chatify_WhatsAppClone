<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
import { firebaseAuth, firebaseDb } from "src/boot/firebase";
import { Loading } from "quasar";
export default {
  name: "App",
  methods: {
    ...mapActions("settingsUser", ["sendUserInformation"]),
  },
  mounted() {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        const userInformation = firebaseDb.ref("toneygram/users/" + user.uid);
        userInformation.on("value", (allData) => {
          let allInfoUser = allData.val();
          this.sendUserInformation(allInfoUser);
        });
      }
    });
  },
};
</script>
