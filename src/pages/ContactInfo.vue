<template>
  <div class="baseContactInfo">
    <!-- Header -->
    <div class="headerBase bg-white shadow-4 q-mb-md">
      <!-- left button -->
      <q-btn
        dense
        icon="chevron_left"
        flat
        size="1rem"
        color="cyan-3"
        @click="this.$router.go(-1)"
      />
      <!-- middle -->
      <div
        v-if="currentUserChat.idUser.idUser in contacts"
        class="ellipsis-2-lines"
      >
        {{ currentUserChat.username.userName }}
      </div>
      <!-- right button -->
      <div v-else class="ellipsis-2-lines">
        {{ currentUserChat.idUser.idUser }}
      </div>
      <q-icon name="person" color="cyan-3" size="1.5rem" />
    </div>
    <!-- Img User -->
    <div class="contentBase">
      <img :src="currentUserChat.userImg.photoURL" class="imgBaseUser" />
    </div>
    <!-- User Info -->
    <q-list dense class="rounded-borders text-black">
      <!-- Username -->
      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar>
            <q-icon name="face" color="cyan-9" size="1.5rem" />
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
            <q-icon name="fingerprint" color="cyan-9" size="1.5rem" />
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
        @click="differentWayToAddContact(currentUserChat)"
      >
        <q-item-section avatar top>
          <q-avatar>
            <q-icon name="person_add" color="cyan-9" size="1.5rem" />
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
            <q-icon name="delete" color="red" size="1.5rem" />
          </q-avatar>
        </q-item-section>

        <q-item-section class="text-red">
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
    ...mapActions("User", ["eraseContact", "differentWayToAddContact"]),
  },
};
</script>
<style lang="scss">
.baseContactInfo {
  font-family: "Montserrat";
}
//iPhone
@media (max-width: 480px) {
  .headerBase {
    height: 3rem;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    align-items: center;
  }
  .contentBase {
    width: 100%;
    height: 20rem;
  }
  .imgBaseUser {
    width: 100%;
    height: 100%;
  }
}
//Tablet
@media (min-width: 480px) {
  .headerBase {
    height: 3rem;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    align-items: center;
  }
  .contentBase {
    width: 20rem;
    margin: auto;
    border-radius: 100%;
    height: 20rem;
  }
  .imgBaseUser {
    width: 100%;
    border-radius: 100%;
    height: 100%;
  }
}
//Desktop
@media (min-width: 768px) {
  .headerBase {
    height: 3rem;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    align-items: center;
  }
  .contentBase {
    width: 20rem;
    margin: auto;
    border-radius: 100%;
    height: 20rem;
  }
  .imgBaseUser {
    width: 100%;
    border-radius: 100%;
    height: 100%;
  }
}
</style>
