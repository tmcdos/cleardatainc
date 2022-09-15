<template>
  <v-footer color="black" dark app>
    &copy; 2022 by IVO GELOV &mdash; v{{ $root.appVersion }}
    <v-spacer class="text-center">{{ (GET_USER || {}).fullName }}</v-spacer>
  </v-footer>
</template>

<script>
import { GET_USER } from '../store/names.js';
import { mapGetters } from 'vuex';

export default
{
  name: 'CustomFooter',
  computed:
    {
      ...mapGetters([GET_USER]),
    }
};
</script>
