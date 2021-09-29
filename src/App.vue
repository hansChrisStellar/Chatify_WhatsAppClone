<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
import { Loading } from "quasar";
export default {
  name: "App",
  beforeCreate() {
    Loading.show();
  },
  methods: {
    ...mapActions("Auth", ["handleAuthStateChange"]),
  },
  mounted() {
    this.handleAuthStateChange();
    Loading.hide();
  },
};
</script>
