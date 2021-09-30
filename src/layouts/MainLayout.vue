<template>
  <q-layout view="hHh LpR fFf" style="min-height: 4rem">
    <q-header elevated class="bg-deep-purple-8 text-white">
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
    <q-drawer
      v-model="rightDrawerOpen"
      class="bg-deep-purple-4"
      side="right"
      overlay
      elevated
    >
      <RightPanel />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import RightPanel from "../components/SidePanel/RightPanel.vue";
export default {
  name: "MainLayout",
  components: {
    RightPanel,
  },
  data() {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
    };
  },
};
</script>
