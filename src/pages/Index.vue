<template>
  <div class="flex flex-center column">
    <NavBar />
    <Messages /> <MetaPanel />
  </div>
</template>

<script>
import Messages from "./../components/Messages/Messages.vue";
import MetaPanel from "./../components/MetaPanel/MetaPanel.vue";
import { Loading } from "quasar";
import NavBar from "layouts/MainLayout.vue";
export default {
  name: "Home",
  components: {
    Messages,
    MetaPanel,
    NavBar,
  },
};
</script>
