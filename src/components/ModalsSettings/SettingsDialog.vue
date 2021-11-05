<template>
  <q-dialog class="dialogs">
    <q-list dense bordered padding class="rounded-borders bg-white text-center">
      <q-item clickable v-ripple @click="goToOption('username')">
        <q-item-section> Change Username </q-item-section>
      </q-item>
      <q-separator color="grey-3" size="1px" />
      <q-item clickable v-ripple @click="goToOption('fullname')">
        <q-item-section> Change Full Name </q-item-section>
      </q-item>
      <q-separator color="grey-3" size="1px" />
      <q-item clickable v-ripple @click="goToOption('website')">
        <q-item-section> Change Website </q-item-section>
      </q-item>
      <q-separator color="grey-3" size="1px" />
      <q-item clickable v-ripple @click="goToOption('bio')">
        <q-item-section> Change Bio </q-item-section>
      </q-item>
      <q-separator color="grey-3" size="1px" />
      <q-item clickable v-ripple @click="goToOption('picture')">
        <q-item-section> Change User Picture </q-item-section>
      </q-item>
    </q-list>
  </q-dialog>
</template>
<script>
export default {
  methods: {
    goToOption(option) {
      this.$emit("modalChange", option);
    },
  },
};
</script>
<style lang="scss">
.dialogs {
  font-family: "Raleway";
}
</style>
