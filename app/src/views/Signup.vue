<template>
  <v-container class="signup-container" fill-height fluid align-center>
    <v-form ref="signup-form" @submit="performSignup">
      <v-container fill-height fluid align-center justify-space-between>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="signup.firstName" label="First name" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="signup.lastName" label="Last name" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-text-field dark v-model="signup.username" label="Email" required />
        </v-row>
        <v-row align="center" justify="center">
          <v-text-field
            dark
            v-model="signup.password"
            label="Password"
            :type="'password'"
            required
          />
        </v-row>
        <v-row align="center" justify="center">
          <v-text-field
            dark
            v-model="signup.confirmedPassword"
            label="Confirm password"
            :type="'password'"
            required
          />
        </v-row>
        <v-row align="center" justify="center">
          <v-btn outlined block color="success" type="submit">Join</v-btn>
          <v-btn text color="primary" @click="$router.push('login')">Already have an account?</v-btn>
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
  name: "Signup",
  data: function() {
    return {
      signup: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmedPassword: ""
      },
      error: "",
      success: ""
    };
  },
  methods: {
    performSignup: async function(e) {
      e.preventDefault();

      const {
        username,
        password,
        confirmedPassword,
        firstName,
        lastName
      } = this.signup;

      // input checking
      if (password !== confirmedPassword) {
        this.error = "Passwords are not identical";
        return;
      } else if (
        Object.values(this.signup).filter(val => val.length === 0).length
      ) {
        this.error = "One or more empty fields";
        return;
      }

      let res = await this.$apollo.mutate({
        mutation: gql`
          mutation($input: NewUserInput) {
            createUser(input: $input) {
              failure
              message
              data
            }
          }
        `,
        variables: {
          input: {
            user_id: username,
            password: password,
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (!res.data.createUser.failure) {
        this.success = res.data.createUser.message;
        setTimeout(() => this.success = '', 1000);
        this.$router.push("/login");
      } else {
        this.error = res.data.createUser.message;
      }
    }
  },
  watch: {
    error: function(value) {
      value && setTimeout(() => (this.error = ""), 1500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signup-container {
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
