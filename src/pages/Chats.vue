<template>
  <div>
    <q-list class="bg-grey-10 text-white">
      <q-item
        dark
        v-for="(chat, key) in getChatList"
        :key="key"
        clickable
        v-ripple
        @click="selectUserChat(chat)"
        class="q-py-md"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="chat.img" />
          </q-avatar>
        </q-item-section>
        <q-item-section v-if="key in getContacts">{{
          chat.name
        }}</q-item-section>
        <q-item-section v-else>{{ key }}</q-item-section>
        <q-item-section avatar>
          <q-icon name="circle" color="red" />
        </q-item-section>
      </q-item>
      <q-separator color="grey-9" size="1px" />
    </q-list>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  methods: {
    ...mapActions("User", ["selectUserChatVuex"]),
    addNewContact() {
      this.showModalNewContact = true;
    },
    selectUserChat(contact) {
      this.selectUserChatVuex(contact);
      this.$router.push("/chatPrivate");
    },
  },
  computed: {
    ...mapGetters("User", ["getContacts", "getChatList"]),
    ...mapGetters("Auth", ["getCurrentUser"]),
  },
  data() {
    return {
      showModalNewContact: false,
    };
  },
};
</script>
