<template>
    <div id="forgot" class="login hero is-fullheight">
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
                    </div>
                    <div>
                        <a class="signup-link" @click="register">Create a new account !</a>
                    </div>
                </div>
                <div class="column is-two-thirds login-thumbnail" id="forgot-thumbnail">
                    <p id="forgot-title">{{ title }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
  data() {
    return {
      title: 'We will help you get your password back !',
      email: '',
      error: '',
    };
  },
  methods: {
    forgot() {
      // TODO
      alert('forgot');
    },
    register() {
      this.$router.push('/register');
    },
  },
};
</script>

<style lang="scss">
    @import 'src/assets/css/user-login-commons';

    #forgot {
        #forgot-thumbnail {
            background-image: url('../assets/img/forgot-bg.jpg');

            &> p {
                width: 410px;
                top: calc(100% - 155px);
            }
        }
    }
</style>