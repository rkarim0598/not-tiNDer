<template>
  <v-container class="login-container" fill-height fluid align-center>
    <v-form ref="login-form" @submit="performLogin">
      <v-container fill-height fluid align-center justify-space-between>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="username" maxlength="20" counter="20" label="Email" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="password" maxlength="60" counter="60" label="Password" :type="'password'" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-btn outlined block color="success" type="submit">Log in</v-btn>
          <v-btn text color="primary" @click="$router.push('signup')">Need an account?</v-btn>
        </v-row>
      </v-container>
    </v-form>
    <error-snackbar :error="error"></error-snackbar>
    <v-snackbar color="success" top :value="success ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{success}}</div>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import ErrorSnackbar from "../components/ErrorSnackbar"

export default {
  name: "Login",
  components: { ErrorSnackbar },
  data: function() {
    return {
      username: "",
      password: "",
      error: "",
      success: "",
    };
  },
  methods: {
    handleFailure: function(message) {
      this.username = "";
      this.password = "";
      this.error = message;
      setTimeout(() => (this.error = ""), 1500);
    },
    performLogin: async function(e) {
      e.preventDefault();
      try {
        let res = await this.$apollo.mutate({
          mutation: gql`
            mutation login($email: String, $password: String) {
              login(email: $email, password: $password) {
                user_id
                joined
              }
            }
          `,
          variables: {
            email: this.username,
            password: this.password
          }
        });

        this.success = "Successfully logged in!";
        if (res.data.login.joined === "Y") {
          setTimeout(() => this.$router.push("main"), 500);
        } else {
          setTimeout(() => this.$router.push("onboard"), 500);
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
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
}

.v-form {
  height: 80%;
  width: 80%;
}
</style>