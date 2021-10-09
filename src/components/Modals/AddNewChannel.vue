<template>
  <q-dialog>
    <q-card class="my-card">
      <div>Add new channel</div>
      <q-form @keyup.enter.prevent="addChannel">
        <q-input v-model="infoChanel.name" label="Name of the channel" />
        <q-input label="About the channel" v-model="infoChanel.description" />
        <q-card-actions align="right">
          <q-btn flat round color="primary" icon="send" @click="addChannel" />
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
      infoChanel: {
        name: "",
        description: "",
      },
    };
  },
  methods: {
    ...mapActions("User", ["addNewChanel"]),
    addChannel() {
      this.addNewChanel(this.infoChanel);
      this.showModalNewChannel = false;
    },
  },
};
</script>
