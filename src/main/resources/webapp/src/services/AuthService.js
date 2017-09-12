import User from '@/models/User';
import axios from 'axios';
import sha256 from 'js-sha256';
import ServerInfo from '@/api/ServerInfo';

const AuthService = {
  // Attributes
  connectedUser: undefined,

  publicRoutes: ['/login', '/register', '/forgot'],

  verifyRouteAccess(to, from, next) {
    if (to.path === '/login' && this.isConnected()) {
      // Prevent the user from going to /login if she's already connected
      next(from.path);
    } else if (this.publicRoutes.indexOf(to.path) !== -1
      || this.publicRoutes.indexOf(to.matched[0].path) !== -1) {
      // Authorize access to the publicRoutes described above
      next();
    } else if (this.isConnected()) {
      // Verify authentication for non-public routes
      next();
    } else {
      // Redirect to /login if the user is not connected
      next(`/login?redirectTo=${to.path}`);
    }
  },

  login(formData, successCallback, errorCallback) {
    // Copy formData
    const data = {};
    Object.assign(data, formData);
    // Hash the password
    const hash = sha256.create();
    hash.update(data.password);
    data.password = hash.hex();
    // Do the connexion request
    axios({
      method: 'POST',
      url: `${ServerInfo.BASE_URL}/login`,
      crossDomain: ServerInfo.isCrossDomain,
      data,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        // If connexion succes, store the User object and redirect to the asked page
        this.connectedUser = new User(formData.username, response.headers.authorization);

        // Store the token in the browser's session storage to avoid reconnexion on reload
        this.storeTokenInBrowsersSessionStorage();

        successCallback();
      }
    })
    .catch((error) => {
      errorCallback(error);
      return false;
    });
  },

  register(formData, successCallback, errorCallback) {
    // Copy formData
    const data = {};
    Object.assign(data, formData);
    // Hash the password
    const hash = sha256.create();
    hash.update(data.password);
    data.password = hash.hex();

    // Post the new user request
    axios({
      method: 'POST',
      url: `${ServerInfo.BASE_URL}/sign-up`,
      crossDomain: ServerInfo.isCrossDomain,
      data,
    })
    .then((response) => {
      if (response.status === 200) {
        // If the user has successfully been created, we go to /login
        successCallback();
      }
    })
    .catch((error) => {
      errorCallback(error);
      return false;
    });
  },

  signout() {
    // Remove the connectedUser instance
    this.connectedUser = undefined;
    // and remove the token from the browser's session storage
    this.removeTokenFromBrowsersSessionStorage();
  },

  isConnected() {
    return this.connectedUser && this.connectedUser.username && this.connectedUser.token;
  },

  getAccessToken() {
    return this.connectedUser ? this.connectedUser.getToken() : null;
  },

  storeTokenInBrowsersSessionStorage() {
    sessionStorage.setItem('username', this.connectedUser.username);
    sessionStorage.setItem('access-token', this.connectedUser.token);
  },

  removeTokenFromBrowsersSessionStorage() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('access-token');
  },
};

// Retrieve the user stored in the browser's session-storage on load
if (AuthService.connectedUser === undefined && sessionStorage.getItem('access-token')) {
  const username = sessionStorage.getItem('username');
  const token = sessionStorage.getItem('access-token');
  AuthService.connectedUser = new User(username, token);
}

export default AuthService;
