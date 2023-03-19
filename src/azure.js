'use strict';
import * as msal from '@azure/msal-browser';

export const EventType = {
  INITIALIZE_START: 'msal:initializeStart',
  INITIALIZE_END: 'msal:initializeEnd',
  ACCOUNT_ADDED: 'msal:accountAdded',
  ACCOUNT_REMOVED: 'msal:accountRemoved',
  LOGIN_START: 'msal:loginStart',
  LOGIN_SUCCESS: 'msal:loginSuccess',
  LOGIN_FAILURE: 'msal:loginFailure',
  ACQUIRE_TOKEN_START: 'msal:acquireTokenStart',
  ACQUIRE_TOKEN_SUCCESS: 'msal:acquireTokenSuccess',
  ACQUIRE_TOKEN_FAILURE: 'msal:acquireTokenFailure',
  ACQUIRE_TOKEN_NETWORK_START: 'msal:acquireTokenFromNetworkStart',
  SSO_SILENT_START: 'msal:ssoSilentStart',
  SSO_SILENT_SUCCESS: 'msal:ssoSilentSuccess',
  SSO_SILENT_FAILURE: 'msal:ssoSilentFailure',
  ACQUIRE_TOKEN_BY_CODE_START: 'msal:acquireTokenByCodeStart',
  ACQUIRE_TOKEN_BY_CODE_SUCCESS: 'msal:acquireTokenByCodeSuccess',
  ACQUIRE_TOKEN_BY_CODE_FAILURE: 'msal:acquireTokenByCodeFailure',
  HANDLE_REDIRECT_START: 'msal:handleRedirectStart',
  HANDLE_REDIRECT_END: 'msal:handleRedirectEnd',
  POPUP_OPENED: 'msal:popupOpened',
  LOGOUT_START: 'msal:logoutStart',
  LOGOUT_SUCCESS: 'msal:logoutSuccess',
  LOGOUT_FAILURE: 'msal:logoutFailure',
  LOGOUT_END: 'msal:logoutEnd'
};

export const msalMixin = {
  data()
  {
    return {
      msal: this.$msal ? this.$msal.data : {}
    };
  },
  created()
  {
    this.$watch('$msal.data', (value) =>
    {
      this.msal = value;
    }, { deep: true });
  }
};

class MSAL
{
  instance;
  tokenExpirationTimers = {};
  data = {
    isAuthenticated: false,
    accessToken: '',
    idToken: '',
    user:
      {
        name: '',
        userName: ''
      },
    custom: {},
    account:
    {
      accountIdentifier: '',
      homeAccountIdentifier: '',
      userName: '',
      name: '',
      idToken: {},
      idTokenClaims: {},
      sid: '',
      environment: '',
    }
  };

  // Config object to be passed to Msal on creation.
  // For a full list of msal.js configuration parameters,
  // visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
  auth = {
    clientId: '',
    authority: '',
    redirectUri: '',
    onAuthentication: (authError, response) =>
    {},
    onToken: (tokenError, response) =>
    {},
    beforeSignOut: () =>
    {}
  };

  cache = {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored -
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  };

  // Add here scopes for id token to be used at MS Identity Platform endpoints.
  loginRequest = {
    scopes: ['openid', 'profile', 'User.Read']
  };

  // Add here scopes for access token to be used at MS Graph API endpoints.
  tokenRequest = {
    scopes: ['User.Read']
  };

  /**
   * @typedef {{
   *   clientId: string,
   *   authority: string,
   *   redirectUri: string,
   *   autoRefreshToken?: boolean,
   *   onAuthentication: (ctx: object, error: AuthError, response: any) => any,
   *   onToken: (ctx: object, error: AuthError | null, response: any | null) => any,
   *   beforeSignOut: (ctx: object) => any
   *  }} Auth
   * @typedef {{
   *   scopes?: string[],
   *   account?: any
   * }} Request
   * @typedef {{
   *   globalMixin?: boolean
   * }} FrameworkOptions
   * @typedef {{
   *   auth: Auth,
   *   loginRequest: Request,
   *   tokenRequest: Request,
   *   cache?: CacheOptions,
   *   system?: SystemOptions,
   *   framework?: FrameworkOptions
   * }} MsalOptions
   * @param options
   */
  constructor(options)
  {
    if (!options.auth.clientId)
    {
      throw new Error('auth.clientId is required');
    }
    this.auth = Object.assign(this.auth, options.auth);
    this.cache = Object.assign(this.cache, options.cache);
    this.loginRequest = Object.assign(this.loginRequest, options.loginRequest);
    this.tokenRequest = Object.assign(this.tokenRequest, options.tokenRequest);

    const config = {
      auth: this.auth,
      cache: this.cache
    };
    this.instance = new msal.PublicClientApplication(config);
    this.instance.addEventCallback((event) =>
    {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload)
      {
        const payload = event.payload;
        const account = payload.account;
        this.instance.setActiveAccount(account);
      }
    });
    this.loginRedirect();
  }

  loginPopup()
  {
    return this.instance.loginPopup(this.loginRequest).then(loginResponse =>
    {
      if (loginResponse !== null)
      {
        this.data.user.userName = loginResponse.account.username;
        this.data.accessToken = loginResponse.accessToken;
        this.data.idToken = loginResponse.idToken;
        this.data.account = loginResponse.account;
        return loginResponse;
      }
      else
      {
        // need to call getAccount here?
        const currentAccounts = this.instance.getAllAccounts();
        if (process.env.NODE_ENV === 'development') console.debug('all accounts: ' + JSON.stringify(currentAccounts));
        if (currentAccounts === null)
        {
          // nothing to do
        }
        else if (currentAccounts.length > 1)
        {
          // Add choose account code here
        }
        else if (currentAccounts.length === 1)
        {
          this.data.user.userName = currentAccounts[0].username;
          this.data.user.userName = currentAccounts[0].name;
          if (process.env.NODE_ENV === 'development') console.debug('this.data: ' + JSON.stringify(this.data));
        }
      }
    }).catch(error =>
    {
      sessionStorage.removeItem('msal.interaction.status');
      console.error(error);
    });
  }

  async loginRedirect()
  {
    await this.instance.handleRedirectPromise().then(async (response) =>
    {
      let accountId;
      if (response !== null)
      {
        accountId = response.account.homeAccountId;
        // Display signed-in user content, call API, etc.
      }
      else
      {
        // In case multiple accounts exist, you can select
        const currentAccounts = this.instance.getAllAccounts();

        if (currentAccounts.length === 0)
        {
          // no accounts signed-in, attempt to sign a user in
          await this.instance.loginRedirect(this.loginRequest);
        }
        else if (currentAccounts.length > 1)
        {
          // Add choose account code here
        }
        else if (currentAccounts.length === 1)
        {
          accountId = currentAccounts[0].homeAccountId; // eslint-disable-line no-unused-vars
        }
      }
    });
  }

  async ssoSilent()
  {
    try
    {
      const loginResponse = await this.instance.ssoSilent(this.tokenRequest); // eslint-disable-line no-unused-vars
    }
    catch (err)
    {
      if (err instanceof msal.InteractionRequiredAuthError)
      {
        const loginResponse = await this.instance.loginPopup(this.tokenRequest).catch(error => // eslint-disable-line no-unused-vars
        {
          // handle error
          console.error('[Error]' + JSON.stringify(error));
        });
      }
      else
      {
        // handle error
        console.error('[Error]' + JSON.stringify(err));
      }
    }
  }

  async signOut()
  {
    const logoutRequest = {
      account: this.instance.getAccountByUsername(this.data.user.userName)
    };
    await this.instance.logout(logoutRequest);
    this.data.accessToken = '';
    this.data.idToken = '';
    this.data.user.userName = '';
  }

  async logoutRedirect()
  {
    const logoutRequest = {
      account: this.instance.getAccountByUsername(this.data.user.userName)
    };
    await this.instance.logoutRedirect(logoutRequest);
    this.data.accessToken = '';
    this.data.idToken = '';
    this.data.user.userName = '';
  }

  async acquireToken(request = this.loginRequest, retries = 0)
  {
    this.loginRequest.account = this.data.account;
    if (process.env.NODE_ENV === 'development') console.log('in acquireToken! retries: ' + retries);
    try
    {
      const response = await this.instance.acquireTokenSilent(request);
      this.handleTokenResponse(null, response);
    }
    catch (error)
    {
      if (process.env.NODE_ENV === 'development') console.log('silent token acquisition fails.');
      if (error instanceof msal.InteractionRequiredAuthError)
      {
        if (process.env.NODE_ENV === 'development') console.log('acquiring token using popup');
        return await this.instance.acquireTokenPopup(request).catch(error =>
        {
          console.error(error);
        });
      }
      else if (retries > 0)
      {
        if (process.env.NODE_ENV === 'development') console.log('in acquireToken with retries: ' + retries);
        return await new Promise((resolve) =>
        {
          if (process.env.NODE_ENV === 'development') console.log('setting timeout 5 seconds');
          setTimeout(async () =>
          {
            const res = await this.acquireToken(request, retries - 1);
            resolve(res);
          }, 5 * 1000);
        });
      }
      return false;
    }
  }

  async getAcquireToken(request = this.loginRequest, retries = 0)
  {
    this.loginRequest.account = this.data.account;
    if (process.env.NODE_ENV === 'development') console.log('in getAcquireToken! retries: ' + retries);
    try
    {
      const response = await this.instance.acquireTokenSilent(request);
      await this.handleTokenResponse(null, response);
      return response;
    }
    catch (error)
    {
      if (process.env.NODE_ENV === 'development') console.log('getAcquireToken: silent token acquisition fails.');
    }
    return {};
  }

  isAuthenticated()
  {
    return this.instance.getAllAccounts() !== null;
  }

  handleTokenResponse(error, response)
  {
    if (error) return;
    if (this.data.accessToken !== response.accessToken)
    {
      this.setToken('accessToken', response.accessToken, response.expiresOn, response.scopes);
      if (process.env.NODE_ENV === 'development') console.log('got new accessToken: ', response);
    }
    if (this.data.idToken !== response.idToken.rawIdToken)
    {
      this.setToken('idToken', response.idToken.rawIdToken, new Date(response.idToken.expiration * 1000), [this.auth.clientId]);
      if (process.env.NODE_ENV === 'development') console.log('got new idToken: ' + response.idToken.rawIdToken);
    }
  }

  /**
   * @param tokenType {String}
   * @param token {String}
   * @param expiresOn {Date}
   * @param scopes {String[]}
   */
  setToken(tokenType, token, expiresOn, scopes)
  {
    const expirationOffset = 10000000;
    const expiration = (expiresOn || new Date()).getTime() - (new Date()).getTime() - expirationOffset;
    if (process.env.NODE_ENV === 'development') console.log('set token: ' + expiration);
    if (expiration >= 0)
    {
      if (process.env.NODE_ENV === 'development') console.log('setting token: ' + tokenType + ' with val: ' + token);
      this.data[tokenType] = token;
    }
    if (this.tokenExpirationTimers[tokenType]) clearTimeout(this.tokenExpirationTimers[tokenType]);
    this.tokenExpirationTimers[tokenType] = window.setTimeout(async () =>
    {
      if (process.env.NODE_ENV === 'development') console.log('auto refreshing token: ' + this.auth.autoRefreshToken);
      if (this.auth.autoRefreshToken)
      {
        await this.acquireToken({ scopes }, 3);
      }
      else
      {
        this.data[tokenType] = '';
        if (process.env.NODE_ENV === 'development') console.log('setting token to none:' + this.data.accessToken);
      }
    }, expiration);
  }
}

export default class MsalPlugin
{
  static install(Vue, options)
  {
    Vue.prototype.$msal = new MsalPlugin(options, Vue);
  }

  constructor(options, Vue)
  {
    const msal = new MSAL(options);
    if (Vue && options.framework && options.framework.globalMixin)
    {
      Vue.mixin(msalMixin);
    }
    return {
      instance: msal.instance,
      data: msal.data,
      loginPopup()
      {
        return msal.loginPopup();
      },
      async loginRedirect()
      {
        await msal.loginRedirect();
      },
      async ssoSilent()
      {
        await msal.ssoSilent();
      },
      async signOut()
      {
        await msal.signOut();
      },
      async logoutRedirect()
      {
        await msal.logoutRedirect();
      },
      async acquireToken()
      {
        await msal.acquireToken();
      },
      async getAcquireToken()
      {
        return msal.getAcquireToken();
      },
      isAuthenticated()
      {
        return msal.isAuthenticated();
      }
    };
  }
}
