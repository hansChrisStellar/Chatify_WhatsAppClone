<template>
  <div>
    <div class="headerBase">
      <q-btn
        dense
        icon="chevron_left"
        flat
        size="12px"
        color="blue"
        @click="this.$router.go(-1)"
      />
      <div>
        {{ currentUserChat.name }}
      </div>

      <q-btn class="" icon="delete" dense flat color="blue" size="12px" />
    </div>
    <div class="contentBase">
      <img :src="currentUserChat.img" class="imgBaseUser" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapState("User", ["currentUserChat"]),
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
