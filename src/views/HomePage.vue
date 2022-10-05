<template>
  <div>
    <div class="d-flex justify-center">
      <v-btn color="accent" @click="dlgIntegration = true">Add integration</v-btn>
    </div>
    <div class="pb-3">
      <strong>Integrations</strong>
      <template v-if="!showAll"><span class="px-2">(last 10)</span> <a href="javascript:" @click="showAll = true">see all</a></template>
    </div>
    <!-- <v-data-table :items="integrations" :headers="tblHeader" item-key="id" class="my_tbl" dense :server-items-length="total" :options.sync="pagination" :footer-props="footerOptions" @pagination="fetchData"> -->
    <v-data-table :items="integrations" :headers="tblHeader" item-key="integration_ID" class="my_tbl" dense :options.sync="pagination" hide-default-footer>
      <template #header.action>
        <v-icon>mdi-cog</v-icon>
      </template>
      <template #item.action="{item}">
        <v-tooltip top>
          <template #activator="{on}">
            <v-btn icon class="mx-1" color="primary" :disabled="item.integration_Status_ID > 1" v-on="on" @click="currentIntegration = item,dlgEdit = true">
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
      integrations: [],
      showAll: true,
      //total: 10,
      pagination:
        {
          page: 1,
          itemsPerPage: -1,
        },
      /*footerOptions:
        {
          itemsPerPageOptions: [-1, 25, 50, 100],
        }*/
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
            value: 'integration_Status_ID',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
          },
          {
            text: '# of sources',
            value: 'fileToUpload',
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
        this.$axios.get('/Integrations').then(response =>
        {
          if (response)
          {
            this.integrations = response.map(item =>
            {
              item.date = new Date(item.last_Modified_Date_Time || item.created_Date_Time).toLocaleString(undefined,
                {
                  year: 'numeric',
                  day: 'numeric',
                  month: 'short',
                  hour: 'numeric',
                  minute: 'numeric',
                });
              return item;
            });
          }
        });
      },
      doDelete()
      {
        const id = this.currentIntegration.integration_ID;
        this.$axios.delete('/Integrations/' + id).then(response =>
        {
          if (response)
          {
            const idx = this.integrations.findIndex(item => item.integration_ID === id);
            if (idx !== -1) this.integrations.splice(idx, 1);
          }
        });
      },
      doUpdate(newValue)
      {
        const id = this.currentIntegration.integration_ID;
        const idx = this.integrations.findIndex(item => item.integration_ID === id);
        if (idx !== -1) this.integrations.splice(idx, 1, newValue);
      },
    }
};
</script>
