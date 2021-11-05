<template>
  <q-stepper
    v-model="step"
    ref="stepper"
    alternative-labels
    color="info"
    contracted
    animated
  >
    <q-step
      :name="1"
      title="Username & Avatar"
      icon="account_circle"
      :done="step > 1"
      active-icon="account_circle"
      done-icon="account_circle"
      :color="step > 1 ? 'grey' : 'info'"
    >
      <q-form autocomplete="off">
        <!-- full name -->
        <q-input
          color="grey-3"
          label-color="grey-5"
          dense
          autocomplete="off"
          autocapitalize="none"
          lazy-rules
          type="search"
          v-model="method.fullName"
          :rules="[
            (val) => validateName(val) || 'Special characters are not valid',
          ]"
          label="Full name"
        >
        </q-input>
        <!-- password -->
        <q-input
          color="grey-3"
          label-color="grey-5"
          lazy-rules
          dense
          type="password"
          autocomplete="off"
          v-model="method.password"
          :rules="[
            (val) => val.length >= 6 || 'Please enter more than 6 characters',
          ]"
          label="Password"
        >
        </q-input>
        <!-- img user -->
        <div class="avatar-upload">
          <div class="avatar-edit">
            <!-- Upload photo -->
            <input type="file" @change="addFiles($event)" id="imageUpload" />
            <label for="imageUpload"> </label>
          </div>
          <div class="avatar-preview">
            <div id="imagePreview" :style="imageToShow"></div>
          </div>
        </div>
      </q-form>
    </q-step>

    <q-step
      :done="step > 2"
      :name="2"
      active-icon="email"
      done-icon="email"
      :color="step >= 2 ? 'info' : 'grey'"
      title="Email & Password"
      icon="email"
    >
      <q-form autocomplete="off">
        <!-- username -->
        <q-input
          color="grey-3"
          label-color="grey-5"
          dense
          autocomplete="off"
          autocapitalize="none"
          lazy-rules
          type="text"
          v-model="method.username"
          :rules="[
            (val) =>
              validateUsername(val) || 'Special characters are not valid',
          ]"
          label="Username"
        />
        <!-- email -->
        <q-input
          color="grey-3"
          label-color="grey-5"
          lazy-rules
          autocomplete="off"
          dense
          type="email"
          v-model="method.email"
          :rules="[
            (val) => validateEmail(val) || 'Please insert a valid email',
          ]"
          label="Email"
        >
        </q-input>

        <q-btn
          label="Register"
          :color="
            !validateEmail(method.email) || !validateUsername(method.username)
              ? 'light-blue-3'
              : 'light-blue-6'
          "
          :disable="
            !validateEmail(method.email) || !validateUsername(method.username)
          "
          type="submit"
          class="col full-width"
          @click.prevent="registerUser(method)"
        />
      </q-form>
      <q-inner-loading :showing="visible">
        <q-spinner-ios size="50px" color="grey-6" />
      </q-inner-loading>
    </q-step>
    <template v-slot:navigation>
      <q-stepper-navigation>
        <q-btn
          @click="$refs.stepper.next()"
          :color="
            !validateName(method.fullName) || method.password.length < 6
              ? 'light-blue-3'
              : 'light-blue-6'
          "
          v-if="step === 1"
          label="Continue"
          :disable="
            !validateName(method.fullName) || method.password.length < 6
          "
        />
        <q-btn
          v-if="step > 1"
          flat
          color="info"
          @click="$refs.stepper.previous()"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>
<script>
import { firebaseAuth, firebaseDb, firebaseStorage } from "src/boot/firebase";
import { Notify, openURL } from "quasar";
import { mapActions } from "vuex";
export default {
  props: ["showing"],
  data() {
    return {
      step: 1,
      visible: false,
      method: {
        username: "",
        email: "",
        password: "",
        fullName: "",
      },
      newFile: {},
      imageToShow:
        "background-image: url(https://i.ibb.co/X5HrbCj/default.png);",
      imageUploaded: "",
    };
  },
  methods: {
    ...mapActions("settingsUser", ["sendUserInformation"]),
    registerUser(registerData) {
      // Check usernames
      this.visible = true;
      if (
        this.method.username &&
        this.method.email &&
        this.method.password &&
        this.method.fullName
      ) {
        let nameVerify = registerData.username.toLowerCase();
        const checkUsername = firebaseDb.ref("toneygram/names/");
        checkUsername.once("value", (allUsers) => {
          let usersVar = allUsers.val();
          if (nameVerify in usersVar) {
            this.visible = false;
            Notify.create({
              message: "This username is already in use",
              color: "negative",
            });
          } else {
            firebaseAuth
              .createUserWithEmailAndPassword(
                registerData.email,
                registerData.password
              )
              .then((registeredUser) => {
                // Setting the user in the Database
                const actualUserId = firebaseAuth.currentUser.uid;
                const usersRef = firebaseDb.ref(
                  "toneygram/users/" + actualUserId + "/userInformation"
                );
                const namesRef = firebaseDb.ref(
                  "toneygram/names/" + registerData.username
                );
                const imagesStorageRef = firebaseStorage
                  .ref(firebaseAuth.currentUser.uid + "/userImg")
                  .put(this.newFile)
                  .then(() => {
                    firebaseStorage
                      .ref(firebaseAuth.currentUser.uid + "/userImg")
                      .getDownloadURL()
                      .then((url) => {
                        this.imageUploaded = url;
                      })
                      .then(() => {
                        registeredUser.user
                          .updateProfile({
                            displayName: registerData.username.toLowerCase(),
                            photoURL: this.imageUploaded,
                          })
                          .then(() => {
                            usersRef.set({
                              img: registeredUser.user.photoURL,
                              name: registeredUser.user.displayName.toLowerCase(),
                              id: registeredUser.user.uid,
                              fullname: registerData.fullName,
                            });
                            namesRef.set(registerData.username);
                          })
                          .then(() => {
                            this.$router
                              .push({
                                name: "Main",
                                params: {
                                  userId: registeredUser.user.uid,
                                },
                              })
                              .then(() => {
                                Notify.create({
                                  avatar: firebaseAuth.currentUser.photoURL,
                                  message: `Welcome, ${firebaseAuth.currentUser.displayName}`,
                                  color: "positive",
                                });
                                this.visible = false;
                              });
                          });
                      });
                  });
              })
              .catch((error) => {
                this.visible = false;
                Notify.create({
                  message: error.message,
                  color: "negative",
                });
              });
          }
        });
      } else {
        Notify.create({
          message: "Please, fill all the inputs",
          color: "purple-5",
        });
        this.visible = false;
      }
    },
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validateName(name) {
      const re = /^[a-z A-Z 0-9]+$/;
      return re.test(String(name));
    },
    validateUsername(name) {
      const re = /^[a-zA-Z0-9]+$/;
      return re.test(String(name));
    },
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
      }
    },
  },
};
</script>
<style lang="scss">
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
