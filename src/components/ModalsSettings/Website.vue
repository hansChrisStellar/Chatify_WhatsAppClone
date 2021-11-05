<template>
  <q-dialog class="dialogs">
    <q-banner class="bg-grey-3">
      <q-input
        v-model="website"
        type="url"
        dense
        outlined
        :bg-color="bgColor"
        :label="labelInput"
        :color="website.length > 3 ? this.color : 'grey'"
      />
      <template v-slot:action>
        <q-btn
          flat
          :disable="website.length <= 3"
          :color="website.length > 3 ? this.color : 'grey'"
          :icon="this.iconShow"
          dense
          @click="sendNewWebsite"
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
      website: "",
      allSet: false,
      iconShow: "send",
      color: "positive",
      labelInput: "Insert your website",
    };
  },
  methods: {
    sendNewWebsite() {
      this.allSet = true;
      let newName = this.website;
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
                  if (allDataVar.users[User].following[followingUser].website) {
                    databaseRef
                      .child(
                        "users/" +
                          User +
                          "/following/" +
                          followingUser +
                          "/website"
                      )
                      .set(newName);
                  } else {
                    const newWebsiteRef = firebaseDb
                      .ref(
                        "toneygram/users/" +
                          User +
                          "/following/" +
                          followingUser +
                          "/website"
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
                        "users/" +
                          User +
                          "/followers/" +
                          followerUser +
                          "/website"
                      )
                      .set(newName);
                  } else {
                    const newWebsiteRef = firebaseDb
                      .ref(
                        "toneygram/users/" +
                          User +
                          "/followers/" +
                          followerUser +
                          "/website"
                      )
                      .set(newName);
                  }
                }
              }
            }
          }
          // --- Replace in actual users section --- //
          databaseRef
            .child("users/" + userId + "/userInformation/website")
            .set(newName)
            .then(() => {
              this.bgColor = "green-3";
              this.allSet = false;
              this.website = "";
              this.iconShow = "done";
              this.labelInput = "Website done";
              setTimeout(() => {
                this.bgColor = "white";
                this.iconShow = "send";
                this.labelInput = "Insert your website";
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
