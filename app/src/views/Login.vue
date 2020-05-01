<template>
  <v-container class="login-container" fill-height fluid align-center>
    <v-form ref="login-form" @submit="performLogin">
      <v-container fill-height fluid align-center justify-space-between>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="username" label="Email" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="password" label="Password" :type="'password'" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-btn outlined block color="success" type="submit">Log in</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "Login",
  data: function() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleFailure: function(message) {
      this.username = "";
      this.password = "";
      alert(message);
    },
    performLogin: async function(e) {
      e.preventDefault();
      try {
        let res = await this.$apollo.query({
          query: gql`
            query login($email: String, $password: String) {
              login(email: $email, password: $password) {
                failure
                message
                data
              }
            }
          `,
          variables: {
            email: this.username,
            password: this.password
          }
        });

        if (res.data.login.failure) {
          this.handleFailure(res.data.login.message);
        } else {
          console.log(res.data.login.data);
          if (res.data.login.data === 'Y') {
            this.$router.push('main');
          } else {
            this.$router.push('onboard');
          }
        }
      } catch (error) {
        this.handleFailure(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  background: rgba(0,0,0,0) linear-gradient(rgb(111,0,0), rgb(32,1,34)) repeat scroll 0% 0%;
}

.v-form {
  height: 80%;
}
</style>