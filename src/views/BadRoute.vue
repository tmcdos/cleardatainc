<template>
  <div class="bad_route d-flex full-width">
    <div class="ma-auto text-center">
      <h1>{{ $t('page_not_found') }}</h1>
      <p class="pt-5 pb-3">{{ $t('wrong_path') }}</p>
      <router-link to="/">{{ $t('go_home') }}</router-link>
    </div>
  </div>
</template>

<style lang="scss">
  .bad_route
  {
    min-height: 100%;
    line-height: 1.5;
    color: #888;

    h1
    {
      color: #555;
      font-size: 2em;
      font-weight: 400;
    }

    p
    {
      line-height: 1.2;
    }
  }
</style>

<i18n>
{
  "de": {
    "go_home": "Gehe zu Home",
    "page_not_found": "Seite nicht gefunden",
    "wrong_path": "Diese URL ist falsch - oder stammt von einer älteren Version der Anwendung"
  },
  "en": {
    "go_home": "Go to Home",
    "page_not_found": "Page not found",
    "wrong_path": "This URL is wrong - or from an older version of the application"
  }
}
</i18n>
