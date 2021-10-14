<template>
  <div>
    <!-- Header -->
    <div class="headerBase">
      <q-btn
        dense
        icon="chevron_left"
        flat
        size="12px"
        color="blue"
        @click="this.$router.go(-1)"
      />
      <div
        v-if="currentUserChat.idUser.idUser in contacts"
        class="ellipsis-2-lines"
      >
        {{ currentUserChat.username.userName }}
      </div>
      <div v-else class="ellipsis-2-lines">
        {{ currentUserChat.idUser.idUser }}
      </div>
      <q-icon name="person" color="primary" size="20px" />
    </div>
    <!-- Img User -->
    <div class="contentBase">
      <img :src="currentUserChat.userImg.photoURL" class="imgBaseUser" />
    </div>
    <!-- User Info -->
    <q-list dense class="rounded-borders text-white">
      <!-- Username -->
      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar>
            <q-icon name="face" color="cyan-3" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-section>{{
            currentUserChat.username.userName
          }}</q-item-section>
        </q-item-section>
      </q-item>

      <!-- Id User -->
      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar>
            <q-icon name="fingerprint" color="cyan-3" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-section>{{ currentUserChat.idUser.idUser }}</q-item-section>
        </q-item-section>
      </q-item>

      <!-- Add Contact -->
      <q-item
        clickable
        v-if="!(currentUserChat.idUser.idUser in contacts)"
        v-ripple
        @click="addNewContact(currentUserChat.idUser.idUser)"
      >
        <q-item-section avatar top>
          <q-avatar>
            <q-icon name="person_add" color="cyan-3" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-section>Add Contact</q-item-section>
        </q-item-section>
      </q-item>

      <!-- Erase Contact -->
      <q-item
        clickable
        v-else
        v-ripple
        @click="eraseContact(currentUserChat.idUser.idUser)"
      >
        <q-item-section avatar top>
          <q-avatar>
            <q-icon name="delete" color="cyan-3" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-section>Erase Contact</q-item-section>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapState("User", ["currentUserChat", "contacts"]),
    ...mapGetters("User", ["getContacts"]),
  },
  methods: {
    ...mapActions("User", ["addNewContact", "eraseContact"]),
  },
};
</script>
<style lang="scss">
//iPhone
@media (max-width: 480px) {
  .headerBase {
    height: 3rem;
    background: black;
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    align-items: center;
    border-bottom: 2px solid grey;
  }
  .contentBase {
    width: 100%;
    height: 20rem;
    border-bottom: 2px solid grey;
  }
  .imgBaseUser {
    width: 100%;
    height: 100%;
  }
}
//Tablet
@media (min-width: 480px) {
}
//Desktop
@media (min-width: 768px) {
}
</style>
