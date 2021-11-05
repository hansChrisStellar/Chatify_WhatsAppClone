<template>
  <q-dialog class="dialogs">
    <div class="avatar-upload bg-grey q-pa-sm items-center text-center">
      <div class="avatar-edit">
        <!-- Upload photo -->
        <input type="file" @change="addFiles($event)" id="imageUpload" />
        <label for="imageUpload"> </label>
      </div>
      <div class="avatar-preview">
        <div id="imagePreview" :style="imageToShow"></div>
      </div>
      <q-btn
        @click="sendNewpicture"
        :label="labelInput"
        :disable="!fileIn"
        :color="fileIn ? color : 'green-2'"
        class="items-center self-center q-my-md"
        :loading="allSet"
        :icon="iconShow"
      />
    </div>
  </q-dialog>
</template>
<script>
import { firebaseAuth, firebaseDb, firebaseStorage } from "src/boot/firebase";
export default {
  data() {
    return {
      bgColor: "white",
      picture: "",
      newFile: {},
      fileIn: false,
      allSet: false,
      iconShow: "",
      color: "positive",
      labelInput: "Upload Picture",
      imageUploaded: "",
      imageToShow:
        "background-image: url(https://i.ibb.co/X5HrbCj/default.png);",
    };
  },
  methods: {
    addFiles(file) {
      let pictureUser = file.target.files[0];
      this.newFile = pictureUser;
      if (
        pictureUser.type !== "image/png" &&
        pictureUser.type !== "image/jpeg" &&
        pictureUser.type !== "image/jpg"
      ) {
        Notify.create({
          message: "This uploader only accepts png, jpeg and jpg",
          color: "negative",
          icon: "error",
        });
      } else {
        let newFile = URL.createObjectURL(pictureUser);
        this.imageToShow = `background-image: url(${newFile})`;
        this.fileIn = true;
      }
    },
    sendNewpicture() {
      this.allSet = true;
      let databaseRef = firebaseDb.ref("toneygram");
      databaseRef
        .once("value", (allData) => {})
        .then((allData) => {
          let allDataVar = allData.val();

          let userId = firebaseAuth.currentUser.uid;
          // --- Photo --- //
          const imagesStorageRef = firebaseStorage
            .ref(userId + "/userImg")
            .put(this.newFile)
            .then(() => {
              firebaseStorage
                .ref(userId + "/userImg")
                .getDownloadURL()
                .then((url) => {
                  this.imageUploaded = url;
                })
                .then(() => {
                  firebaseAuth.currentUser
                    .updateProfile({
                      photoURL: this.imageUploaded,
                    })
                    .then(() => {
                      // --- Replace in posts section --- //
                      Object.values(allDataVar.posts[userId]).forEach(
                        (Post) => {
                          databaseRef
                            .child(
                              "posts/" +
                                userId +
                                "/" +
                                Post.idPost +
                                "/userInfo/userImg"
                            )
                            .set(this.imageUploaded);
                        }
                      );
                      // --- Replace in other users section --- //
                      for (const User in allDataVar.users) {
                        // Following
                        if (allDataVar.users[User].following) {
                          for (const followingUser in allDataVar.users[User]
                            .following) {
                            if (followingUser === userId) {
                              databaseRef
                                .child(
                                  "users/" +
                                    User +
                                    "/following/" +
                                    followingUser +
                                    "/img"
                                )
                                .set(this.imageUploaded);
                            }
                          }
                        }
                        // Followers
                        if (allDataVar.users[User].followers) {
                          for (const followerUser in allDataVar.users[User]
                            .followers) {
                            if (followerUser === userId) {
                              databaseRef
                                .child(
                                  "users/" +
                                    User +
                                    "/followers/" +
                                    followerUser +
                                    "/img"
                                )
                                .set(this.imageUploaded);
                            }
                          }
                        }
                        // --- Replace in actual users posts --- //
                        for (const Post in allDataVar.users[userId].posts) {
                          databaseRef
                            .child(
                              "users/" +
                                userId +
                                "/posts/" +
                                Post +
                                "/userInfo/userImg"
                            )
                            .set(this.imageUploaded);
                        }
                        // --- Replace in actual users section --- //
                        databaseRef
                          .child("users/" + userId + "/userInformation/img")
                          .set(this.imageUploaded);
                      }
                    })
                    .then(() => {
                      this.allSet = false;
                      this.iconShow = "done";
                      this.labelInput = "";
                      setTimeout(() => {
                        this.iconShow = "";
                        this.labelInput = "Upload Picture";
                      }, 2500);
                    })
                    .catch(() => {
                      this.iconShow = "error_outline";
                      this.color = "negative";
                      this.labelInput = "";
                      setTimeout(() => {
                        this.iconShow = "";
                        this.labelInput = "Upload Picture";
                        this.color = "positive";
                      }, 2500);
                    });
                });
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
.avatar-upload {
  position: relative;
  max-width: 205px;
  margin: auto;
  .avatar-edit {
    position: absolute;
    right: 12px;
    z-index: 1;
    top: 10px;
    input {
      display: none;
      + label {
        display: inline-block;
        width: 34px;
        height: 34px;
        margin-bottom: 0;
        border-radius: 100%;
        background: #ffffff;
        border: 1px solid transparent;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-weight: normal;
        transition: all 0.2s ease-in-out;
        &:hover {
          background: #f1f1f1;
          border-color: #d6d6d6;
        }
        &:after {
          content: "\e853";
          color: #757575;
          position: absolute;
          top: 10px;
          left: 0;
          right: 0;
          text-align: center;
          margin: auto;
        }
      }
    }
  }
  .avatar-preview {
    width: 192px;
    height: 192px;
    position: relative;
    border-radius: 100%;
    border: 6px solid #f8f8f8;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    > div {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
