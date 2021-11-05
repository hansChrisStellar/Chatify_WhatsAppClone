<template>
  <div class="flex column authBase q-py-xl">
    <div class="text-h3 text-center q-mb-md text-weight-light">toneygram</div>
    <!-- Form Base -->
    <div class="formBaseAuth q-mb-sm bg-grey-2">
      <!-- Tabs -->
      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
        dense
        class="q-mb-md"
      >
        <q-tab class="text-grey-5" name="login" label="Log in" />
        <q-tab class="text-grey-5" name="register" label="Register" />
      </q-tabs>
      <!-- Tab -->
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="fade"
        transition-next="fade"
        class="text-white text-center bg-grey-2"
      >
        <!-- Login -->
        <q-tab-panel name="login" class="q-py-none q-pb-md">
          <q-form style="overflow: hidden">
            <q-input
              color="grey-3"
              label-color="grey-5"
              type="email"
              lazy-rules
              dense
              :rules="[
                (val) => validateEmail(val) || 'Please insert a valid email',
              ]"
              v-model="login.email"
              label="Email"
            >
            </q-input>
            <q-input
              label-color="grey-5"
              lazy-rules
              dense
              type="password"
              :rules="[
                (val) =>
                  val.length >= 6 || 'Please enter more than 6 characters',
              ]"
              v-model="login.password"
              label="Password"
            >
            </q-input>
            <q-btn
              label="Log In"
              type="submit"
              :color="
                !validateEmail(login.email) || login.password.length <= 5
                  ? 'light-blue-3'
                  : 'light-blue-6'
              "
              class="full-width"
              text-color="white"
              @keyup.enter.prevent="logInUser"
              @click="logInUser"
              ref="logInButton"
              :disable="
                !validateEmail(login.email) || login.password.length <= 5
              "
            />
          </q-form>
        </q-tab-panel>
        <!-- Register -->
        <q-tab-panel name="register" class="q-py-none q-pb-md">
          <RegisterSteps :showing="visible" />
        </q-tab-panel>
      </q-tab-panels>
      <!-- OR -->
      <div
        class="row text-center items-center justify-between"
        style="max-width: 240px; margin: auto"
      >
        <q-separator size="1px" style="width: 35%" color="grey-5" />
        <div class="text-weight-regular text-grey-6" style="width: 10%">OR</div>
        <q-separator size="1px" style="width: 35%" color="grey-5" />
      </div>
      <!-- Log in with Google -->
      <div class="q-pa-md">
        <q-btn
          label="Use your Google Account"
          color="light-blue-6"
          type="submit"
          class="col full-width"
        />
      </div>
      <q-inner-loading :showing="visible">
        <q-spinner-ios size="50px" color="grey-6" />
      </q-inner-loading>
    </div>
    <!-- Footer -->
    <q-separator
      color="grey-5"
      size="1px"
      style="min-width: 245px"
      class="q-mb-md"
    ></q-separator>
    <div class="text-body1 text-grey-5">© 2021 Toneygram</div>
  </div>
</template>

<script>
import RegisterSteps from "./../components/Register.vue";
import { Notify } from "quasar";
import { firebaseAuth, firebaseDb } from "src/boot/firebase";
import { mapActions } from "vuex";
export default {
  components: {
    RegisterSteps,
  },
  data() {
    return {
      visible: false,
      tab: "login",
      login: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("settingsUser", ["sendUserInformation"]),
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    logInUser() {
      this.visible = true;
      firebaseAuth
        .signInWithEmailAndPassword(this.login.email, this.login.password)
        .then((userCredentials) => {
          const userInformation = firebaseDb.ref(
            "toneygram/users/" + userCredentials.user.uid
          );
          userInformation.once("value", (allData) => {
            this.$router
              .push({ name: "Main" })
              .then(() => {
                Notify.create({
                  avatar: userCredentials.user.photoURL,
                  message: `Welcome, ${userCredentials.user.displayName}`,
                  color: "positive",
                });
                this.visible = false;
              })
              .catch((error) => {
                this.visible = false;
                Notify.create({
                  message: error.message,
                  color: "Negative",
                });
              });
          });
        });
    },
  },
};
</script>
<style lang="scss">
//iPhone
@media (max-width: 480px) {
  .authBase {
    align-items: center;
  }
  .imgLogoBase {
    width: 10rem;
    height: 10rem;
  }
  .imgLogoIcon {
    width: 100%;
    height: 100%;
  }
  .formBaseAuth {
    min-width: 280px;
  }
}

//Tablet
@media (min-width: 480px) {
  .authBase {
    align-items: center;
  }
  .imgLogoBase {
    width: 10rem;
    height: 10rem;
  }
  .imgLogoIcon {
    width: 100%;
    height: 100%;
  }
  .formBaseAuth {
    min-width: 280px;
  }
}

//Desktop
@media (min-width: 768px) {
  .authBase {
    align-items: center;
    max-width: 480px;
    margin: auto;
  }
  .imgLogoBase {
    width: 10rem;
    height: 10rem;
  }
  .imgLogoIcon {
    width: 100%;
    height: 100%;
  }
  .formBaseAuth {
    width: 100%;
  }
}
</style>
