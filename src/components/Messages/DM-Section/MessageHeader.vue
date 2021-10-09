<template>
  <div>
    <div
      class="
        bg-grey-10
        row
        justify-between
        items-center
        q-pa-sm
        text-h5 text-weight-light text-white
      "
    >
      <!-- Title Channel -->
      <div class="items-center row">
        <q-avatar size="28px">
          <img :src="currentUserChat.img" :alt="currentUserChat.name" />
          {{ currentUserChat.name }}
        </q-avatar>
        <div class="items-center q-pl-sm">
          {{ currentUserChat.name }}
        </div>
      </div>

      <!-- Input search -->
      <q-btn-dropdown
        class=""
        color="grey"
        dense
        flat
        size="15px"
        dropdown-icon="search"
        no-icon-animation
      >
        <q-list>
          <q-input
            label="Search Messages"
            dense
            label-color="white"
            outlined
            bg-color="grey-8"
            dark
          />
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("User", ["currentUserChat"]),
  },
};
</script>
<style lang="scss"></style>
