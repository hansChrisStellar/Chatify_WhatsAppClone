<template>
  <q-dialog>
    <q-card class="my-card">
      <div>Join New Channel</div>
      <q-form @submit="joinChannel">
        <q-input v-model="channelId" label="Channel ID" />
        <q-card-actions align="right">
          <q-btn flat round color="primary" icon="send" @click="joinChannel" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import { uid } from "quasar";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      channelId: "",
    };
  },
  methods: {
    ...mapActions("User", ["joinAnotherChannel"]),
    joinChannel() {
      this.joinAnotherChannel(this.channelId);
    },
  },
};
</script>
