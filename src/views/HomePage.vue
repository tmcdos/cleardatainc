<template>
  <div>
    <div class="d-flex justify-center">
      <v-btn color="accent" @click="dlgIntegration = true">Add integration</v-btn>
    </div>
    <div class="pb-3">
      <strong>Integrations</strong>
      <template v-if="!showAll"><span class="px-2">(last 10)</span> <a href="javascript:" @click="showAll = true">see all</a></template>
    </div>
    <v-data-table :items="integrations" :headers="tblHeader" item-key="id" class="my_tbl" dense :server-items-length="total" :options.sync="pagination" :footer-props="footerOptions" @pagination="fetchData">
      <template #header.action>
        <v-icon>mdi-cog</v-icon>
      </template>
      <template #item.action="{item}">
        <v-btn icon class="mx-1" color="primary" :disabled="item.status === 'Complete'">
          <v-icon>mdi-square-edit-outline</v-icon>
        </v-btn>
        <v-btn icon class="mx-1" color="primary">
          <v-icon>mdi-information</v-icon>
        </v-btn>
        <v-btn icon class="mx-1" color="error">
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default
{
  name: 'HomePage',
  data()
  {
    return {
      dlgIntegration: false,
      integrations: [
        {
          id: 1,
          name: 'CDI-0015',
          status: 'In progress',
          numSources: 3,
          date: '2022-05-12 12:02:00',
        },
        {
          id: 2,
          name: 'CDI-0014',
          status: 'Complete',
          numSources: 1,
          date: '2022-05-08 11:34:00',
        },
        {
          id: 3,
          name: 'CDI-0013',
          status: 'Complete',
          numSources: 1,
          date: '2022-04-30 13:52:00',
        },
        {
          id: 4,
          name: 'CDI-0012',
          status: 'Complete',
          numSources: 2,
          date: '2022-04-30 10:30:21',
        },
        {
          id: 5,
          name: 'CDI-0011',
          status: 'Complete',
          numSources: 3,
          date: '2022-04-28 09:12:40',
        },
        {
          id: 6,
          name: 'CDI-0010',
          status: 'Complete',
          numSources: 2,
          date: '2022-04-25 15:48:57',
        },
        {
          id: 7,
          name: 'CDI-0009',
          status: 'Complete',
          numSources: 2,
          date: '2022-04-25 15:48:30',
        },
        {
          id: 8,
          name: 'CDI-0008',
          status: 'Complete',
          numSources: 3,
          date: '2022-04-20 08:30:00',
        },
        {
          id: 9,
          name: 'CDI-0007',
          status: 'Complete',
          numSources: 1,
          date: '2022-04-19 11:26:28',
        },
        {
          id: 10,
          name: 'CDI-0006',
          status: 'Complete',
          numSources: 1,
          date: '2022-04-17 17:32:47',
        },
      ],
      showAll: false,
      total: 10,
      pagination:
        {
          page: 1,
          itemsPerPage: 25,
        },
      footerOptions:
        {
          itemsPerPageOptions: [25, 50, 100],
        }
    };
  },
  computed:
    {
      tblHeader()
      {
        return [
          {
            text: 'Integration name',
            value: 'name',
            class: 'text-subtitle-1 font-weight-bold',
          },
          {
            text: 'Integration status',
            value: 'status',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
          },
          {
            text: '# of sources',
            value: 'numSources',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
          },
          {
            text: 'Integration date',
            value: 'date',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
            sortable: false,
          },
          {
            text: '',
            value: 'action',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
            sortable: false,
          },
        ];
      },
    },
  created()
  {
    this.fetchData();
  },
  methods:
    {
      fetchData(options)
      {
        //
      },
    }
};
</script>
