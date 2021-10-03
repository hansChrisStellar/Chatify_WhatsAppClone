<template>
  <div class="flex flex-center">
    <div class="row justify-between full-width bg-dark baseIndex">
      <!-- Chat Box -->
      <div class="col-10">
        <div>
          <Messages v-if="Object.values(currentChanel).length >= 1" />
          <MessagesContact v-if="Object.values(currentUserChat).length >= 1" />
        </div>
      </div>
      <!-- Side Panel -->
      <SidePanel class="col-2 rightBar" />
    </div>
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
    SidePanel,
    MessagesContact,
  },
  computed: {
    ...mapState("User", ["currentChanel", "currentUserChat"]),
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
