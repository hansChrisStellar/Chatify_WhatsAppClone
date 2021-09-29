<template>
  <div>
    <q-form>
      <q-input color="deep-purple-3" v-model="message" autogrow filled>
        <template v-slot:append>
          <q-btn icon="attach_file" dense flat color="deep-purple-9" />
          <q-btn
            icon="send"
            @click="sendMessageForm"
            dense
            flat
            color="deep-purple-9"
          />
        </template>
      </q-input>
    </q-form>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    ...mapActions("User", ["sendMessage"]),
    sendMessageForm() {
      this.sendMessage(this.message);
    },
  },
};
</script>
