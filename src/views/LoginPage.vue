<template>
  <main class="login_page">
    <v-form ref="frm" class="ma-auto" @submit.prevent="doLogin">
      <v-card outlined>
        <v-card-title class="primary white--text py-2">LOGIN</v-card-title>
        <v-card-text class="px-4 pt-5 pb-0">
          <v-text-field ref="user" v-model.trim="username" label="Username" outlined dense :rules="[ruleRequired]" name="username" autocomplete="username" maxlength="80">
            <v-icon slot="prepend-inner" class="mr-2">mdi-account-outline</v-icon>
          </v-text-field>
          <v-text-field v-model.trim="password" label="Password" outlined dense :rules="[ruleRequired]" name="password" autocomplete="current-password" maxlength="80" :type="showPassword ? 'text' : 'password'">
            <v-icon slot="prepend-inner" class="mr-2">mdi-lock-outline</v-icon>
            <v-tooltip slot="append" top>
              <template #activator="{on}">
                <v-btn icon class="" v-on="on" @click="showPassword = !showPassword">
                  <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </v-btn>
              </template>
              {{ showPassword ? 'Hide' : 'Reveal' }}
            </v-tooltip>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="px-3 pt-1 pb-3 justify-center">
          <v-btn color="primary" class="px-4" type="submit" :disabled="!(username && password)">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </main>
</template>

<script>
import validations from '../mixinValidations';
import { SET_TOKEN, SET_USER } from '@/store/names.js';
import { mapMutations } from 'vuex';

export default
{
  name: 'LoginPage',
  mixins: [validations],
  data()
  {
    return {
      username: '',
      password: '',
      showPassword: false,
    };
  },
  mounted()
  {
    this.$refs.user.focus();
  },
  methods:
    {
      ...mapMutations([SET_USER, SET_TOKEN]),
      doLogin()
      {
        this[SET_TOKEN]({
          token: '123',
          token_type: 'bearer',
          expires_in: 3600,
        });
        this[SET_USER]({
          id: 1,
          email: 'ivo@abv.bg',
          fullName: 'IVO GELOV',
        });
        this.$router.push({ name: 'Home' });
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
