<template>
  <div class="indexBase">
    <!-- Chat Box -->
    <Messages v-if="Object.values(currentChanel).length >= 1" />
    <MessagesContact v-if="Object.values(currentUserChat).length >= 1" />
  </div>
</template>

<script>
import Messages from "./../components/Messages/Channels-Section/Messages.vue";
import { Loading } from "quasar";
import MessagesContact from "./../components/Messages/DM-Section/MessagesContact.vue";
import SidePanel from "./../components/SidePanel/RightPanel.vue";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    Messages,

    MessagesContact,
  },
  computed: {
    ...mapState("User", ["currentChanel", "currentUserChat"]),
  },
};
</script>
<style lang="scss">
// iPhone
@media (max-width: 480px) {
  .indexBase {
    height: auto;
  }
}
// Tablet
@media (min-width: 480px) {
  .indexBase {
    height: auto;
  }
}
// Desktop
@media (min-width: 768px) {
  .indexBase {
    height: auto;
  }
}
</style>
