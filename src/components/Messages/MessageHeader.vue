<template>
  <div>
    <div class="row">
      <div class="row items-center">
        <div class="text-h5 text-weight-light">Channel</div>
        <q-btn icon="star_outline" color="deep-purple-3" dense flat />
        <q-btn icon="star" color="deep-purple-3" dense flat />
      </div>
      <q-input label="Search Messages" color="deep-purple-3" dense outlined>
        <template v-slot:append>
          <q-icon name="search" color="deep-purple-3" />
        </template>
      </q-input>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
