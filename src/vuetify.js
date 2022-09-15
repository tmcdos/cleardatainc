import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons:
    {
      iconfont: 'mdi',
    },
  theme:
    {
      options:
        {
          customProperties: true
        },
      themes:
        {
          light:
            {
              accent: '#9C27B0',
            }
        }
    }
});
