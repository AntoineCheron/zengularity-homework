export default class User {

  constructor(username, token) {
    this.username = username;
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }

  emptyToken() {
    this.token = undefined;
  }
}
