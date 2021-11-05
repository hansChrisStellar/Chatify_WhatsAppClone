<template>
  <q-dialog class="dialogs">
    <q-banner class="bg-grey-3">
      <q-input
        v-model="fullname"
        dense
        outlined
        :bg-color="bgColor"
        :label="labelInput"
        maxlength="12"
        :color="this.validateFullname(fullname) ? this.color : 'grey'"
      />
      <template v-slot:action>
        <q-btn
          flat
          :disable="!this.validateFullname(fullname) || fullname.length <= 0"
          :color="this.validateFullname(this.fullname) ? this.color : 'grey'"
          :icon="this.iconShow"
          dense
          @click="sendNewFullname"
          :loading="allSet"
        />
      </template>
    </q-banner>
  </q-dialog>
</template>
<script>
import { firebaseAuth, firebaseDb } from "src/boot/firebase";
export default {
  data() {
    return {
      bgColor: "white",
      fullname: "",
      allSet: false,
      iconShow: "send",
      color: "positive",
      labelInput: "Insert your new username",
    };
  },
  methods: {
    validateFullname(name) {
      const re = /^[a-z A-Z 0-9]+$/;
      return re.test(String(name));
    },
    sendNewFullname() {
      this.allSet = true;
      let newName = this.fullname;
      let databaseRef = firebaseDb.ref("toneygram");
      databaseRef
        .once("value", (allData) => {})
        .then((allData) => {
          let allDataVar = allData.val();
          let userId = firebaseAuth.currentUser.uid;

          // --- Replace in other users section --- //
          for (const User in allDataVar.users) {
            // Following
            if (allDataVar.users[User].following) {
              for (const followingUser in allDataVar.users[User].following) {
                if (followingUser === userId) {
                  databaseRef
                    .child(
                      "users/" +
                        User +
                        "/following/" +
                        followingUser +
                        "/fullname"
                    )
                    .set(newName);
                }
              }
            }
            // Followers
            if (allDataVar.users[User].followers) {
              for (const followerUser in allDataVar.users[User].followers) {
                if (followerUser === userId) {
                  databaseRef
                    .child(
                      "users/" +
                        User +
                        "/followers/" +
                        followerUser +
                        "/fullname"
                    )
                    .set(newName);
                }
              }
            }
          }
          // --- Replace in actual users section --- //
          databaseRef
            .child("users/" + userId + "/userInformation/fullname")
            .set(newName)
            .then(() => {
              this.bgColor = "green-3";
              this.allSet = false;
              this.username = "";
              this.iconShow = "done";
              this.labelInput = "Name changed";
              setTimeout(() => {
                this.bgColor = "white";
                this.iconShow = "send";
                this.labelInput = "Insert your name here";
              }, 2500);
            })
            .catch(() => {
              this.bgColor = "red-3";
              this.iconShow = "error_outline";
              this.color = "negative";
              setTimeout(() => {
                this.iconShow = "send";
                this.color = "positive";
              }, 2000);
            });
        });
    },
  },
};
</script>
<style lang="scss">
.dialogs {
  font-family: "Raleway";
}
</style>
