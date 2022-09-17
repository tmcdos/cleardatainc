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
        <v-tooltip top>
          <template #activator="{on}">
            <v-btn icon class="mx-1" color="primary" :disabled="item.status === 'Complete'" v-on="on" @click="currentIntegration = item,dlgEdit = true">
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
          </template>
          Edit integration
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{on}">
            <v-btn icon class="mx-1" color="primary" v-on="on" @click="currentIntegration = item,dlgDetails = true">
              <v-icon>mdi-information</v-icon>
            </v-btn>
          </template>
          View details
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{on}">
            <v-btn icon class="mx-1" color="error" v-on="on" @click="currentIntegration = item,dlgDelete = true">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </template>
          Delete integration
        </v-tooltip>
      </template>
    </v-data-table>
    <!-- Dialogs -->
    <NewIntegration v-model="dlgIntegration" @save="fetchData" />
    <IntegrationEdit v-model="dlgEdit" :integration="currentIntegration" @update="doUpdate" />
    <IntegrationDetails v-model="dlgDetails" :integration="currentIntegration" />
    <ConfirmationDialog v-model="dlgDelete" :caption="(currentIntegration || {}).name || 'N/A'" @confirm="doDelete">Do you really want to delete this integration?</ConfirmationDialog>
  </div>
</template>

<script>
import IntegrationDetails from './dialogs/IntegrationDetails.vue';
import ConfirmationDialog from './dialogs/ConfirmationDialog.vue';
import IntegrationEdit from './dialogs/IntegrationEdit.vue';
import NewIntegration from './dialogs/NewIntegration.vue';

export default
{
  name: 'HomePage',
  components:
    {
      IntegrationDetails,
      ConfirmationDialog,
      IntegrationEdit,
      NewIntegration,
    },
  data()
  {
    return {
      dlgIntegration: false,
      dlgDetails: false,
      dlgDelete: false,
      dlgEdit: false,
      currentIntegration: null,
      integrations: [
        {
          id: 1,
          name: 'CDI-0015',
          status: 'In progress',
          numSources: 3,
          date: '2022-05-12 12:02:00',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 2,
          name: 'CDI-0014',
          status: 'Complete',
          numSources: 1,
          date: '2022-05-08 11:34:00',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 3,
          name: 'CDI-0013',
          status: 'Complete',
          numSources: 1,
          date: '2022-04-30 13:52:00',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 4,
          name: 'CDI-0012',
          status: 'Complete',
          numSources: 2,
          date: '2022-04-30 10:30:21',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 5,
          name: 'CDI-0011',
          status: 'Complete',
          numSources: 3,
          date: '2022-04-28 09:12:40',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 6,
          name: 'CDI-0010',
          status: 'Complete',
          numSources: 2,
          date: '2022-04-25 15:48:57',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 7,
          name: 'CDI-0009',
          status: 'Complete',
          numSources: 2,
          date: '2022-04-25 15:48:30',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 8,
          name: 'CDI-0008',
          status: 'Complete',
          numSources: 3,
          date: '2022-04-20 08:30:00',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 9,
          name: 'CDI-0007',
          status: 'Complete',
          numSources: 1,
          date: '2022-04-19 11:26:28',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
        },
        {
          id: 10,
          name: 'CDI-0006',
          status: 'Complete',
          numSources: 1,
          date: '2022-04-17 17:32:47',
          sources: [
            {
              id: 1,
              name: 'CDI-01-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 2,
              name: 'CDI-02-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-03-15',
            },
            {
              id: 3,
              name: 'CDI-03-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-06-01',
              toDate: '2022-06-15',
            },
            {
              id: 4,
              name: 'CDI-04-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-01-01',
              toDate: '2022-01-15',
            },
            {
              id: 5,
              name: 'CDI-05-EmploymentDetails-2022-01-02',
              rowsProcessed: 123,
              fromDate: '2022-02-01',
              toDate: '2022-02-15',
            },
          ],
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
      doDelete()
      {
        const id = this.currentIntegration.id;
        const idx = this.integrations.findIndex(item => item.id === id);
        if (idx !== -1) this.integrations.splice(idx, 1);
      },
      doUpdate(newValue)
      {
        const id = this.currentIntegration.id;
        const idx = this.integrations.findIndex(item => item.id === id);
        if (idx !== -1) this.integrations.splice(idx, 1, newValue);
      },
    }
};
</script>
