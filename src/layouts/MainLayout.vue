<template>
  <q-layout view="hHh lpR fFr" style="min-height: 3rem">
    <q-header bordered class="bg-light-blue-4 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-h5">Slack Clone</div>
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>
    <!-- SidePanel -->
    <q-drawer> </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      rightDrawerOpen: true,
    };
  },
};
</script>
