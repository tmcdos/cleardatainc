<template>
  <v-app-bar color="primary" dark app clipped-left dense>
    <template v-if="GET_TOKEN">
      <v-spacer />
      <v-btn color="amber" light @click="doLogout">Logout</v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { GET_TOKEN, SET_TOKEN } from '@/store/names.js';
import { mapGetters, mapMutations } from 'vuex';

export default
{
  name: 'CustomHeader',
  computed:
    {
      ...mapGetters([GET_TOKEN]),
    },
  methods:
    {
      ...mapMutations([SET_TOKEN]),
      doLogout()
      {
        this[SET_TOKEN]();
        this.$router.push({ name: 'Login' });
      }
    }
};
</script>
