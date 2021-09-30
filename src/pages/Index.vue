<template>
  <div class="flex flex-center">
    <div class="row justify-between full-width bg-dark baseIndex">
      <!-- Chat Box -->
      <div class="col-10">
        <Messages v-if="Object.values(currentChanel).length >= 1" />
        <div v-else>Select a channel :D</div>
      </div>
      <!-- Side Panel -->
      <SidePanel class="col-2 rightBar" />
    </div>
  </div>
</template>

<script>
import Messages from "./../components/Messages/Messages.vue";
import { Loading } from "quasar";

import SidePanel from "./../components/SidePanel/RightPanel.vue";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    Messages,

    SidePanel,
  },
  computed: {
    ...mapState("User", ["currentChanel"]),
  },
};
</script>
<style lang="scss">
.rightBar {
  border-left: 1px grey solid;
}
.baseIndex {
  height: 100vh;
}
</style>
