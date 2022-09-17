<template>
  <v-dialog v-model="show" scrollable>
    <v-card>
      <v-card-title class="primary white--text py-1 pl-3 pr-1">
        Integration details
        <v-spacer />
        <v-btn icon color="white" @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-2">
        <h2 align="center" class="py-3">Details: {{ (integration || {}).name }}</h2>
        <v-data-table :items="(integration || {}).sources || []" :headers="tblHeader" item-key="id" class="my_tbl" dense :options="pagination" disable-pagination hide-default-footer disable-sort />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="success" class="px-6" @click="show = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default
{
  name: 'IntegrationDetails',
  props:
    {
      value:
        {
          type: Boolean,
          default: false
        },
      integration:
        {
          type: Object,
          default: () => ({})
        },
    },
  data()
  {
    return {
      pagination:
        {
          page: 1,
          itemsPerPage: -1,
        },
    };
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
      tblHeader()
      {
        return [
          {
            text: 'Source name',
            value: 'name',
            class: 'text-subtitle-1 font-weight-bold',
          },
          {
            text: 'Rows processed',
            value: 'rowsProcessed',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'right',
          },
          {
            text: 'From date',
            value: 'fromDate',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
          },
          {
            text: 'To date',
            value: 'toDate',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
          },
        ];
      },
    },
};
</script>
