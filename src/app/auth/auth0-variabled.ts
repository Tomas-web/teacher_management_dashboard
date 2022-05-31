import { environment } from '../../environments/environment';

interface AuthConfig {
  clientID: string;
  domain: string;
  audience: string;
  callbackURL: string;
  logoutCallbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: environment.auth0_clientId,
  domain: environment.auth0_domain,
  audience: environment.auth0_audience,
  callbackURL: environment.auth0_callbackUrl,
  logoutCallbackURL: environment.auth0_logoutCallbackUrl,
};

