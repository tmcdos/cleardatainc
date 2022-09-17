<template>
  <v-dialog v-model="show">
    <v-card>
      <v-card-title class="primary white--text py-1 pl-3 pr-1">
        Confirmation
        <v-spacer />
        <v-btn icon color="white" @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-2">
        <h2 align="center" class="py-3">{{ caption }}</h2>
        <slot />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="success" min-width="100px" class="mr-2" @click="show = false,$emit('confirm')">OK</v-btn>
        <v-btn color="error" min-width="100px" class="ml-2" @click="show = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default
{
  name: 'ConfirmationDialog',
  props:
    {
      value:
        {
          type: Boolean,
          default: false
        },
      caption:
        {
          type: String,
          required: true
        },
    },
  computed:
    {
      show:
        {
          get()
          {
            return this.value;
          },
          set(val)
          {
            this.$emit('input', val);
          }
        },
    }
};
</script>
