// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0_clientId: 'dMIF66dbZJys99zxOvBDoYdyZmsP2t45',
  auth0_domain: 'dev-usrif-nj.us.auth0.com',
  auth0_audience: 'https://dev-usrif-nj.us.auth0.com/api/v2/',
  auth0_callbackUrl: window.location.protocol + '//localhost:4200/authorize',
  auth0_logoutCallbackUrl: window.location.protocol + '//localhost:4200/home',
  base_api_url: 'http://localhost:8088',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
