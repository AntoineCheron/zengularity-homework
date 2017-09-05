<template>
    <div id="login" class="container">
        <div class="login hero is-fullheight">
            <div class="card is-paddingless login-card">
                <div class="columns is-marginless">
                    <div class="column is-one-thirds login-form">
                        <div>
                            <h1>Zenelectricity</h1>
                        </div>
                        <div>
                            <!-- Form for the login mode of the component -->
                            <form v-if="mode === 'login'">
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

                            <!-- Form for the forgot password mode of the component -->
                            <form v-if="mode === 'forgot'">
                                <div class="field">
                                    <p class="control has-icons-left">
                                        <input v-model="email" class="input" type="email" placeholder="Email address">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-envelope"></i>
                                        </span>
                                    </p>
                                </div>
                                <div class="field">
                                    <p class="control">
                                        <button @click="forgot" class="button green-button login-button">
                                            recover password
                                        </button>
                                        <p v-if="error != ''" class="error-label">{{ error }}</p>
                                    </p>
                                </div>
                            </form>

                            <!-- Form for the register mode of the component -->
                            <form v-if="mode === 'register'">
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
                                        <input v-model="email" class="input" type="email" placeholder="Email address">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-envelope"></i>
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
                                    <p class="control has-icons-left">
                                        <input v-model="passwordConfirm" class="input" type="password" placeholder="Confirm your password">
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-lock"></i>
                                        </span>
                                    </p>
                                </div>
                                <div class="field">
                                    <p class="control">
                                        <button @click="register" class="button green-button login-button">
                                            Register
                                        </button>
                                        <p v-if="error != ''" class="error-label">{{ error }}</p>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div>
                            <a id="forgot-link" @click="switchToForgot" v-if="mode === 'login'">Forgot password ?</a>
                            <br/>
                            <a class="signup-link" @click="switchToRegister" v-if="mode === 'login' || mode ==='forgot'">Create a new account !</a>
                        </div>
                    </div>
                    <div class="column is-two-thirds login-thumbnail" :id="thumbnailId">
                        <p id="login-title" v-if="mode === 'login'">{{ loginTitle }}</p>
                        <p id="login-title" v-if="mode === 'forgot'">{{ forgotTitle }}</p>
                        <p id="login-title" v-if="mode === 'register'">{{ registerTitle }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import AuthService from '@/services/AuthService';

  export default {
    props: ['mode'],
    data() {
      return {
        loginTitle: 'Manage Your Electricity.',
        forgotTitle: 'We will help you get your password back !',
        registerTitle: 'Many thanks for joining us !',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        error: '',
      };
    },
    computed: {
      thumbnailId() { return `${this.mode}-thumbnail`; },
    },
    methods: {
      login() {
        // Create the data object to pass to login
        const loginData = {
          username: this.username,
          password: this.password,
        };
        // Make the login request
        AuthService.login(loginData, this.loginCallback, this.errorCallback);
        // Empty the password field
        this.password = undefined;
      },
      loginCallback() {
        const redirectTo = this.$route.query.redirectTo ? this.$route.query.redirectTo : '/home';
        this.$router.push(redirectTo);
        this.emptyFields();
      },
      forgot() {
        // TODO
        alert('forgot');
      },
      register() {
        if (this.password === this.passwordConfirm && this.email !== '' && this.username !== '' && this.password !== '') {
          // Empty the error field
          this.error = '';
          // Create the data object to pass to register
          const registerData = {
            username: this.username,
            email: this.email,
            password: this.password,
          };
          // Make the register request
          AuthService.register(registerData, this.registerCallback, this.errorCallback);
        } else {
          this.error = 'Error ! Passwords don\'t match';
        }
      },
      registerCallback() {
        this.login();
      },
      errorCallback(error) {
        if (this.error.response.status === 403) {
            this.error = 'Wrong username or password';
        } else if (this.error.response.status === 500) {
            this.error = 'Internal server error';
        } else {
            this.error = error;
        }
        this.password = '';
      },
      switchToForgot() {
        this.$router.push('/forgot');
      },
      switchToRegister() {
        this.$router.push('/register');
      },
      emptyFields() {
        this.username = '';
        this.password = '';
        this.passwordConfirm = '';
        this.email = '';
      },
    },
  };
</script>

<style lang="scss" scoped>
    @import 'src/assets/css/var.scss';

    .error-label {
        color: $red;
        margin-top: 4px;
        font-size: 12px;
    }

    .login {
        justify-content: center;

        .login-card {
            align-content: stretch;

            &:hover {
                box-shadow: 0 2px 3px rgba(39, 43, 45, 0.1), 0 0 0 1px rgba(39, 43, 45, 0.1);
            }

            & > .columns {
                height: 80vh;

                .login-form {
                    display: flex;
                    padding: 60px;
                    flex-direction: column;
                    justify-content: space-around;

                    .login-button {
                        margin-top: 24px;
                    }

                    #forgot-link {
                        color: $light-grey;
                        &:hover, :active {
                            color: $light-grey;
                            font-weight: bold;
                        }
                    }

                    .signup-link {
                        color: $green;
                        &:hover, :active {
                            color: $green;
                            font-weight: bold;
                        }
                    }
                }

                .login-thumbnail {
                    background-size: cover;

                    &> p {
                        font-size: 36px;
                        font-weight: bold;
                        color: white;
                        width: 300px;
                        position: relative;
                        top: calc(100% - 155px);
                        left: 46px;
                    }
                }

                #login-thumbnail {
                    background-image: url('../assets/img/login-bg.jpg');

                    &> p {
                        width: 300px;
                        top: calc(100% - 155px);
                    }
                }

                #forgot-thumbnail {
                    background-image: url('../assets/img/forgot-bg.jpg');

                    &> p {
                        width: 410px;
                        top: calc(100% - 155px);
                    }
                }

                #register-thumbnail {
                    background-image: url('../assets/img/register-bg.jpg');

                    &> p {
                        width: 300px;
                        top: calc(100% - 155px);
                    }
                }
            }

            h1 {
                color: $green;
            }
        }
    }
</style>