import auth0 from 'auth0-js'
import base64url from "base64url";

const AUTH_DOMAIN = 'shishov.eu.auth0.com';

export class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH_DOMAIN,
      clientID: '3wuCuQMovSMWHnr3zusYt5uEVy35IXis',
      redirectUri: document.location.origin + '/auth_callback',
      responseType: 'token id_token',
      scope: 'openid profile'
    });
  }

  login () {
    this.auth0.authorize();
  }

  handleAuthentication () {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        resolve(authResult);
      });
    });
  }

  getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, function(err, user) {
        if (err)
          return reject(err);

        console.log('[AUTH]', {user});
        resolve(user);
      });
    });
  }

  checkSession(options={}) {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession(options, function (err, authResult) {
        if (err)
          return reject(err);

        console.log('[AUTH] Check session', {authResult});
        resolve(authResult);
      });
    })
  }
}

export function validateToken(token, onValidToken, onError) {
  if (!token) {
    if (onError)
      onError('invalid');
    return false;
  }

  try {
    let parts = token.split('.');
    //let header = JSON.parse(base64url.decode(parts[0]));
    let payload = JSON.parse(base64url.decode(parts[1]));
    let expired = payload.exp * 1000; // ms since epoch

    if (Date.now() > expired) {
      console.log('Token expired');
      if (onError)
        onError('expired');
      return false;
    }

    if (onValidToken)
      onValidToken(payload);

    return true;
  } catch (e) {
    if (onError)
      onError('e');
    console.log('Token validation error', e);
    return false;
  }
}
