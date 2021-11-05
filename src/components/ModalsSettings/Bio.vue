<template>
  <q-dialog class="dialogs">
    <q-banner class="bg-grey-3">
      <q-input
        v-model="bio"
        type="textarea"
        dense
        outlined
        :bg-color="bgColor"
        :label="labelInput"
        maxlength="100"
        :color="bio.length >= 1 ? this.color : 'grey'"
      />
      <template v-slot:action>
        <q-btn
          flat
          :disable="bio.length < 1"
          :color="bio.length >= 1 ? this.color : 'grey'"
          :icon="this.iconShow"
          dense
          @click="sendNewBio"
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
      bio: "",
      allSet: false,
      iconShow: "send",
      color: "positive",
      labelInput: "Insert your bio",
    };
  },
  methods: {
    sendNewBio() {
      this.allSet = true;
      let newName = this.bio;
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
                  if (allDataVar.users[User].following[followingUser].bio) {
                    databaseRef
                      .child(
                        "users/" + User + "/following/" + followingUser + "/bio"
                      )
                      .set(newName);
                  } else {
                    const newWebsiteRef = firebaseDb
                      .ref(
                        "toneygram/users/" +
                          User +
                          "/following/" +
                          followingUser +
                          "/bio"
                      )
                      .set(newName);
                  }
                }
              }
            }

            // Followers
            if (allDataVar.users[User].followers) {
              for (const followerUser in allDataVar.users[User].followers) {
                if (followerUser === userId) {
                  if (allDataVar.users[User].followers[followerUser].website) {
                    databaseRef
                      .child(
                        "users/" + User + "/followers/" + followerUser + "/bio"
                      )
                      .set(newName);
                  } else {
                    const newWebsiteRef = firebaseDb
                      .ref(
                        "toneygram/users/" +
                          User +
                          "/followers/" +
                          followerUser +
                          "/bio"
                      )
                      .set(newName);
                  }
                }
              }
            }
          }
          // --- Replace in actual users section --- //
          databaseRef
            .child("users/" + userId + "/userInformation/bio")
            .set(newName)
            .then(() => {
              this.bgColor = "green-3";
              this.allSet = false;
              this.bio = "";
              this.iconShow = "done";
              this.labelInput = "Bio done";
              setTimeout(() => {
                this.bgColor = "white";
                this.iconShow = "send";
                this.labelInput = "Insert your bio";
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
