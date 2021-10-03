<template>
  <q-dialog>
    <q-card class="my-card">
      <div>Add New Contact</div>
      <q-form @submit.prevent="addContact">
        <q-input v-model="idContact" label="ID Contact" />
        <q-card-actions align="right">
          <q-btn flat round color="primary" icon="send" @click="addContact" />
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
      idContact: "",
    };
  },
  methods: {
    ...mapActions("User", ["addNewContact"]),
    addContact() {
      this.addNewContact(this.idContact);
    },
  },
};
</script>
