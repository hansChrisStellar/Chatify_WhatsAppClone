<template>
  <div class="relative-position window-height">
    <div>Vue Slack Clone</div>
    <div>Share, chat and enjoy with your friends!</div>
    <q-card class="" style="min-width: 280px">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="login" label="Log In" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <div class="text-h6">Login</div>
          <q-form @submit="logInAction">
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              type="email"
              lazy-rules
              :rules="[
                (val) => validateEmail(val) || 'Please insert a valid email',
              ]"
              v-model="login.email"
              label="Email"
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-input>
            <q-input
              color="grey-3"
              label-color="orange"
              lazy-rules
              outlined
              type="password"
              :rules="[
                (val) =>
                  val.length >= 6 || 'Please enter more than 6 characters',
              ]"
              v-model="login.password"
              label="Password"
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-input>
            <q-btn label="Log In" type="submit" />
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="register">
          <div class="text-h6">Register</div>
          <q-form @submit="registerAction">
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              lazy-rules
              type="username"
              v-model="register.username"
              :rules="[
                (val) =>
                  val.length >= 3 ||
                  'Your username has to be longer than 3 characters',
              ]"
              label="Username"
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-input>
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              lazy-rules
              v-model="register.email"
              :rules="[
                (val) => validateEmail(val) || 'Please insert a valid email',
              ]"
              label="Email"
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-input>
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              lazy-rules
              type="password"
              v-model="register.password"
              :rules="[
                (val) =>
                  val.length >= 6 || 'Please enter more than 6 characters',
              ]"
              label="Password"
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-input>
            <q-input
              color="grey-3"
              label-color="orange"
              outlined
              lazy-rules
              type="password"
              v-model="register.confirmPassword"
              :rules="[
                (val) =>
                  val.length >= 6 || 'Please enter more than 6 characters',
              ]"
              label="Confirm password"
            >
              <template v-slot:append>
                <q-icon name="event" color="orange" />
              </template>
            </q-input>
            <q-btn label="Register" type="submit" />
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      tab: "login",
      login: {
        email: "",
        password: "",
      },
      register: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    ...mapActions("Auth", ["registerUser", "logInUser"]),
    registerAction() {
      this.registerUser(this.register);
    },
    logInAction() {
      this.logInUser(this.login);
    },
  },
};
</script>
