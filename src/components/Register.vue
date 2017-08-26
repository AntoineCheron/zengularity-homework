<template>
    <div id="register" class="login hero is-fullheight">
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
                                    <input v-model="email" class="input" type="email" placeholder="Email address">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-envelope"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left">
                                    <input v-model="emailConfirm" class="input" type="email" placeholder="Confirm your email address">
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
                        <!-- Used to create a space to make the visual design consistant -->
                    </div>
                </div>
                <div class="column is-two-thirds login-thumbnail" id="register-thumbnail">
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
      title: 'Many thanks for joining us !',
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    register() {
      // TODO
      if (this.email === this.emailConfirm) {
        this.error = '';
        alert('register');
      } else {
        this.error = 'Error ! The two email address you typed are different';
      }
    },
  },
};
</script>

<style lang="scss">
    @import 'src/assets/css/user-login-commons';

    #register {

        #register-thumbnail {
            background-image: url('../assets/img/register-bg.jpg');

            &> p {
                width: 300px;
                top: calc(100% - 155px);
            }
        }
    }
</style>