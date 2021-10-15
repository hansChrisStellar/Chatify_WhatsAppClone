<template>
  <q-dialog>
    <q-card class="q-pa-md">
      <q-form>
        <q-input
          class="no-padding"
          :label-color="labelColor"
          :color="colorInput"
          v-model="idContact"
          :label="labelInput"
        />
        <q-card-actions align="right">
          <q-btn
            flat
            round
            color="cyan-9"
            icon="send"
            @click="NewContact"
            :disable="idContact.length <= 0"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import { firebaseAuth, firebaseDb } from "src/boot/firebase";
import { uid, Notify } from "quasar";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      idContact: "",
      colorInput: "cyan-9",
      labelColor: "black",
      labelInput: "Insert ID here",
    };
  },
  methods: {
    ...mapActions("User", ["addContact"]),
    // Add New Contact
    NewContact() {
      const usersRef = firebaseDb.ref("users/");
      // We make a loop of snapshot in order to check if the user we passing exist inside
      usersRef.once("value", (allUsers) => {
        let contacts = allUsers.val();
        if (this.idContact in contacts) {
          let userFound = contacts[this.idContact];
          let userInfoPass = {
            name: userFound.username.nameUser,
            img: userFound.userImg.photoURL,
            idUser: userFound.userId.userId,
          };
          this.addContact(userInfoPass);
          Notify.create({
            message: `${userInfoPass.name} added succesfully`,
            color: "positive",
          });
          this.colorInput = "cyan-9";
          this.labelColor = "black";
          this.labelInput = "Insert ID here";
          this.$emit("closeModal", false);
        } else {
          this.colorInput = "red";
          this.labelColor = "red";
          this.labelInput = "Wrong ID, please check again";
          setTimeout(() => {
            this.colorInput = "cyan-9";
            this.labelColor = "black";
            this.labelInput = "Insert ID here";
          }, 1500);
        }
      });
    },
  },
};
</script>
