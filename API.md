# fxa-relier-client Relier API

## Prerequisites
1. An OAuth client id is needed. Go get one from the folks in the #fxa IRC channel on irc.mozilla.org.
2. Download/copy/install a copy of the fxa-relier-client in a location accessible by your site. See [installation](./README.md#installation).
3. In your HTML, include a script tag pointing to fxa-relier-client.js
```html
  <script src="/vendor/fxa-relier-client.min.js"></script>
```

## Initialization

```js
var fxapi = new FirefoxAPI({
  client_id: <client id here>
});
```

## Sign in an existing user

```js
var promise = fxapi.auth.signIn({
    scope: <scope>,
    redirect_uri: <redirect URI>,
    state: <state>
});
```

The promise will not resolve if the user is redirected to Firefox Accounts. The promise will be rejected if a required parameter is missing.

## Sign up a new user

```js
var promise = fxapi.auth.signUp({
    scope: <scope>,
    redirect_uri: <redirect URI>,
    state: <state>
});
```

The promise will not resolve if the user is redirected to Firefox Accounts. The promise will be rejected if a required parameter is missing.

