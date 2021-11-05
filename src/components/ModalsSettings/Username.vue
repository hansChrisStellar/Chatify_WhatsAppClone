<template>
  <q-dialog class="dialogs">
    <q-banner class="bg-grey-3">
      <q-input
        v-model="username"
        dense
        outlined
        :bg-color="bgColor"
        :label="labelInput"
        maxlength="12"
        :color="this.validateUsername(this.username) ? this.color : 'grey'"
      />
      <template v-slot:action>
        <q-btn
          flat
          :disable="
            !this.validateUsername(this.username) || username.length <= 0
          "
          :color="this.validateUsername(this.username) ? this.color : 'grey'"
          :icon="this.iconShow"
          dense
          @click="sendNewUsername"
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
      username: "",
      allSet: false,
      iconShow: "send",
      color: "positive",
      labelInput: "Insert your new username",
    };
  },
  methods: {
    validateUsername(name) {
      const re = /^[a-zA-Z0-9]+$/;
      return re.test(String(name));
    },
    sendNewUsername() {
      this.allSet = true;
      let newName = this.username.toLowerCase();
      let databaseRef = firebaseDb.ref("toneygram");
      databaseRef
        .once("value", (allData) => {})
        .then((allData) => {
          let allDataVar = allData.val();
          if (!(newName in allDataVar.names)) {
            // Replace actual name
            databaseRef
              .child("names/" + firebaseAuth.currentUser.displayName)
              .remove()
              .then(() => {
                databaseRef
                  .child("names/" + newName)
                  .set(newName)
                  .then(() => {
                    firebaseAuth.currentUser.updateProfile({
                      displayName: newName,
                    });
                  });
              });
            let userId = firebaseAuth.currentUser.uid;
            // --- Replace in posts section --- //
            Object.values(allDataVar.posts[userId]).forEach((Post) => {
              databaseRef
                .child(
                  "posts/" + userId + "/" + Post.idPost + "/userInfo/userName"
                )
                .set(newName);
            });
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
                          "/name"
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
                        "users/" + User + "/followers/" + followerUser + "/name"
                      )
                      .set(newName);
                  }
                }
              }
            }
            // --- Replace in actual users posts --- //
            for (const Post in allDataVar.users[userId].posts) {
              databaseRef
                .child(
                  "users/" + userId + "/posts/" + Post + "/userInfo/userName"
                )
                .set(newName);
            }
            // --- Replace in actual users section --- //
            databaseRef
              .child("users/" + userId + "/userInformation/name")
              .set(newName)
              .then(() => {
                this.bgColor = "green-3";
                this.allSet = false;
                this.username = "";
                this.iconShow = "done";
                this.labelInput = "Username changed";
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
          } else {
            this.bgColor = "red-3";
            this.allSet = false;
            this.iconShow = "error_outline";
            this.color = "negative";
            this.labelInput = "Username is taken";
            setTimeout(() => {
              this.bgColor = "white";
              this.iconShow = "send";
              this.color = "positive";
              this.labelInput = "Insert your name here";
            }, 2000);
          }
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
