<template>
  <v-dialog v-model="show" scrollable>
    <v-form ref="frm">
      <v-card>
        <v-card-title class="primary white--text py-1 pl-3 pr-1">
          Edit integration
          <v-spacer />
          <v-btn icon color="white" @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-2 px-4">
          <h2 align="center" class="py-3">Edit: {{ (integration || {}).name }}</h2>
          <v-data-table :items="temp.sources || []" :headers="tblHeader" item-key="id" class="my_tbl" dense :options="pagination" disable-pagination hide-default-footer disable-sort>
            <template #item.rows="{item}">
              <v-select v-if="item.id < 0" v-model="item.templateId" :items="$root.integrationTemplates" label="Integration template" outlined dense
                        :rules="[ruleRequired]" hide-details="auto" menu-props="offsetY" class="my-1" style="max-width: 240px;" background-color="white"
              />
              <template v-else>{{ item.rowsProcessed }}</template>
            </template>
            <template #item.fromDate="{item}">
              <DateInput v-if="item.id < 0" v-model="item.fromDate" :rules="[ruleRequired]" outlined dense hide-details="auto" classes="my-1" styles="max-width: 180px;" background-color="white" label="From date" />
              <template v-else>{{ item.fromDate }}</template>
            </template>
            <template #item.toDate="{item}">
              <DateInput v-if="item.id < 0" v-model="item.toDate" :rules="[ruleRequired]" outlined dense hide-details="auto" classes="my-1" styles="max-width: 180px;" background-color="white" label="To date" />
              <template v-else>{{ item.toDate }}</template>
            </template>
            <template #item.action="{item}">
              <v-btn icon color="error" @click="currentSource = item,dlgConfirm = true">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="flex-column align-stretch px-4">
          <v-file-input v-model="files" label="Add sources" outlined dense clearable accept=".csv"
                        prepend-icon="" prepend-inner-icon="mdi-paperclip" hide-details multiple class="mb-4"
          />
          <div class="d-flex justify-center">
            <v-btn color="success" min-width="100px" class="mr-2" @click="updateIntegration">Save</v-btn>
            <v-btn color="error" min-width="100px" class="ml-2" @click="show = false">Cancel</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-form>
    <ConfirmationDialog v-model="dlgConfirm" :caption="(currentSource || {}).name || 'N/A'" @confirm="doDelete">Do you really want to delete this source?</ConfirmationDialog>
  </v-dialog>
</template>

<script>
import ConfirmationDialog from './ConfirmationDialog.vue';
import DateInput from '@/components/DateInput.vue';
import mixinValidations from '@/mixinValidations.js';

export default
{
  name: 'IntegrationEdit',
  components:
    {
      ConfirmationDialog,
      DateInput,
    },
  mixins: [mixinValidations],
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
      dlgConfirm: false,
      pagination:
        {
          page: 1,
          itemsPerPage: -1,
        },
      temp: {},
      currentSource: null,
      files: null,
      sourceID: -1,
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
            value: 'rows',
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
          {
            text: 'Action',
            value: 'action',
            class: 'text-subtitle-1 font-weight-bold',
            align: 'center',
            width: 100,
          },
        ];
      },
    },
  watch:
    {
      value(newVal)
      {
        if (newVal)
        {
          this.files = null;
          this.temp = {
            ...this.integration,
            sources: (this.integration.sources || []).slice(),
          };
        }
      },
      files(newVal)
      {
        if (newVal)
        {
          for (let i = 0; i < newVal.length; i++)
          {
            this.temp.sources.push({
              id: this.sourceID--,
              name: newVal[i].name,
              templateId: null,
              rowsProcessed: 0,
              fromDate: '',
              toDate: '',
              file: newVal[i],
            });
          }
          this.$nextTick(() =>
          {
            this.files = null;
          });
        }
      }
    },
  methods:
    {
      updateIntegration()
      {
        if (this.$refs.frm.validate())
        {
          this.show = false;
          this.$emit('update', this.temp);
        }
      },
      doDelete()
      {
        const id = this.currentSource.id;
        const idx = this.temp.sources.findIndex(item => item.id === id);
        if (idx !== -1) this.temp.sources.splice(idx, 1);
      },
    }
};
</script>
