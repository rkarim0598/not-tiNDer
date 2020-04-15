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
        </v-row>
      </v-container>
    </v-form>
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
      }
    };
  },
  methods: {
    performSignup: async function() {
      const {
        username,
        password,
        confirmedPassword,
        firstName,
        lastName
      } = this.signup;

      // input checking
      if (password !== confirmedPassword) {
        alert("Passwords don't match");
        return;
      } else if (
        Object.values(this.signup).filter(val => val.length === 0).length
      ) {
        alert("One or more empty fields");
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
			alert(res.data.createUser.message);
			
			if (!res.data.createUser.failure) {
				this.$router.push('/login');
			}
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signup-container {
  background: linear-gradient(darkblue, black);
}

.v-form {
  height: 80%;
}
</style>
