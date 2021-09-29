<template>
  <q-layout view="hHh LpR fFf" style="min-height: 4rem">
    <q-header elevated class="bg-deep-purple-8 text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

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
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      class="bg-deep-purple-8"
      overlay
      elevated
    >
      <SidePanel />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SidePanel from "./../components/SidePanel/SidePanel.vue";
export default {
  name: "MainLayout",
  components: {
    SidePanel,
  },
  data() {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
    };
  },
};
</script>
