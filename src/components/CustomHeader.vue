<template>
  <v-app-bar color="primary" dark app clipped-left dense>
    <template v-if="loggedIn">
      <v-spacer />
      <v-btn color="amber" light @click="doLogout">Logout</v-btn>
    </template>
  </v-app-bar>
</template>

<script>
export default
{
  name: 'CustomHeader',
  computed:
    {
      loggedIn()
      {
        return this.$msal.isAuthenticated();
      }
    },
  methods:
    {
      doLogout()
      {
        this.$msal.signOut();
        this.$router.push({ name: 'Login' });
      }
    }
};
</script>
