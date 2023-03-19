<template>
  <v-app :route="$route.name">
    <CustomHeader />
    <v-main>
      <transition name="fade" appear mode="out-in">
        <router-view class="pa-4" />
      </transition>
    </v-main>
    <CustomFooter />
    <LaravelTrace />
    <v-overlay :value="$root.spin > 0" z-index="998">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <vue-snotify />
  </v-app>
</template>

<script>
import CustomFooter from './components/CustomFooter';
import CustomHeader from './components/CustomHeader.vue';
import LaravelTrace from '@/components/LaravelTrace';

export default
{
  name: 'App',
  components:
    {
      CustomHeader,
      CustomFooter,
      LaravelTrace,
    },
};
</script>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active
  {
    transition: all 0.15s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fade-enter,
  .fade-leave-active
  {
    opacity: 0;
    transform: translate(2em, 0);
  }

  table.my_tbl td,
  table.my_tbl th
  {
    padding: 4px;
  }

  .my_tbl.v-data-table
  {
    padding-right: 1px;
  }

  table.my_tbl,
  .my_tbl.v-data-table table
  {
    border-collapse: collapse;

    thead
    {
      background-color: #FFCC80;
    }

    td,
    th
    {
      border: 1px solid #A5A5A5;
    }
  }

  .theme--light.v-data-table.v-data-table--fixed-header.my_tbl thead th
  {
    background-color: #FFCC80;
    box-shadow: inset 0 1px 0 #A5A5A5, inset 0 -1px 0 #A5A5A5;
  }

  .full-width
  {
    width: 100%;
  }

  .v-application .v-dialog
  {
    width: auto;
  }

  .v-input__prepend-inner,
  .v-input__append-inner
  {
    margin-top: 0 !important;
    align-self: stretch !important;
    align-items: center;
    padding: 0 !important;
  }

</style>

<style lang="scss" src="vue-snotify/styles/material.scss"></style>
