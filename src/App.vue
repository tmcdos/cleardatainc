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
import { GET_TOKEN, SET_TOKEN } from '@/store/names';
import { mapGetters, mapMutations } from 'vuex';

export default
{
  name: 'App',
  components:
    {
      CustomHeader,
      CustomFooter,
      LaravelTrace,
    },
  data()
  {
    return {
      tokenTimer: null,
    };
  },
  computed:
    {
      ...mapGetters([GET_TOKEN]),
    },
  watch:
    {
      [GET_TOKEN]:
        {
          immediate: true,
          handler(newVal)
          {
            if (newVal && newVal.expiration)
            {
              const expiration = typeof newVal.expiration === 'string' ? new Date(newVal.expiration) : newVal.expiration;
              if (this.tokenTimer) clearTimeout(this.tokenTimer);
              const diff = expiration.getTime() - Date.now();
              if (diff < 5000)
              {
                this[SET_TOKEN](null);
                this.$router.push({ name: 'Login' });
              }
              else
              {
                if (diff < 100000) this.refreshToken();
                else
                {
                  this.tokenTimer = setTimeout(this.refreshToken, expiration - 100000 - Date.now());
                }
              }
            }
          }
        }
    },
  beforeDestroy()
  {
    if (this.tokenTimer) clearTimeout(this.tokenTimer);
  },
  methods:
    {
      ...mapMutations([SET_TOKEN]),
      refreshToken()
      {
        this.tokenTimer = null;
        this.$axios.post('/refresh', null, {
          spinner: (show) => false, // do not show a spinner
        }).then(response =>
        {
          if (response)
          {
            // update access token
            this[SET_TOKEN](response);
          }
        });
      },
    }
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
