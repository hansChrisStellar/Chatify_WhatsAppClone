<template>
  <div>
    <MessageHeader />
    <div class="bg-grey-3 q-my-sm" style="min-height: 20rem; width: 100%">
      <q-chat-message
        v-for="(messageSection, index) in getMessages"
        :key="index"
        :name="messageSection.user.name"
        :avatar="messageSection.user.avatar"
        :text="[messageSection.content]"
        :stamp="messageSection.anotherTimeFormat"
        bg-color="amber-7"
        ref="checkMessage"
        :sent="messageSection.user.id === getCurrentUser.uid"
      />
    </div>
    <MessageForm />
  </div>
</template>
<script>
import MessageForm from "./MessageForm.vue";
import MessageHeader from "./MessageHeader.vue";
import { mapGetters, mapActions, mapState } from "vuex";
import { firebaseAuth } from "src/boot/firebase";
export default {
  data() {
    return {
      checkOn: true,
    };
  },
  components: {
    MessageHeader,
    MessageForm,
  },
  computed: {
    ...mapGetters("User", ["getMessages"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
  },
  methods: {},
};
</script>
