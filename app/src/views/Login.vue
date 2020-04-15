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
    performLogin: async function() {
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
      alert(res.data.login.message);
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  background: linear-gradient( darkblue, black );
}

.v-form {
  height: 80%;
}
</style>