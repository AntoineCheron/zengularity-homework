<template>
    <div id="login" class="login hero is-fullheight">
        <div class="card is-paddingless login-card">
            <div class="columns is-marginless">
                <div class="column is-one-thirds login-form">
                    <div>
                        <h1>Zenelectricity</h1>
                    </div>
                    <div>
                        <form>
                            <div class="field">
                                <p class="control has-icons-left">
                                    <input v-model="username" class="input" type="text" placeholder="Username">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-user"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left">
                                    <input v-model="password" class="input" type="password" placeholder="Password">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-lock"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control">
                                    <button @click="login" class="button green-button login-button">
                                        Login
                                    </button>
                                    <p v-if="error != ''" class="error-label">{{ error }}</p>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div>
                        <a id="forgot-link" @click="forgotPassword">Forgot password ?</a>
                        <br/>
                        <a class="signup-link" @click="register">Create a new account !</a>
                    </div>
                </div>
                <div class="column is-two-thirds login-thumbnail" id="login-thumbnail">
                    <p id="login-title">{{ title }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
  data() {
    return {
      title: 'Manage Your Electricity.',
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    login() {
      // TODO
      alert('login');
    },
    forgotPassword() {
      this.$router.push('/forgot');
    },
    register() {
      this.$router.push('/register');
    },
  },
};
</script>

<style lang="scss">
    @import 'src/assets/css/user-login-commons';

    #login {
        #forgot-link {
            color: $light-grey;
            &:hover, :active {
                color: $light-grey;
                font-weight: bold;
            }
        }

        #login-thumbnail {
            background-image: url('../assets/img/login-bg.jpg');

            &> p {
                width: 300px;
                top: calc(100% - 155px);
            }
        }
    }
</style>