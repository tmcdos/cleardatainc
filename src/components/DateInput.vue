<template>
  <v-menu v-model="showPicker" max-width="100%" :close-on-content-click="false" transition="scale-transition" offset-y :scroller="scroller" :disabled="disabled">
    <template #activator="{on}">
      <div v-on="on">
        <v-text-field ref="txt" v-model="dateFormatted" readonly :clearable="!disabled" :rules="checkDate" :class="classes" :style="styles" v-bind="$attrs">
          <v-icon slot="prepend-inner">mdi-calendar-month-outline</v-icon>
        </v-text-field>
      </div>
    </template>
    <v-date-picker v-model="dateValue" first-day-of-week="1" locale-first-day-of-year="4" show-week
                   :allowed-dates="allowed" :min="minimal" :max="maximal" @change="sendValue"
    />
  </v-menu>
</template>

<script>
import { stringDate, dateLocale } from '@/utils';

export default
{
  name: 'DateInput',
  inheritAttrs: false,
  props:
    {
      value:
        {
          type: String,
          default: null
        },
      allowed:
        {
          type: Function,
          default: () => true
        },
      minimal:
        {
          type: String,
          default: undefined
        },
      maximal:
        {
          type: String,
          default: undefined
        },
      scroller:
        {
          type: String,
          default: undefined // eslint-disable-line vue/no-boolean-default
        },
      rules:
        {
          type: Array,
          default: () => []
        },
      disabled:
        {
          type: Boolean,
          default: false
        },
      classes:
        {
          type: [String, Array, Object],
          default: ''
        },
      styles:
        {
          type: [String, Array, Object],
          default: ''
        },
    },
  data()
  {
    return {
      showPicker: false,
      dateValue: this.value,
    };
  },
  computed:
    {
      dateFormatted:
      {
        get()
        {
          return this.dateValue ? dateLocale(stringDate(this.dateValue)) : '';
        },
        set(val)
        {
          this.showPicker = false;
          this.$emit('input', val);
        }
      },
      checkDate()
      {
        const val = this.dateValue;
        return this.rules.map(rule => () => rule(val));
      }
    },
  watch:
    {
      value(newVal)
      {
        this.dateValue = newVal;
      },
      showPicker(newVal, oldVal)
      {
        if (oldVal && !newVal) this.$emit('input', this.dateValue);
      }
    },
  methods:
    {
      sendValue()
      {
        // we must emit only when the value is changed through the datepicker - not from the "value" prop
        this.showPicker = false;
      },
      validate()
      {
        return this.$refs.txt.validate(...arguments);
      }
    }
};
</script>
