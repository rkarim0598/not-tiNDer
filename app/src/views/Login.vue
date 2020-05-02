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
    <v-snackbar color="error" bottom :value="error ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{error}}</div>
    </v-snackbar>
    <v-snackbar color="success" top :value="success ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{success}}</div>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "Login",
  data: function() {
    return {
      username: "",
      password: "",
      error: "",
      success: ""
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
                user_id,
                joined
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
          this.success = "Successfully logged in!";

          if (res.data.login.data === "Y") {
            setTimeout(() => this.$router.push("main"), 500);
          } else {
            setTimeout(() => this.$router.push("onboard"), 500);
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
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
}

.v-form {
  height: 80%;
}
</style>