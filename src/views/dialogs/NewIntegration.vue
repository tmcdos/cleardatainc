<template>
  <v-dialog v-model="show" scrollable>
    <v-form ref="frm">
      <v-card>
        <v-card-title class="primary white--text py-1 pl-3 pr-1">
          Create integration
          <v-spacer />
          <v-btn icon color="white" @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-2 px-4 pt-4">
          <v-data-table :items="sources" :headers="tblHeader" item-key="id" class="my_tbl" dense :options="pagination" disable-pagination hide-default-footer disable-sort>
            <template #item.template="{item}">
              <v-select
                v-model="item.templateId" :items="$root.integrationTemplates" label="Integration template" outlined dense
                :rules="[ruleRequired]" hide-details="auto" menu-props="offsetY" class="my-1" style="max-width: 240px;" background-color="white"
              />
            </template>
            <template #item.fromDate="{item}">
              <DateInput v-model="item.fromDate" :rules="[ruleRequired]" outlined dense hide-details="auto" classes="my-1" styles="max-width: 180px;" background-color="white" label="From date" />
            </template>
            <template #item.toDate="{item}">
              <DateInput v-model="item.toDate" :rules="[ruleRequired]" outlined dense hide-details="auto" classes="my-1" styles="max-width: 180px;" background-color="white" label="To date" />
            </template>
            <template #item.action="{item}">
              <v-btn icon color="error" @click="doDelete(item)">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="flex-column align-stretch px-4">
          <v-file-input
            v-model="files" label="Add sources" outlined dense clearable accept=".csv,.xls,.xlsx"
            prepend-icon="" prepend-inner-icon="mdi-paperclip" hide-details multiple class="mb-4"
          />
          <div class="d-flex justify-center">
            <v-btn color="success" min-width="100px" class="mr-2" @click="createIntegration">Process</v-btn>
            <v-btn color="error" min-width="100px" class="ml-2" @click="show = false">Cancel</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import DateInput from '@/components/DateInput.vue';
import mixinValidations from '@/mixinValidations.js';

export default
{
  name: 'NewIntegration',
  components:
    {
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
    },
  data()
  {
    return {
      pagination:
        {
          page: 1,
          itemsPerPage: -1,
        },
      sources: [],
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
            text: 'Source filename',
            value: 'name',
            class: 'text-subtitle-1 font-weight-bold',
          },
          {
            text: 'Integration template',
            value: 'template',
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
          this.sources = [];
        }
      },
      files(newVal)
      {
        if (newVal)
        {
          for (let i = 0; i < newVal.length; i++)
          {
            this.sources.push({
              id: this.sourceID--,
              name: newVal[i].name,
              templateId: null,
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
      createIntegration()
      {
        if (this.$refs.frm.validate())
        {
          const data = new FormData();
          this.sources.forEach((source, index) =>
          {
            data.append(`source[${index}].template_id`, source.templateId);
            data.append(`source[${index}].from_date`, source.fromDate);
            data.append(`source[${index}].to_date`, source.toDate);
            data.append(`source[${index}].source_file`, source.file);
          });
          this.$axios.post('/Integrations/IntegrationImport', data).then(response =>
          {
            if (response)
            {
              this.show = false;
              this.$emit('save', response);
            }
          });
        }
      },
      doDelete(item)
      {
        const idx = this.sources.findIndex(source => item.id === source.id);
        if (idx !== -1) this.sources.splice(idx, 1);
      },
    }
};
</script>
