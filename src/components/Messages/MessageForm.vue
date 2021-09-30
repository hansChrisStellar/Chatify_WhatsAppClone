<template>
  <div>
    <q-form class="bg-grey-10 baseForm items-center q-px-md">
      <q-input
        type="text"
        class="inputFormBase"
        v-model="message"
        dense
        dark
        label="Type a message"
        maxlength="300"
        autocomplete="off"
        @keyup.enter="sendMessageForm"
      >
      </q-input>
      <q-btn icon="attach_file" dense flat color="grey" />
      <q-btn icon="send" @click="sendMessageForm" dense flat color="grey" />
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
      this.message = "";
    },
  },
};
</script>
<style lang="scss">
.baseForm {
  height: 4rem;
  width: 100%;
  display: flex;
}
.inputFormBase {
  width: 95%;
}
</style>
