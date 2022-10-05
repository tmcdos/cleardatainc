<template>
  <v-dialog v-model="dlgTrace" style="z-index: 380;">
    <v-card width="80vw" height="80vh" class="d-flex flex-column">
      <v-card-title class="primary white--text pa-2">
        Server error
        <v-spacer />
        <v-btn dark icon @click="dlgTrace = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="d-flex flex-grow-1 pt-3 pb-1">
        <iframe ref="frame" class="flex-grow-1" style="border: none;" />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="dlgTrace = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import events, { BACKEND_ERROR } from '@/events';

export default
{
  name: 'LaravelTrace',
  data()
  {
    return {
      dlgTrace: false,
    };
  },
  created()
  {
    events.$on(BACKEND_ERROR, this.showTrace);
  },
  beforeDestroy()
  {
    events.$off(BACKEND_ERROR, this.showTrace);
  },
  methods:
    {
      showTrace(trace)
      {
        this.dlgTrace = true;
        this.$nextTick(() =>
        {
          this.$refs.frame.srcdoc = trace;
        });
      }
    }
};
</script>
