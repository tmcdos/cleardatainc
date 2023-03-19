<template>
  <main class="login_page">
    <v-form ref="frm" class="ma-auto" @submit.prevent="doLogin">
      <v-card outlined>
        <v-card-title class="primary white--text py-2">LOGIN</v-card-title>
        <v-card-text class="text-body-1 pt-5">
          You need a Microsoft account to access this application.
          <br>
          Press "Continue" to navigate to Microsoft and log in with your account.
        </v-card-text>
        <v-card-actions class="px-3 pt-1 pb-3 justify-center">
          <v-btn color="primary" class="px-4" type="submit">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </main>
</template>

<script>
import { SET_TOKEN } from '@/store/names';
import { mapMutations } from 'vuex';

export default
{
  name: 'LoginPage',
  created()
  {
    if (this.$msal.isAuthenticated())
    {
      this.$msal.acquireToken().then(token =>
      {
        if (token)
        {
          this.$store.commit('SET_TOKEN', token.accessToken);
          this.$router.push({ name: 'Home' });
        }
      });
    }
  },
  methods:
    {
      ...mapMutations([SET_TOKEN]),
      doLogin()
      {
        //this.$msal.instance.browserStorage.clear();
        this.$msal.loginPopup({
          scopes: [process.env.VUE_APP_MSAD_SCOPE, 'profile', 'email', 'openid'],
          prompt: 'select_account',
        }).then(response =>
        {
          if (response)
          {
            this.$store.commit('SET_TOKEN', response.accessToken);
            this.$router.push({ name: 'Home' });
          }
        });
      }
    }
};
</script>

<style lang="scss">
.login_page
{
  display: flex;
  min-height: 100%;
}
</style>
